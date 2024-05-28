import { useEffect, useState } from 'react';
import Table from '../components/DataTable';
import moment from 'moment';
import dayjs from 'dayjs';
import { useApiRequest } from '../api/useApi';
import { Disclosure } from '@headlessui/react';
import { Badge, Spin, Tag } from 'antd';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import { LoadingOutlined } from '@ant-design/icons';
import { datePassed, lockVaccine } from '../utils/validate';
import { colorCodeVaccines } from '../utils/vaccineController'

export default function VaccinationSchedule() {

  const columns = [
    {
      title: 'Vaccine',
      dataIndex: 'vaccine',
      key: 'vaccine',
    },
    {
      title: 'Dose Number',
      dataIndex: 'doseNumber',
      key: 'doseNumber',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Date Administered',
      dataIndex: 'administeredDate',
      key: 'administeredDate',
      render: (text, record) => text && record.status === 'completed' ? dayjs(text).format('DD-MM-YYYY') : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        const missed = datePassed(text, moment(record?.dueDate, 'DD-MM-YYYY').format('YYYY-MM-DD'))
        return (
          <Tag
            color={
              text === 'completed'
                ? 'green'
                : text === 'Not Administered'
                ? 'red'
                : missed &&
                  text !== 'Contraindicated' &&
                  text !== 'Not Administered'
                ? 'red'
                : text === 'Contraindicated'
                ? 'yellow'
                : 'gray'
            }
          >
            {text === 'completed'
              ? 'Administered'
              : text === 'Not Administered'
              ? 'Not Administered'
              : text === 'Contraindicated'
              ? 'Contraindicated'
              : missed && text !== 'entered-in-error'
              ? 'Missed'
              : 'Upcoming'}
          </Tag>
        )
      },
    },
  ]

  const { get } = useApiRequest()

  const [vaccineSchedules, setVaccineSchedules] = useState([])
  const [loading, setLoader] = useState(false)
  const [categorizedSchedules, setCategorizedSchedules] = useState({})

  function categorizeDataBySeries(data) {
    let categorizedData = {};

    data.forEach(obj => {
        let series = obj.series;
        if (categorizedData.hasOwnProperty(series)) {
            categorizedData[series].push({
              doseNumber: obj?.doseNumberPositiveInt,
              vaccine: obj?.vaccineCode?.[0]?.text,
              status: obj?.forecastStatus?.coding?.[0]?.display,
              administeredDate: obj?.administeredDate,
              dueDate: moment(obj?.dateCriterion?.[0]?.value).format('DD-MM-YYYY'),
            });
        } else {
            categorizedData[series] = [{
              doseNumber: obj?.doseNumberPositiveInt,
              vaccine: obj?.vaccineCode?.[0]?.text,
              status: obj?.forecastStatus?.coding?.[0]?.display,
              administeredDate: obj?.administeredDate,
              dueDate: moment(obj?.dateCriterion?.[0]?.value).format('DD-MM-YYYY'),
            }];
        }
    });

    Object.keys(categorizedData).forEach(series => {
        categorizedData[series].sort((a, b) => {
            return new Date(a.dateCriterion?.[0]?.value) - new Date(b.dateCriterion?.[0]?.value);
        });
    });
    return categorizedData;
  }

  const fetchUserSchedule = async () => {
    setLoader(true)
    const user = JSON.parse(localStorage.getItem('user'))
    const userSchedule = await get(`/hapi/fhir/ImmunizationRecommendation?patient=Patient/${user?.fhirPatientId}`)

    const userVaccines = await get(`/hapi/fhir/Immunization?patient=Patient/${user?.fhirPatientId}`)
    const administeredVaccines = userVaccines?.entry?.map((vaccine) => vaccine?.resource?.vaccineCode?.text)

    const recommendations = userSchedule?.entry?.[0]?.resource?.recommendation

    const rec = recommendations.map(recommendation => {
      if (!administeredVaccines?.includes(recommendation?.vaccineCode?.[0]?.text)) {
        return recommendation;
      }
      if (administeredVaccines?.includes(recommendation?.vaccineCode?.[0]?.text)) {
        const item = userVaccines?.entry?.find((vaccine) => vaccine?.resource?.vaccineCode?.text === recommendation?.vaccineCode?.[0]?.text);
        recommendation.forecastStatus.coding = [{
          code: item?.resource?.status,
          display: item?.resource?.status
        }]
        recommendation.administeredDate = item?.resource?.recorded
        return recommendation
      }
    }).filter(Boolean);

    if (Array.isArray(recommendations)) {
      const vaccineSchedules = recommendations.map((schedule) => ({
        dose: schedule?.doseNumberPositiveInt,
        title: schedule?.vaccineCode?.[0]?.text,
        status: schedule?.forecastStatus?.coding?.[0]?.display,
        schedule: moment(schedule?.dateCriterion?.[0]?.value).format('DD-MM-YYYY'),
      }))
      setVaccineSchedules(vaccineSchedules)

      const categorised = categorizeDataBySeries(rec)

      setCategorizedSchedules(categorised)
    }
    setLoader(false)
  }

  useEffect(() => {
    fetchUserSchedule()
  }, [])

  return (
    <>
      <br className='hidden md:block' />

      <h3 className='sm:hidden font-bold text-2xl'>Vaccination Schedule</h3>

      {!vaccineSchedules.length && !loading && <div className='text-center font-bold mt-5'>No Schedules found for user</div>}

      {vaccineSchedules.length && !loading ? (
          Object.keys(categorizedSchedules).map(
            (category) =>
              Object.keys(categorizedSchedules).length > 0 && (
                <dl
                  key={category}
                  className="mt-5 space-y-6 divide-y divide-gray-900/10"
                >
                  <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-4 mt-5 shadow">
                    <Disclosure
                      as="div"
                      key={category}
                      id={category}
                      className="pt-2"
                    >
                      {({ open }) => {
                        const categoryvaccines = categorizedSchedules[category]
                        const color = colorCodeVaccines(categoryvaccines)

                        return (
                          <>
                            <dt>
                              <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                                <div className="flex w-full justify-between px-10">
                                  <span>
                                    <span className="flex items-center">
                                      { category }

                                      <Badge
                                        className="ml-2 vaccination-status"
                                        size="large"
                                        color={color}
                                      />
                                    </span>
                                  </span>
                                  <span>
                                    {open ? (
                                      <MinusSmallIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                       />
                                    ) : (
                                      <PlusSmallIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </div>
                              </Disclosure.Button>
                            </dt>
                            <Disclosure.Panel
                              as="dd"
                              className="mt-2 md:pr-5 overflow-x-auto">

                              <div className='hidden md:block'>

                                <Table
                                  columns={columns}
                                  dataSource={categorizedSchedules[category]}
                                  pagination={false}
                                  size="small"
                                />
                              </div>

                              <div className="sm:hidden mt-5">
                                {categorizedSchedules[category].map((result) => (
                                  <div key={result.id} className='w-full grid grid-cols-5 gap-3 border border-1 border-gray-200'>
                                    <div className="py-5 pr-6 col-span-4">
                                      <div className="text-sm pl-5 leading-6 text-gray-900">{result.title}</div>
                                      <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">{result.schedule} - Dose: {result.dose}</div>
                                    </div>
                                    <div className="py-5 max-w-auto right-5">
                                      <div className="flex">
                                        <a
                                          href='#'
                                          className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500"
                                        >
                                          View
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )
                      }}
                    </Disclosure>
                  </div>
                </dl>
              )
          )
        ) : (
          <div className="my-10 mx-auto flex justify-center h-5 w-5">
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 50,
                  }}
                  spin
                />
              }
            />
          </div>
        )}

    </>
  )
}

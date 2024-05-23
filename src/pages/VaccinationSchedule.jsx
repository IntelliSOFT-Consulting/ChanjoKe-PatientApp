import { useEffect, useState } from 'react';
import Table from '../components/Table';
import moment from 'moment';import { useApiRequest } from '../api/useApi';
import { Disclosure } from '@headlessui/react';
import { Badge } from 'antd';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const tableHeaders = [
  { title: 'Dose', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Status', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Schedule', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

export default function VaccinationSchedule() {

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
              dose: obj?.doseNumberPositiveInt,
              title: obj?.vaccineCode?.[0]?.text,
              status: obj?.forecastStatus?.coding?.[0]?.display,
              schedule: moment(obj?.dateCriterion?.[0]?.value).format('DD-MM-YYYY'),
            });
        } else {
            categorizedData[series] = [{
              dose: obj?.doseNumberPositiveInt,
              title: obj?.vaccineCode?.[0]?.text,
              status: obj?.forecastStatus?.coding?.[0]?.display,
              schedule: moment(obj?.dateCriterion?.[0]?.value).format('DD-MM-YYYY'),
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
      // if (administeredVaccines?.includes(recommendation?.vaccineCode?.[0]?.text)) {
      //   const item = userVaccines?.entry?.find((vaccine) => vaccine?.resource?.vaccineCode?.text === recommendation?.vaccineCode?.[0]?.text);

      //   return item?.resource
      // }
    }).filter(Boolean);

    console.log({ rec })

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
                                  theaders={tableHeaders}
                                  data={categorizedSchedules[category]} />
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

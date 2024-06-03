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
import BaseTabs from '../components/BaseTabs';

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
      setVaccineSchedules(recommendations)
    }
    setLoader(false)
  }

  useEffect(() => {
    fetchUserSchedule()
  }, [])

  return (
    <>
      <br className='hidden md:block' />

      {vaccineSchedules.length > 1 && !loading &&
        <>
          <div className="mt-4">
            <BaseTabs data={vaccineSchedules} columns={columns}/>
          </div>
        </>
      }

    </>
  )
}

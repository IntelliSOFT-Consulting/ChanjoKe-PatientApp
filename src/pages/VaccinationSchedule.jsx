import { useEffect, useState } from 'react';
import moment from 'moment';
import dayjs from 'dayjs';
import { Tag } from 'antd';
import { datePassed } from '../utils/validate';
import BaseTabs from '../components/BaseTabs';
import useImmunizationRecommendation from '../hooks/useImmunizationRecommendation'
import useImmunization from '../hooks/useImmunization'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

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
              : moment().isAfter(moment(record?.dueDate, 'DD-MM-YYYY').format('YYYY-MM-DD'))
              ? 'Due'
              : 'Upcoming' }
          </Tag>
        )
      },
    },
  ]

  const {
    loader,
    recommendations,
    fetchUserRecommendations,
  } = useImmunizationRecommendation()
  const {
    immunizations,
    fetchPatientImmunizations,
  } = useImmunization()
  const user = JSON.parse(localStorage.getItem('user'))

  const [vaccineSchedules, setVaccineSchedules] = useState([])

  useEffect(() => {
    fetchUserRecommendations(user)
    fetchPatientImmunizations(user)
  }, [])

  useEffect(() => {
    const administeredVaccines = immunizations?.map((vaccine) => vaccine?.resource?.vaccineCode?.text)

    recommendations?.map(recommendation => {
      if (!administeredVaccines?.includes(recommendation?.vaccineCode?.[0]?.text)) {
        return recommendation;
      }
      if (administeredVaccines?.includes(recommendation?.vaccineCode?.[0]?.text)) {
        const item = immunizations?.find((vaccine) => vaccine?.resource?.vaccineCode?.text === recommendation?.vaccineCode?.[0]?.text);
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
  }, [immunizations, recommendations ])

  return (
    <>
      <br className='hidden md:block' />

      {vaccineSchedules.length > 0 &&
        <>
          {loader === true &&
            <div className="my-10 mx-auto flex justify-center h-5 w-5">
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{
                      fontSize: 72,
                    }}
                    spin
                  />
                }
              />
            </div>
          }
          {!loader &&
            <div className="mt-4">
              <BaseTabs data={vaccineSchedules} columns={columns}/>
            </div>
          }
        </>
      }

    </>
  )
}

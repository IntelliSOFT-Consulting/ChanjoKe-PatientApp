import { useEffect, useState } from 'react';
import Stats from '../components/Stats';
import Table from '../components/DataTable';
import DefaultTable from '../components/Table';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Empty } from 'antd';
import { getOffset } from '../utils/methods';
import useAppointment from '../hooks/useAppointments';
import useCertificate from '../hooks/useCertificates';
import useImmunizationRecommendation from '../hooks/useImmunizationRecommendation';
import useImmunization from '../hooks/useImmunization';

const tHeaders = [
  { title: 'Vaccine', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900' },
  { title: 'Scheduled Date', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Dose Number', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Status', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

function Home() {

  const [upcomingVaccinations, setUpcomingVaccinations] = useState([])
  const [vaccinationAppointments, setVaccinationAppointments] = useState([])
  const [missedVaccines, setMissedVaccines] = useState([])
  const [user, setUser] = useState({})

  const navigate = useNavigate()
  const {
    loader,
    appointments,
    appointmentCount,
    fetchAppointments,
  } = useAppointment()
  const {
    certificateCount,
    fetchUserCertificates,
  } = useCertificate()
  const {
    recommendations,
    fetchUserRecommendations,
  } = useImmunizationRecommendation()
  const {
    immunizationCount,
    immunizations,
    fetchPatientImmunizations
  } = useImmunization()
  
  useEffect(() => {
    const userStorage = localStorage.getItem('user')
    
    if (userStorage === 'undefined' || userStorage === null || !Object.keys(userStorage).length) {
      localStorage.clear()
      navigate("/auth")
    }

    setUser(JSON.parse(userStorage))
  }, [])

  useEffect(() => {
    fetchAppointments(user, null)
    fetchUserCertificates(user)
    fetchUserRecommendations(user)
    fetchPatientImmunizations(user)
  }, [user])

  const updateAppointmentURL = (page) => {
    const offset = getOffset(page, 5)
    fetchAppointments(user, offset)
  }

  useEffect(() => {

    if (Array.isArray(recommendations) && recommendations.length > 0) {
      const completedImmunizations = immunizations.filter((immunization) => immunization?.resource?.status === 'completed')
      const completedImmunizationVaccineNames = completedImmunizations.map((immunization) => immunization?.resource?.vaccineCode?.text)

      const unvaccinatedAppointments = appointments.filter((appointment) => !completedImmunizationVaccineNames.includes(appointment.appointments))
      setVaccinationAppointments(unvaccinatedAppointments)

      const appointmentNames = appointments.map((appointment) => appointment.appointments)
      const incompleteVaccinations = recommendations.filter((rec) => !completedImmunizationVaccineNames.includes(rec?.vaccineCode?.[0]?.text))
      const validRecommendations = incompleteVaccinations.filter((rec) => !appointmentNames.includes(rec?.vaccineCode?.[0]?.text))

      const userDetails = JSON.parse(localStorage.getItem('userDetails'))
      const userAge = moment().diff(moment(userDetails?.birthDate).format('YYYY-MM-DD'), 'days')

      if (userAge < 14) {
        const upcoming = validRecommendations.map((vaccine) => {
          const dueDate = vaccine?.dateCriterion?.find(item => item.code.coding.some(code => code.code === "Earliest-date-to-administer"))
          if (moment().isAfter(dueDate.value, 'day') && vaccine?.description === 'routine') {
            return vaccine
          }
        }).filter(Boolean)

        const series = upcoming.filter((item) => item?.series === upcoming[0].series)

        const vaccinesScheduledToday = series.map((item) => ({
          date: moment(item?.dateCriterion?.[0]?.value).format('DD-MM-YYYY'),
          vaccine: item?.vaccineCode?.[0]?.text,
          dose: item?.doseNumberPositiveInt,
          status: 'Due',
        }))

        setUpcomingVaccinations(vaccinesScheduledToday)
      } else {
        const upcoming = validRecommendations.map((vaccine) => {
          const dueDate = vaccine?.dateCriterion?.find(item => item.code.coding.some(code => code.code === "Latest-date-to-administer"))
          if (moment().isBefore(dueDate.value, 'day') && vaccine?.description === 'routine') {
            return vaccine
          }
        }).filter(Boolean);

        const series = upcoming.filter((item) => item?.series === upcoming[0].series)

        const vaccinesScheduledToday = series.map((item) => ({
          vaccine: item?.vaccineCode?.[0]?.text,
          date: moment(item?.dateCriterion?.[0]?.value).format('DD-MM-YYYY'),
          dose: item?.doseNumberPositiveInt,
          status: 'Due',
        }))

        setUpcomingVaccinations(vaccinesScheduledToday)
      }
      
    }

    const completedImmunizations = immunizations
      .filter((immunization) => immunization?.resource?.status === 'completed')
      .map((item) => item?.resource?.vaccineCode?.text)

    if (recommendations?.length > 0) {
      const unvaccinatedRecommendations = recommendations.filter((recommendation) => 
        !completedImmunizations.includes(recommendation?.vaccineCode?.[0]?.text)
      )
      const passedVaccines = unvaccinatedRecommendations.map((vaccine) => {
        const dueDate = vaccine?.dateCriterion?.find(item => item.code.coding.some(code => code.code === "Earliest-date-to-administer"))
        const dueDateMoment = moment(dueDate.value).add(14, 'days')
        if (moment().isAfter(dueDateMoment, 'day') && vaccine?.description === 'routine') {
          return vaccine
        }
      }).filter(Boolean)

      const missedVaccines = passedVaccines.map((item) => ({
        appointments: item?.vaccineCode?.[0]?.text,
        scheduledDate: moment(item?.dateCriterion?.[0]?.value).format('DD-MM-YYYY'),
        status: 'Missed',
      }))
      setMissedVaccines(missedVaccines)
    }
    
  }, [recommendations, appointments, immunizations])

  const columns = [
    {
      title: 'Appointments',
      dataIndex: 'appointments',
      key: 'appointments',
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
    },
    {
      title: 'Appointment Date',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ]

  const missedVaccinesColumns = [
    {
      title: 'Vaccine',
      dataIndex: 'appointments',
      key: 'appointments',
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ]
  
  return (
    <div>
      <div className='hidden md:block'>
        <Stats
          appointments={vaccinationAppointments.length}
          certificates={certificateCount}
          vaccines={immunizationCount}/>
      </div>

      <br className='hidden md:block' />

      <h3 className='sm:hidden font-bold text-2xl'>Vaccination Appointments</h3>

      <div className="sm:hidden mt-5">
        {vaccinationAppointments.length > 0 && vaccinationAppointments.map((result, index) => (
          <div key={index} className='w-full grid grid-cols-5 gap-3 border border-1 border-gray-200'>
            <div className="py-5 pr-6 col-span-4">
              <div className="text-sm pl-5 leading-6 text-gray-900 font-bold">{result.appointments}</div>
              <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">Appointment Date: {result.appointmentDate}</div>
              <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">Scheduled Date: {result.scheduledDate}</div>
            </div>
            <div className="py-5 max-w-auto right-5">
              <div className="flex">
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='hidden md:block'>
      {missedVaccines.length > 0 && !loader && 
        <>
          <h1 className="font-semibold text-1xl mb-3">
            Missed Vaccines
          </h1>
        
          <Table
            columns={missedVaccinesColumns}
            dataSource={missedVaccines}
            size="small"
            loading={loader}
            locale={{
              emptyText: (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-gray-400 text-sm my-2">
                    User has no missed vaccinations
                  </p>
                </div>
              ),
            }}
          />

          <br />
        </>
        }
      </div>

      <div className='hidden md:block'>
      {vaccinationAppointments.length > 0 && !loader && 
        <>
          <h1 className="font-semibold text-1xl mb-3">
            Appointments
          </h1>
        
          <Table
            columns={columns}
            dataSource={vaccinationAppointments}
            size="small"
            loading={loader}
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
              hideOnSinglePage: true,
              showTotal: (total) => `Total ${total} items`,
              total: appointmentCount - 1,
              onChange: (page) => updateAppointmentURL(page),
            }}
            locale={{
              emptyText: (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-gray-400 text-sm my-2">
                    No Appointments
                  </p>
                </div>
              ),
            }}
          />
        </>
        }
      </div>

      {!loader && vaccinationAppointments.length < 1 && <Empty description="No Upcoming appointments" />}

      <div className='hidden md:block mt-5'>
        {upcomingVaccinations.length > 0 && !loader && <DefaultTable
          tableTitle="Upcoming Vaccinations"
          theaders={tHeaders}
          data={upcomingVaccinations} />}
      </div>

      {loader === true && <div className="my-10 mx-auto flex justify-center h-5 w-5">
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
      </div>}

      <div className="sm:hidden mt-5">
        {appointments.length > 0 && appointments.map((result) => (
          <div key={result.id} className='w-full grid grid-cols-5 gap-3 border border-1 border-gray-200'>
            <div className="py-5 pr-6 col-span-4">
              <div className="text-sm pl-5 leading-6 text-gray-900">{result.vaccine}</div>
              <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">Appointment Date: {result.date}</div>
              <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">Scheduled Date: {result.scheduledDate}</div>
            </div>
            <div className="py-5 max-w-auto right-5">
              <div className="flex">
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loader && upcomingVaccinations.length < 1 && <Empty description="No Upcoming vaccinations" />}

    </div>
  );
}

export default Home;
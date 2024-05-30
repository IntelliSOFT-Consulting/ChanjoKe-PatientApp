import { useEffect, useState } from 'react';
import Stats from '../components/Stats';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom'
import { useApiRequest } from '../api/useApi';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Empty } from 'antd';
import { datePassed, lockVaccine } from '../utils/validate';

const tableHeaders = [
  { title: 'Appointment Date', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Dose Number', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Status', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

const tHeaders = [
  { title: 'Scheduled Date', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Dose Number', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Status', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Home() {
  const [ appointmentCount, setAppointmentCount ] = useState(0)
  const [ certificateCount, setCertificateCount ] = useState(0)
  const [ vaccineCount, setVaccineCount ] = useState(0)
  const [loading, setLoading] = useState(false)

  const [appointments, setAppointments] = useState([])
  const [upcomingVaccinations, setUpcomingVaccinations] = useState([])

  const navigate = useNavigate()
  const { get } = useApiRequest()

  const fetchAppointments = async (user) => {
    setLoading(true)
    const response = await get(`/hapi/fhir/Appointment?supporting-info=Patient/${user?.fhirPatientId}`)

    setLoading(false)
    if (response?.entry && Array.isArray(response?.entry) && response?.entry.length > 0) {
      const appointmentData = response?.entry?.map((item) => {
        return {
          date: moment(item?.resource?.start).format('DD-MM-YYYY'),
          vaccine: item?.resource?.description,
          dose: '',
          status: capitalizeFirstLetter(item?.resource?.status),
        }
      })

      setAppointments(appointmentData)
      setAppointmentCount(response?.total)
    } else {
      setAppointmentCount(0)
    }
  }
  
  useEffect(() => {
    const userStorage = localStorage.getItem('user')
    
    if (userStorage === 'undefined' || userStorage === null || !Object.keys(userStorage).length) {
      localStorage.clear()
      navigate("/auth")
    }

    const user = JSON.parse(userStorage)

    fetchAppointments(user)

    fetch(`https://chanjoke.intellisoftkenya.com/hapi/fhir/ImmunizationRecommendation?patient=Patient/${user?.fhirPatientId}`)
      .then((res) => {
        const data = res.json()
        return data
      })
      .then((data) => {
        const recommendations = data?.entry?.[0]?.resource?.recommendation

        const locked = recommendations.map((recommendedVaccine) => {
          const dueDate = recommendedVaccine?.dateCriterion?.find(item => 
            item.code.coding.some(code => code.code === "Earliest-date-to-administer")
          );
          const lastDate = recommendedVaccine?.dateCriterion?.find(item => 
            item.code.coding.some(code => code.code === "Latest-date-to-administer")
          );
          const passedDate = lockVaccine(moment(dueDate?.value), moment(lastDate?.value))

          if (passedDate === false) {
            return recommendedVaccine
          }
        }).filter(Boolean);

        if (locked.length > 0) {
          const firstItem = locked[0].series
          const seriesItem = locked.filter((vaccination) => vaccination.series === firstItem)

          const upcomingVaccines = seriesItem.map((item) => ({
            date: moment(item?.dateCriterion?.[0]?.value).format('DD-MM-YYYY'),
            vaccine: item?.vaccineCode?.[0]?.text,
            dose: item?.doseNumberPositiveInt,
            status: 'Upcoming',
          }))

          setUpcomingVaccinations(upcomingVaccines)

        }
        setCertificateCount(0)
      })
      .catch((error) => {
        console.log({ error })
      })

    fetch(`https://chanjoke.intellisoftkenya.com/hapi/fhir/Immunization?patient=Patient/${user?.fhirPatientId}`)
      .then((res) => {
        const data = res.json()
        return data
      })
      .then((data) => {

        if (data?.entry && Array.isArray(data?.entry) && data?.entry.length > 0) {
          const completedVaccines = data?.entry?.filter((item) => item?.resource?.status === 'completed')
          setVaccineCount(completedVaccines.length)
        }
      })
      .catch((error) => {
        console.log({ error })
      })
  }, [])
  return (
    <div>
      <div className='hidden md:block'>
        <Stats
          appointments={appointmentCount}
          certificates={certificateCount}
          vaccines={vaccineCount}/>
      </div>

      <br className='hidden md:block' />

      <h3 className='sm:hidden font-bold text-2xl'>Vaccination Appointments</h3>

      <div className="sm:hidden mt-5">
        {appointments.map((result) => (
          <div key={result.id} className='w-full grid grid-cols-5 gap-3 border border-1 border-gray-200'>
            <div className="py-5 pr-6 col-span-4">
              <div className="text-sm pl-5 leading-6 text-gray-900">{result.vaccine}</div>
              <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">{result.date} - Dose: {result.dose}</div>
            </div>
            <div className="py-5 max-w-auto right-5">
              <div className="flex">
                <a
                  href={`/client-details/${result.id}`}
                  className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='hidden md:block'>
        {appointments.length > 0 && !loading && <Table
          tableTitle="Upcoming Appointments"
          theaders={tableHeaders}
          data={appointments} />}
      </div>

      <div className='hidden md:block mt-5'>
        {appointments.length > 0 && !loading && <Table
          tableTitle="Upcoming Vaccinations"
          theaders={tHeaders}
          data={upcomingVaccinations} />}
      </div>

      {loading === true && <div className="my-10 mx-auto flex justify-center h-5 w-5">
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

      {!loading && appointments.length < 1 && <Empty description="No Appointments" />}

      <div className="sm:hidden mt-5">
        {appointments.map((result) => (
          <div key={result.id} className='w-full grid grid-cols-5 gap-3 border border-1 border-gray-200'>
            <div className="py-5 pr-6 col-span-4">
              <div className="text-sm pl-5 leading-6 text-gray-900">{result.vaccine}</div>
              <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">{result.date} - Dose: {result.dose}</div>
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

    </div>
  );
}

export default Home;
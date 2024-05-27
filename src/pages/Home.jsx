import { useEffect, useState } from 'react';
import Stats from '../components/Stats';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom'
import { useApiRequest } from '../api/useApi';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const tableHeaders = [
  { title: 'Date', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Dose', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Status', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

function Home() {
  const [ appointmentCount, setAppointmentCount ] = useState(0)
  const [ certificateCount, setCertificateCount ] = useState(0)
  const [ vaccineCount, setVaccineCount ] = useState(0)
  const [loading, setLoading] = useState(false)

  const [appointments, setAppointments] = useState([])

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
          status: item?.resource?.status,
        }
      })
      console.log({ appointmentData, total: response?.total })
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
        console.log({ Immunization: data })
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
        console.log({ Recommendation: data })
        setVaccineCount(data.total)
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
          tableTitle="Upcoming appointments"
          theaders={tableHeaders}
          data={appointments} />}
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
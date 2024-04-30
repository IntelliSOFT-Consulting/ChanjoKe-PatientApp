import { useEffect, useState } from 'react';
import Stats from '../components/Stats';
import Table from '../components/Table';

const appointments = [
  { date: 'Tue, March 30, 2023', vaccine: 'Oxford/AstraZeneca', dose: 1, status: 'NA' },
]

const tableHeaders = [
  { title: 'Date', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Dose', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Status', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

function Home() {

  const [ appointment, setAppointments] = useState([
    {}
  ])
  const [ appointmentCount, setAppointmentCount ] = useState(0)
  const [ certificateCount, setCertificateCount ] = useState(0)
  const [ vaccineCount, setVaccineCount ] = useState(0)

  useEffect(() => {
    fetch('https://chanjoke.intellisoftkenya.com/hapi/fhir/Appointment')
      .then((res) => {
        const data = res.json()
        return data
      })
      .then((data) => {
        console.log({ data })

        setAppointmentCount(data.total)
      })
      .catch((error) => {
        console.log({ error })
      })

    fetch('https://chanjoke.intellisoftkenya.com/hapi/fhir/Immunization')
      .then((res) => {
        const data = res.json()
        return data
      })
      .then((data) => {
        console.log({ Immunization: data })
        setCertificateCount(data.total)
      })
      .catch((error) => {
        console.log({ error })
      })

    fetch('https://chanjoke.intellisoftkenya.com/hapi/fhir/ImmunizationRecommendation')
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
  })
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
        <Table
          tableTitle="Upcoming appointments"
          theaders={tableHeaders}
          data={appointments} />
      </div>

    </div>
  );
}

export default Home;
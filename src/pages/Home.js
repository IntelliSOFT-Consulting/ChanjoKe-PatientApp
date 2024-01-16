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

  const [ appointment, setAppointments] = useState(null)
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
        setVaccineCount(data.total)
      })
      .catch((error) => {
        console.log({ error })
      })
  })
  return (
    <div>
      <Stats
        appointments={appointmentCount}
        certificates={certificateCount}
        vaccines={vaccineCount}/>

      <br />

      <Table
        tableTitle="Upcoming appointments"
        theaders={tableHeaders}
        data={appointments} />
    </div>
  );
}

export default Home;
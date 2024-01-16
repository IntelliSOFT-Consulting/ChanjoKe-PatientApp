import { useEffect, useState } from 'react';
import Table from '../components/Table';
import moment from 'moment';

const tableHeaders = [
  { title: 'Dose', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Schedule', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

export default function VaccinationSchedule() {

  const [vaccineSchedules, setVaccineSchedules] = useState([])

  useEffect(() => {
    fetch('https://chanjoke.intellisoftkenya.com/hapi/fhir/ImmunizationRecommendation')
      .then((res) => {
        const data = res.json()
        return data
      })
      .then((data) => {
        const schedules = data.entry.map((schedule) => ({
          title: schedule.resource.recommendation[0].contraindicatedVaccineCode[0].text,
          dose: schedule.resource.recommendation[0].doseNumberString,
          schedule: moment(schedule.resource.date).format('ddd MMM D YYYY')
        }))
        setVaccineSchedules(schedules)
      })
      .catch((error) => {
        console.log({ error })
      })
  }, [])

  return (
    <>
      <br />

      <Table
        tableTitle="Vaccination Schedule"
        theaders={tableHeaders}
        data={vaccineSchedules} />
    </>
  )
}

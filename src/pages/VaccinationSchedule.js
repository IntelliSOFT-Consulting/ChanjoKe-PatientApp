import { useEffect, useState } from 'react';
import Table from '../components/Table';
import moment from 'moment';

const tableHeaders = [
  { title: 'Dose', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Schedule', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

export default function VaccinationSchedule() {

  const [vaccineSchedules, setVaccineSchedules] = useState([
    { date: 'Tue, March 30, 2023', vaccine: 'Oxford/AstraZeneca', dose: 1 },
  ])

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
        console.log({ schedules })
        // setVaccineSchedules(schedules)
      })
      .catch((error) => {
        console.log({ error })
      })
  }, [])

  return (
    <>
      <br />

      <div className="sm:hidden mt-5">
        {vaccineSchedules.map((result) => (
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
          tableTitle="Vaccination Schedule"
          theaders={tableHeaders}
          data={vaccineSchedules} />
      </div>
    </>
  )
}

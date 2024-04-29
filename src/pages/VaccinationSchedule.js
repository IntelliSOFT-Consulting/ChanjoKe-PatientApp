import { useEffect, useState } from 'react';
import Table from '../components/Table';
import moment from 'moment';
import { useApiRequest } from '../api/useApi';

const tableHeaders = [
  { title: 'Dose', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Schedule', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

export default function VaccinationSchedule() {

  const { get } = useApiRequest()

  const [vaccineSchedules, setVaccineSchedules] = useState([])

  const fetchUserSchedule = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const userSchedule = await get(`/hapi/fhir/ImmunizationRecommendation?patient=Patient/${user?.fhirPatientId}`)

    const recommendations = userSchedule?.entry?.[0]?.resource?.recommendation

    console.log({ recommendations })

    if (Array.isArray(recommendations)) {
      const vaccineSchedules = recommendations.map((schedule) => ({
        dose: schedule?.doseNumberPositiveInt,
        title: schedule?.vaccineCode?.[0]?.text,
        schedule: moment(schedule?.dateCriterion?.[0]?.value).format('DD-MM-YYYY'),
      }))
      setVaccineSchedules(vaccineSchedules)
    }
  }

  useEffect(() => {
    fetchUserSchedule()
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

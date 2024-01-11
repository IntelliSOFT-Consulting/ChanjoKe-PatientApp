import Table from '../components/Table';

const schedules = [
  { dose: '1', title: 'Oxford/AstraZeneca', schedule: 'Sat Jun 20 2023' },
]

const tableHeaders = [
  { title: 'Dose', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Schedule', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

export default function VaccinationSchedule() {
  return (
    <>
      <br />

      <Table
        tableTitle="Vaccination Schedule"
        theaders={tableHeaders}
        data={schedules} />
    </>
  )
}

import Table from '../components/Table';

const certificates = [
  { number: '1', title: 'Oxford/AstraZeneca', action: 'Download' },
]

const tableHeaders = [
  { title: '#', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Action', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

export default function VaccinationCertificate() {
  return (
    <>
      <br />

      <Table
        tableTitle="Vaccination Certificate"
        theaders={tableHeaders}
        data={certificates} />
    </>
  );
}

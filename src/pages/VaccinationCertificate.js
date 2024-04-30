import Table from '../components/Table';
import { useState, useEffect } from 'react';

const tableHeaders = [
  { title: '#', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Action', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

export default function VaccinationCertificate() {
  const [vaccineCertificates, setVaccineCertificates] = useState([
    { date: 'Tue, March 30, 2023', vaccine: 'Oxford/AstraZeneca', dose: 'Download' },
  ])

  useEffect(() => {
    fetch('https://chanjoke.intellisoftkenya.com/hapi/fhir/Immunization')
      .then((res) => {
        const data = res.json()
        return data
      })
      .then((data) => {
        const certificates = data.entry.map((certificate, index) => ({
          number: index + 1,
          title: certificate.resource.vaccineCode.text,
          action: 'Download'
        }))
        setVaccineCertificates(certificates)
      })
      .catch((error) => {
        console.log({ error })
      })
  }, [])
  return (
    <>
      <br />

      <div className="sm:hidden mt-5">
        {vaccineCertificates.map((result) => (
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
          tableTitle="Vaccination Certificate"
          theaders={tableHeaders}
          data={vaccineCertificates} />
      </div>

    </>
  );
}

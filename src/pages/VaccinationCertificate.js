import Table from '../components/Table';
import { useState, useEffect } from 'react';

const tableHeaders = [
  { title: '#', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Action', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

export default function VaccinationCertificate() {
  const [vaccineCertificates, setVaccineCertificates] = useState([])

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

      <Table
        tableTitle="Vaccination Certificate"
        theaders={tableHeaders}
        data={vaccineCertificates} />
    </>
  );
}

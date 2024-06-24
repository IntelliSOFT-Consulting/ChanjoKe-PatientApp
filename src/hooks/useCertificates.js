import { useState } from "react"
import { useApiRequest } from "../api/useApi"
import moment from "moment"

const certificateEndpoint = '/hapi/fhir/DocumentReference'

export default function useCertificate() {

  const { get } = useApiRequest()

  const [certificates, setCertificates] = useState([])
  const [certificateCount, setCertificateCount] = useState(0)

  const fetchUserCertificates = async (user) => {
    const response = await get(`${certificateEndpoint}?subject=Patient/${user?.fhirPatientId}`)

    if (response && Array.isArray(response?.entry) && response?.entry.length > 0) {
      const certificateData = response?.entry.map((item) => ({
        date: moment(item?.resource?.date).format('DD-MM-YYYY'),
        vaccine: item?.resource?.type?.coding?.[0]?.code,
        action: { text: 'Download', data: item?.resource?.content?.[0]?.attachment },
      }))
      setCertificates(certificateData)
      setCertificateCount(response?.total || response?.entry?.length)
    }

  }

  return {
    certificates,
    certificateCount,
    fetchUserCertificates,
  }
}
import { useState } from "react"
import { useApiRequest } from "../api/useApi"
import moment from "moment"

const certificateEndpoint = '/hapi/fhir/DocumentReference'

export default function useCertificate() {

  const { get } = useApiRequest()

  const [certificates, setCertificates] = useState([])
  const [certificateCount, setCertificateCount] = useState(0)
  const [loader, setLoader] = useState(false)

  function getDisplayForSystemContainingMOH(items) {
    const itemWithMOHSystem = items?.find(item => item.system.includes('MOH'));
    return itemWithMOHSystem ? itemWithMOHSystem.display : undefined;
}

  const fetchUserCertificates = async (user) => {
    setLoader(true)
    const response = await get(`${certificateEndpoint}?subject=Patient/${user?.fhirPatientId}`)

    if (response && Array.isArray(response?.entry) && response?.entry.length > 0) {
      const certificateData = response?.entry.map((item) => ({
        vaccine: getDisplayForSystemContainingMOH(item?.resource?.type?.coding),
        date: moment(item?.resource?.date).format('DD-MM-YYYY'),
        action: { text: 'Download', data: item?.resource?.content?.[0]?.attachment },
      }))
      setCertificates(certificateData)
      setCertificateCount(response?.total || response?.entry?.length)
      setLoader(false)
    } else {
      setLoader(false)
    }

  }

  return {
    loader,
    certificates,
    certificateCount,
    fetchUserCertificates,
  }
}
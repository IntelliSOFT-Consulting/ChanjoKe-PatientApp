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
    const response = await get(`${certificateEndpoint}?subject=Patient/${user?.fhirPatientId}&type:code=82593-5`)

    if (response && Array.isArray(response?.entry) && response?.entry.length > 0) {
      const uniqueVaccines = new Set();
      const certificateData = response?.entry.reduce((accumulator, item) => {
        const vaccineName = getDisplayForSystemContainingMOH(item?.resource?.type?.coding);
        const formattedDate = moment(item?.resource?.date).format('DD-MM-YYYY');
        const attachmentData = item?.resource?.content?.[0]?.attachment;
        if (vaccineName && !uniqueVaccines.has(vaccineName)) {
          uniqueVaccines.add(vaccineName);
    
          accumulator.push({
            vaccine: vaccineName,
            date: formattedDate,
            action: { text: 'Download', data: attachmentData },
          });
        }
    
        return accumulator;
      }, []);
      setCertificates(certificateData)
      setCertificateCount(certificateData?.length)
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
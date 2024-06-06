import { useState } from "react"
import { useApiRequest } from "../api/useApi"

const immunizationEndpoint = '/hapi/fhir/Immunization'

export default function useImmunization() {
  const { get } = useApiRequest()

  const [immunizations, setImmunizations] = useState([])
  const [immunizationCount, setImmunizationCount] = useState(0)

  const fetchPatientImmunizations = async (user) => {
    const response = await get(`${immunizationEndpoint}?patient=Patient/${user?.fhirPatientId}`)

    if (response?.entry && Array.isArray(response?.entry) && response?.entry.length > 0) {
      const completedVaccines = response?.entry?.filter((item) => item?.resource?.status === 'completed')
      setImmunizationCount(completedVaccines.length)
    }
  }

  return {
    immunizations,
    immunizationCount,
    fetchPatientImmunizations,
  }

}
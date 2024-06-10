import { useState } from "react"
import { useApiRequest } from "../api/useApi"

const immunizationRecommendationEndpoint = '/hapi/fhir/ImmunizationRecommendation'

export default function useImmunizationRecommendation() {

  const { get } = useApiRequest()

  const [recommendations, setRecommendations] = useState([])

  const fetchUserRecommendations = async (user) => {
    const response = await get(`${immunizationRecommendationEndpoint}?patient=Patient/${user?.fhirPatientId}`)

    setRecommendations(response?.entry?.[0]?.resource?.recommendation)
  }

  return {
    recommendations,
    fetchUserRecommendations,
  }
}
import { useState } from "react";
import { useApiRequest } from "../api/useApi";

const immunizationRecommendationEndpoint = "/chanjo-hapi/fhir/ImmunizationRecommendation";

export default function useImmunizationRecommendation() {
  const { get } = useApiRequest();

  const [recommendations, setRecommendations] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchUserRecommendations = async (user) => {
    setLoader(true);
    const response = await get(`${immunizationRecommendationEndpoint}?patient=Patient/${user?.fhirPatientId}&_count=100`);

    setRecommendations(response?.entry?.[0]?.resource?.recommendation);
    setLoader(false);
  };

  return {
    loader,
    recommendations,
    fetchUserRecommendations,
  };
}

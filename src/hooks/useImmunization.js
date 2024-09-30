import { useState } from "react";
import { useApiRequest } from "../api/useApi";

const immunizationEndpoint = "/chanjo-hapi/fhir/Immunization";

export default function useImmunization() {
  const { get } = useApiRequest();

  const [immunizationCount, setImmunizationCount] = useState(0);
  const [immunizations, setImmunizations] = useState([]);

  const fetchPatientImmunizations = async (user) => {
    const response = await get(`${immunizationEndpoint}?patient=Patient/${user?.fhirPatientId}&_count=100`);

    if (response?.entry && Array.isArray(response?.entry) && response?.entry.length > 0) {
      const completedVaccines = response?.entry?.filter((item) => item?.resource?.status === "completed");
      setImmunizationCount(completedVaccines.length);
      setImmunizations(response?.entry);
    }
  };

  return {
    immunizations,
    immunizationCount,
    fetchPatientImmunizations,
  };
}

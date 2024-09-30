import { useApiRequest } from "../api/useApi";
import moment from "moment";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import { useState } from "react";

const appointmentEndpoint = "/chanjo-hapi/fhir/Appointment";

export default function useAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [appointmentsPagination, setAppointmentPagination] = useState([]);

  const { get } = useApiRequest();

  // Fetch appointments related to a user using their user ID
  const fetchAppointments = async (user, offset = 0) => {
    const url =
      offset < 1
        ? `${appointmentEndpoint}?supporting-info=Patient/${user?.fhirPatientId}&_count=5`
        : `${appointmentEndpoint}?supporting-info=Patient/${user?.fhirPatientId}&_count=5&_offset=${offset}`;
    setLoader(true);
    const response = await get(url);

    if (response?.entry && Array.isArray(response?.entry) && response?.entry.length > 0) {
      const appointmentData = response?.entry?.map((item) => {
        return {
          appointmentDate: moment(item?.resource?.start).format("DD-MM-YYYY"),
          scheduledDate: moment(item?.resource?.created).format("DD-MM-YYYY"),
          appointments: item?.resource?.description,
          status: capitalizeFirstLetter(item?.resource?.status),
        };
      });

      setAppointments(appointmentData);
      setAppointmentCount(response?.total);
      setAppointmentPagination(response?.link);
      setLoader(false);
    } else {
      setAppointmentCount(0);
      setLoader(false);
    }
  };

  return {
    loader,
    appointments,
    appointmentsPagination,
    appointmentCount,
    fetchAppointments,
  };
}

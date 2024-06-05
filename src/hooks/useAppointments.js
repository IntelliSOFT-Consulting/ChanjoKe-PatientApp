import { useApiRequest } from "../api/useApi"
import moment from "moment"
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter"
import { useState } from "react"

const appointmentEndpoint = '/hapi/fhir/Appointment'

export default function useAppointment() {
  const [appointment, setAppointment] = useState({})
  const [appointments, setAppointments] = useState([])
  const [appointmentCount, setAppointmentCount] = useState(0)
  const [loader, setLoader] = useState(false)

  const { get } = useApiRequest()

  // Fetch appointments related to a user using their user ID
  const fetchAppointments = async (user) => {
    setLoader(true)
    const response = await get(`${appointmentEndpoint}?supporting-info=Patient/${user?.fhirPatientId}`)

    if (response?.entry && Array.isArray(response?.entry) && response?.entry.length > 0) {
      const appointmentData = response?.entry?.map((item) => {
        return {
          date: moment(item?.resource?.start).format('DD-MM-YYYY'),
          vaccine: item?.resource?.description,
          dose: '',
          status: capitalizeFirstLetter(item?.resource?.status),
        }
      })

      setAppointments(appointmentData)
      setAppointmentCount(response?.total)
      setLoader(false)
    } else {
      setAppointmentCount(0)
      setLoader(false)
    }
  }

  return {
    loader,
    appointment,
    appointments,
    appointmentCount,
    fetchAppointments,
  }
}
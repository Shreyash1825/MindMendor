import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { firestore } from "./Firebase"

export const formatDateTime = (sessionDate, sessionTime) => {
  const dateTime = new Date(`${sessionDate}T${sessionTime}:00`)
  return dateTime.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export const formatFees = (amount, currency) => {
  return currency === "USD" ? `$${amount}` : `${currency} ${amount}`
}

export const fetchAppointmentsByTherapist = async (therapistId) => {
  if (!therapistId) {
    throw new Error("Therapist ID is required")
  }

  try {
    const appointmentsRef = collection(firestore, "appointments")
    const q = query(appointmentsRef, where("therapistId", "==", therapistId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const appointments = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      appointments.push({
        id: doc.id,
        ...data,
        formattedDateTime: formatDateTime(data.sessionDate, data.sessionTime),
        formattedFees: formatFees(data.sessionFee, data.currency),
      })
    })

    return appointments
  } catch (error) {
    console.error("Error fetching appointments:", error)
    throw error
  }
}

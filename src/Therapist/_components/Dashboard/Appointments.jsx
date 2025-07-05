"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserRoundCheck,
  Loader2,
  Calendar,
  Clock,
  User,
  Mail,
  DollarSign,
} from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/Database/Firebase";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { useAuth } from "@/Database/useAuth";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [meetLink, setMeetLink] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const { user } = useAuth();

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const fetchUserAge = async (userEmail) => {
    try {
      const usersRef = collection(firestore, "Users");
      const q = query(usersRef, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        if (userData.dob) {
          return calculateAge(userData.dob);
        } else if (userData.birthDate) {
          return calculateAge(userData.birthDate);
        } else if (userData.dateOfBirth) {
          return calculateAge(userData.dateOfBirth);
        } else if (userData.age) {
          return userData.age;
        }
      }
      return "N/A";
    } catch (error) {
      console.error("Error fetching user age:", error);
      return "N/A";
    }
  };

  const fetchAppointments = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const appointmentsRef = collection(firestore, "appointments");
      const q = query(appointmentsRef, where("therapistId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const appointmentsData = [];

      for (const docSnap of querySnapshot.docs) {
        const appointmentData = {
          ...docSnap.data(),
          appointmentId: docSnap.id,
        };
        const userAge = await fetchUserAge(appointmentData.userEmail);
        appointmentData.userAge = userAge;
        appointmentsData.push(appointmentData);
      }

      appointmentsData.sort((a, b) => {
        const dateA = new Date(`${a.sessionDate} ${a.sessionTime}`);
        const dateB = new Date(`${b.sessionDate} ${b.sessionTime}`);
        return dateB.getTime() - dateA.getTime();
      });

      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAcceptModal(true);
    setMeetLink("");
    setAdditionalNotes("");
  };

  const generateGoogleMeetLink = () => {
    // Generate a random Google Meet link (in real implementation, you'd use Google Calendar API)
    const meetId = Math.random().toString(36).substring(2, 15);
    const generatedLink = `https://meet.google.com/${meetId}`;
    setMeetLink(generatedLink);
  };

  const sendConfirmationEmail = async () => {
    if (!meetLink.trim()) {
      toast.error("Please provide a Google Meet link");
      return;
    }

    setSendingEmail(true);

    try {
      const templateParams = {
        to_email: selectedAppointment.userEmail,
        to_name: selectedAppointment.userName,
        therapist_name: user.displayName || "Your Therapist",
        appointment_date: formatDateTime(
          selectedAppointment.sessionDate,
          selectedAppointment.sessionTime
        ),
        duration: selectedAppointment.duration,
        category: selectedAppointment.concernCategory,
        meet_link: meetLink,
        additional_notes: additionalNotes || "No additional notes",
        session_fee: formatCurrency(
          selectedAppointment.sessionFee,
          selectedAppointment.currency
        ),
      };

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Replace with your EmailJS service ID, template ID, and public key
      await emailjs.send(
        serviceId, // Replace with your EmailJS service ID
        templateId, // Replace with your EmailJS template ID
        templateParams,
        publicKey // Replace with your EmailJS public key
      );

      // Update appointment status
      await updateAppointmentStatus(
        selectedAppointment.appointmentId,
        "confirmed"
      );
      toast.success("Appointment confirmed and email sent successfully!", {
        position: "top-center",
      });

      setShowAcceptModal(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send confirmation email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      setUpdating(appointmentId);
      const appointmentRef = doc(firestore, "appointments", appointmentId);
      await updateDoc(appointmentRef, {
        status: newStatus,
        updatedAt: new Date(),
      });

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.appointmentId === appointmentId
            ? { ...apt, status: newStatus }
            : apt
        )
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending"
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed" || apt.status === "confirmed"
  );

  const formatDateTime = (date, time) => {
    const sessionDate = new Date(date);
    const [hours, minutes] = time.split(":");
    sessionDate.setHours(Number.parseInt(hours), Number.parseInt(minutes));

    return sessionDate.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount, currency) => {
    if (currency === "USD") return `$${amount}`;
    if (currency === "INR") return `₹${amount}`;
    return `${currency} ${amount}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-600">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-blue-600">
        <h1>SCHEDULE APPOINTMENTS</h1>
      </div>
      <div className="content shadow-lg mt-10 px-5 py-10 w-full flex flex-col justify-center gap-6">
        <div className="pending-appointments mb-3 shadow-md p-3">
          <div className="heading font-bold text-xl mb-4">
            <h1>Pending Appointments ({pendingAppointments.length})</h1>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of your pending appointments.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="text-center">Age</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead className="text-right px-16">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAppointments.map((appointment) => (
                  <TableRow key={appointment.appointmentId}>
                    <TableCell className="font-medium">
                      {appointment.userEmail}
                    </TableCell>
                    <TableCell className="text-center">
                      {appointment.userAge || "N/A"}
                    </TableCell>
                    <TableCell>{appointment.userName}</TableCell>
                    <TableCell>{appointment.concernCategory}</TableCell>
                    <TableCell>
                      {formatDateTime(
                        appointment.sessionDate,
                        appointment.sessionTime
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {appointment.duration} min
                    </TableCell>
                    <TableCell>
                      {formatCurrency(
                        appointment.sessionFee,
                        appointment.currency
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="btns flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-700"
                          onClick={() => handleAcceptClick(appointment)}
                          disabled={updating === appointment.appointmentId}
                        >
                          {updating === appointment.appointmentId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Accept"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment.appointmentId,
                              "declined"
                            )
                          }
                          disabled={updating === appointment.appointmentId}
                        >
                          {updating === appointment.appointmentId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Decline"
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {pendingAppointments.length > 0 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={7}>Total</TableCell>
                    <TableCell className="text-center">
                      {pendingAppointments.length}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
            {pendingAppointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pending appointments found.
              </div>
            )}
          </div>
        </div>

        <hr />

        <div className="confirmed-appointments mb-3 shadow-md p-3">
          <div className="heading font-bold text-xl mb-4">
            <h1>Completed Appointments ({completedAppointments.length})</h1>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>
                A list of your completed appointments.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="text-center">Age</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedAppointments.map((appointment) => (
                  <TableRow key={appointment.appointmentId}>
                    <TableCell className="font-medium">
                      {appointment.userEmail}
                    </TableCell>
                    <TableCell className="text-center">
                      {appointment.userAge || "N/A"}
                    </TableCell>
                    <TableCell>{appointment.userName}</TableCell>
                    <TableCell>{appointment.concernCategory}</TableCell>
                    <TableCell>
                      {formatDateTime(
                        appointment.sessionDate,
                        appointment.sessionTime
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {appointment.duration} min
                    </TableCell>
                    <TableCell>
                      {formatCurrency(
                        appointment.sessionFee,
                        appointment.currency
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <UserRoundCheck className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-600 capitalize">
                          {appointment.status}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {completedAppointments.length > 0 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={7}>Total</TableCell>
                    <TableCell className="text-right">
                      {completedAppointments.length}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
            {completedAppointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No completed appointments found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accept Appointment Modal */}
      <Dialog open={showAcceptModal} onOpenChange={setShowAcceptModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600">
              Confirm Appointment
            </DialogTitle>
            <DialogDescription>
              Review the appointment details and provide a Google Meet link to
              confirm.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-6">
              {/* Appointment Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg mb-3">
                  Appointment Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Patient:</span>
                    <span>{selectedAppointment.userName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Email:</span>
                    <span className="text-sm">
                      {selectedAppointment.userEmail}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Date & Time:</span>
                    <span>
                      {formatDateTime(
                        selectedAppointment.sessionDate,
                        selectedAppointment.sessionTime
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Duration:</span>
                    <span>{selectedAppointment.duration} minutes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Fee:</span>
                    <span>
                      {formatCurrency(
                        selectedAppointment.sessionFee,
                        selectedAppointment.currency
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium">Category:</span>
                    <span>{selectedAppointment.concernCategory}</span>
                  </div>
                </div>
              </div>

              {/* Google Meet Link Input */}
              <div className="space-y-2">
                <Label htmlFor="meetLink" className="text-sm font-medium">
                  Google Meet Link *
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="meetLink"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    className="flex-1"
                  />
                  {/* <Button
                    type="button"
                    variant="outline"
                    onClick={generateGoogleMeetLink}
                    className="whitespace-nowrap"
                  >
                    Generate Link
                  </Button> */}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information for the patient..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAcceptModal(false)}
              disabled={sendingEmail}
            >
              Cancel
            </Button>
            <Button
              onClick={sendConfirmationEmail}
              disabled={sendingEmail || !meetLink.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending Email...
                </>
              ) : (
                "Confirm & Send Email"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Appointments;

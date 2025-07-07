import UI from "@/components/ui/uii";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/components/Home";
import Userlogin from "@/components/authentication/User/Userlogin";
import Userregister from "@/components/authentication/User/Userregister";
import Therapistregister from "@/components/authentication/Therapist/Therapistregister";
import Therapistlogin from "@/components/authentication/Therapist/Therapistlogin";
import Predictor from "@/components/predictor/Predictor";

import Login from "@/admin/components/Login";

import Therapistlist from "@/components/Therapists/Page";

import { ToastContainer } from "react-toastify";
import TherapistDashboardLayout from "@/Therapist/_components/TherapistDashboardLayout";
import TherapistDashboard from "@/Therapist/_components/Dashboard/TherapistDashboard";
import Account from "@/Therapist/_components/Dashboard/Account";
import Notification from "@/Therapist/_components/Dashboard/Notification";
import Appointments from "@/Therapist/_components/Dashboard/Appointments";
import Earnings from "@/Therapist/_components/Dashboard/Earnings";
import Patients from "@/Therapist/_components/Dashboard/Patients";
import Help from "@/Therapist/_components/Dashboard/Help";
import TherapistAbout from "@/Therapist/_components/TherapistAbout/TherapistAbout";
import TherapistHire from "@/Therapist/_components/TherapistHire/TherapistHire";
import Chatbot from "@/components/Chatbot";
import TherapistProfile from "@/components/Therapists/[id]/Page";
import TherapistBooking from "@/components/Therapists/TherapistBooking";
import AdminDashboardLayout from "@/admin/components/AdminDashboardLayout";
import AdminDashboard from "@/admin/components/Dashboard/AdminDashboard";
import AdminAccount from "@/admin/components/Dashboard/AdminAccount";
import AnonymousVideoCall from "@/VideoCall/Videocall";
import PredictorTherapistRoute from "@/routes/PredictorTherapistRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/MindMendor",
      element: <Home />,
    },
    {
      path: "/MindMendor/ui",
      element: <UI />,
    },
    {
      path: "/MindMendor/therapists",
      element: <PredictorTherapistRoute />,
    },
    {
      path: "/MindMendor/therapists/:id",
      element: <TherapistProfile />,
    },
    {
      path: "/MindMendor/userlogin",
      element: <Userlogin />,
    },
    {
      path: "/MindMendor/userregister",
      element: <Userregister />,
    },
    {
      path: "/MindMendor/therapistlogin",
      element: <Therapistlogin />,
    },
    {
      path: "/MindMendor/therapistregister",
      element: <Therapistregister />,
    },
    {
      path: "/MindMendor/predict",
      element: <PredictorTherapistRoute />,
    },
    {
      path: "/MindMendor/meet",
      element: <AnonymousVideoCall />,
    },
    {
      path: "/MindMendor/therapists/booksession/:id",
      element: <TherapistBooking />,
    },
    // {
    //   path: "/MindMendor/therapist/Home",
    //   element: <TherapistDashboardLayout />,
    // },

    {
      path: "/MindMendor/admin/login",
      element: <Login />,
    },
    {
      path: "/MindMendor/Therapist/about",
      element: <TherapistAbout />,
    },
    {
      path: "/MindMendor/Therapist/hire",
      element: <TherapistHire />,
    },
    {
      path: "/MindMendor/therapist/",
      element: <TherapistDashboardLayout />,
      children: [
        {
          index: true,
          element: <TherapistDashboard />
        },
        {
          path: "account",
          element: <Account />
        },
        {
          path: "appointments",
          element: <Appointments />
        },
        {
          path: "earnings",
          element: <Earnings />
        },
        {
          path: "alerts",
          element: <Notification />
        },
        {
          path: "patients",
          element: <Patients />
        },
        {
          path: "help",
          element: <Help />
        },
      ]
    },
    {
      path: "/MindMendor/admin/",
      element: <AdminDashboardLayout />,
      children: [
        {
          index: true,
          element: <AdminDashboard />
        },
        {
          path: "account",
          element: <AdminAccount />
        },
      ]
      }
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;

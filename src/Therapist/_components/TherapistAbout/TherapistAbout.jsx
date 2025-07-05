import Footer from "@/components/Footer"
import Navbar from "@/components/Header"
import { useLocation } from "react-router-dom"

function TherapistAbout() {
  const location = useLocation()
  const therapist = location.state?.therapist

  if (!therapist) {
    return <div>No therapist information available.</div>
  }

  return (
    <>
      <Navbar />
      <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-[70%] text-white flex items-center justify-center p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20">
          <div className="profile flex flex-col items-center justify-center gap-6 px-24 py-3">
            <div className="profile-photo">
              <img
                src={therapist.image || "/placeholder.svg"}
                className="w-40 h-40 rounded-full object-cover"
                alt={therapist.name}
              />
            </div>
            <div className="title text-center">
              <h1 className="text-2xl font-bold text-[#1479ea]">{therapist.name}</h1>
              <p>{therapist.proff}</p>
            </div>
            <div className="bio">
              <p className="text-sm text-center">I am a licensed psychologist with a passion for helping individuals navigate life’s challenges with clarity and resilience. My approach is evidence-based and tailored to each client’s unique needs, drawing from [mention approaches, e.g., cognitive-behavioral therapy (CBT), mindfulness, trauma-informed care]. With [X] years of experience, I specialize in [list key areas, e.g., anxiety, depression, relationships, trauma], providing a supportive and collaborative space for growth and healing. My goal is to empower clients with the tools they need to foster lasting well-being.</p>
            </div>
            <div className="links text-center">
              <div className="heading text-[#1479ea] text-xl font-bold">Join me</div>
              <div className="media-icons flex gap-8 mt-4 items-center justify-center text-xl">
                <i className="fa-brands fa-facebook cursor-pointer hover:text-blue-600 text-xl"></i>
                <i className="fa-brands fa-twitter cursor-pointer hover:text-blue-600 text-xl"></i>
                <i className="fa-brands fa-instagram cursor-pointer hover:text-red-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default TherapistAbout


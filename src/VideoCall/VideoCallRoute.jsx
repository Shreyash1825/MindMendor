import { Link } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../Database/Firebase"
import AnonymousVideoCall from "./anonymous-video-call"

const VideoCallRoute = () => {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Link to="/MindMendor/login" replace />
  }

  return <AnonymousVideoCall />
}

export default VideoCallRoute

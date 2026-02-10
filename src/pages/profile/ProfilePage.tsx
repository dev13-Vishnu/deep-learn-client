import { useAuth } from "../../auth/useAuth";
import LoadingSpinner from "../LoadingSpinner";
import InstructorProfilePage from "./InstructorProfilePage";
import StudentProfilePage from "./StudentProfile";

export default function ProfilePage() {
  const { currentRole, isHydrating } = useAuth();

  if (isHydrating) {
    return <LoadingSpinner />;
  }

  // Route to correct profile based on role
  if (currentRole === 'instructor') {
    return <InstructorProfilePage />;
  }

  return <StudentProfilePage />;
}
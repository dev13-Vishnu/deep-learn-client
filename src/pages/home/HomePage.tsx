import LandingPage from '../landing/LandingPage';
import DashboardHome from '../dashboard/DashboardHome';
import { useAuth } from '../../auth/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <section className="px-6 py-8 bg-gray-50 rounded-lg">
        <h1 className="text-2xl font-semibold">
          Welcome back{user?.email ? `, ${user.email}` : ''}
        </h1>
        <p className="text-gray-600 mt-2">
          Continue learning where you left off.
        </p>
      </section>

      {/* Resume Learning / Dashboard Content */}
      <DashboardHome />

      {/* Landing-style discovery sections */}
      <LandingPage />
    </div>
  );
}




// import { useAuth } from "../../auth/useAuth";

// export default function HomePage () {
//     const {user} = useAuth();

//     return (
//         <div className="mx-auto max-w-7xl px-6 py-10">
//             <h1 className="text-2xl font-semibold">
//                 Welcome back{user?.email ? `, ${user.email}` : ''}
//             </h1>

//             <p className="mt-2 text-[color:var(--color-muted)]">
//                 Continue where you left off
//             </p>
//         </div>
//     )
// }
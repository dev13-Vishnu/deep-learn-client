import WelcomeSection from './sections/WelcomeSection';
import ContinueLearningSection from './sections/ContinueLearningSection';
import RecommendedCoursesSection from './sections/RecommendedCoursesSection';

export default function DashboardHome() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col gap-10">
      <WelcomeSection />
      <ContinueLearningSection />
      <RecommendedCoursesSection />
    </div>
  );
}

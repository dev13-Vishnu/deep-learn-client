import CategoriesSection from "./sections/CategoriesSection";
import HeroSection from "./sections/HeroSection";
import StatsSection from "./sections/StatsSection";
import TopCoursesSection from "./sections/TopCoursesSection";

export default function LandingPage() {
    return (
        <div className="flex flex-col gap-20">
            <HeroSection/>
            <StatsSection/>
            <CategoriesSection/>
            <TopCoursesSection/>
        </div>
    )
}
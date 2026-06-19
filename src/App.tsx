import React from "react";
import { useCommando } from "./context/CommandoContext";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import PlanGenerator from "./components/PlanGenerator";
import DashboardShell from "./components/DashboardShell";
import CelebrationBurst from "./components/CelebrationBurst";
import AppFooter from "./components/AppFooter";
import LegalModal from "./components/LegalPages";
import ShareModal from "./components/ShareModal";
import TierSelector from "./components/TierSelector";
import FitnessCard from "./components/FitnessCard";
import DietCard from "./components/DietCard";
import HabitsCard from "./components/HabitsCard";
import ChallengesCard from "./components/ChallengesCard";
import TrackerCard from "./components/TrackerCard";
import CoachCard from "./components/CoachCard";
import AnalyticsCard from "./components/AnalyticsCard";
import { UserProfile, CommandoPlan } from "./types";
import { AnimatePresence } from "motion/react";

import AuthPanel from "./components/AuthPanel";

export default function App() {
  const { state, setActiveTab, setTriggerCelebration, setProfile, setPlan } = useCommando();
  const { activeTab, triggerCelebration, isShareModalOpen, isPaywallOpen, dashboardPage, isAuthenticated } = state;
  const [legalModalType, setLegalModalType] = React.useState<"tos" | "privacy" | null>(null);

  const handlePlanGenerated = (profile: UserProfile, plan: CommandoPlan) => {
    setProfile(profile);
    setPlan(plan);
    setActiveTab("dashboard");
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return <AuthPanel />;
    }

    switch (activeTab) {
      case "landing":
        return <PlanGenerator onPlanGenerated={handlePlanGenerated} />;
      case "onboarding":
        return <PlanGenerator onPlanGenerated={handlePlanGenerated} />;
      case "dashboard":
        return (
          <DashboardShell>
            {(dashboardPage === "overview" || dashboardPage === "fitness") && <FitnessCard />}
            {(dashboardPage === "overview" || dashboardPage === "diet") && <DietCard />}
            {(dashboardPage === "overview" || dashboardPage === "habits") && <HabitsCard />}
            {(dashboardPage === "overview" || dashboardPage === "challenges") && <ChallengesCard />}
            {(dashboardPage === "overview" || dashboardPage === "tracker") && <TrackerCard />}
            {(dashboardPage === "overview" || dashboardPage === "coach") && <CoachCard />}
            {(dashboardPage === "overview" || dashboardPage === "analytics") && <AnalyticsCard />}
          </DashboardShell>
        );
      default:
        return <PlanGenerator onPlanGenerated={handlePlanGenerated} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#FF5F15]/30 selection:text-white flex flex-col justify-between">
      <div className="w-full">
        {/* Navigation Bar */}
        <NavBar />

        {/* Core Main Viewport */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-12 w-full">
          {renderContent()}
        </main>
      </div>

      {/* Styled Footer */}
      <AppFooter onOpenLegal={(type) => setLegalModalType(type)} />

      {/* Overlays & Modals */}
      <AnimatePresence>
        {triggerCelebration && (
          <CelebrationBurst
            badgeName={state.celebrationBadge}
            onComplete={() => setTriggerCelebration(false)}
          />
        )}

        {isShareModalOpen && <ShareModal />}

        {isPaywallOpen && <TierSelector />}

        {legalModalType && (
          <LegalModal
            type={legalModalType}
            onClose={() => setLegalModalType(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

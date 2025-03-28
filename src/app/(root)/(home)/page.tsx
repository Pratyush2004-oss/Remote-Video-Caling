"use client";
import ActionCard from "@/components/shared/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/shared/MeetingModal";

const HomePage = () => {
  const router = useRouter();
  const { isInterviewer, isCandidate, isLoadiing } = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterviews);
  const [showModal, setshowModal] = useState<boolean>(false);
  const [modalType, setmodalType] = useState<"start" | "join">();

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setshowModal(true);
        setmodalType("start");
        break;
      case "Join Interview":
        setshowModal(true);
        setmodalType("join");
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };

  if (isLoadiing) return <p>loading........</p>;
  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* Welcome section */}
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 text-teal-500 bg-clip-text text-transparent">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer
            ? "Manage your interviews and candidates effectively."
            : "Access your upcoming interviews and preparation"}
        </p>
      </div>

      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setshowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
      ) : (
        <>
          <div className="">candidate view </div>
        </>
      )}
    </div>
  );
};

export default HomePage;

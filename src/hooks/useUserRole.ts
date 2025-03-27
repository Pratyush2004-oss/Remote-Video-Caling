import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useUserRole = () => {
  const { user } = useUser();

  const userData = useQuery(api.users.getUserbyClerkId, {
    clerkId: user?.id || "",
  });

  const isLoadiing = userData === undefined;

  return {
    isLoadiing, 
    isInterviewer: userData?.role === "interviewer",
    isCandidate: userData?.role === "candidate",
  };
};

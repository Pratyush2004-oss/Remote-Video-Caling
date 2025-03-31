"use client";

import LoaderUi from "@/components/shared/LoaderUi";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import InterviewScheduleUI from "./InterviewScheduleUI";

function SchedulePage() {
  const router = useRouter();
  const { isInterviewer, isLoadiing } = useUserRole();

  if (isLoadiing) return <LoaderUi />;
  if (!isInterviewer) return router.push("/");

  return <InterviewScheduleUI />;

}

export default SchedulePage;

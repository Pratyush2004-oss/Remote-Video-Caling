'use client';
import LoaderUi from "@/components/shared/LoaderUi";
import MeetingRoom from "@/components/shared/MeetingRoom";
import MeetingSetup from "@/components/shared/MeetingSetup";
import useGetCallById from "@/hooks/useGetCallsbyId";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import React, { useState } from "react";

function MeetingPage() {
  const { id } = useParams();
  const { isLoaded } = useUser();
  const [isSetupComplete, setisSetupComplete] = useState<boolean>(false);
  const { call, isCallLoading } = useGetCallById(id as string);
  if (!isLoaded || isCallLoading) return <LoaderUi />;

  if (!call) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">Meeting not found</p>
      </div>
    );
  }
  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup onSetupComplete={() => setisSetupComplete(true)} />
        ) : (
          <MeetingRoom />
        )}
      </StreamTheme>
    </StreamCall>
  );
}

export default MeetingPage;

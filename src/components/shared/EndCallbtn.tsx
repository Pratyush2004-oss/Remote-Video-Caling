import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";

function EndCallbtn() {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipants = useLocalParticipant();

  const updateInterviewStatus = useMutation(
    api.interviews.updateInterviewStatus
  );

  const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
    streamCallId: call?.id || "",
  });

  if (!call || !interview) return null;

  const endCall = async () => {
    try {
      await call.endCall();
      await updateInterviewStatus({ status: "completed", id: interview._id });
      router.push("/");
      toast.success("Meeting ended for everyone");
    } catch (error) {
        console.log(error);
        toast.error("Error ending meeting");
    }
  };

  const meetingOwner = localParticipants?.userId === call.state.createdBy?.id;
  if (!meetingOwner) return null;
  return (
    <Button variant={"destructive"} onClick={endCall}>
      {" "}
      End call
    </Button>
  );
}

export default EndCallbtn;

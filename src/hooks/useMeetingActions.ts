import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const useMeetingActions = () => {
  const router = useRouter();
  const client = useStreamVideoClient();

//   creating eeeting
  const createInstantMeeting = async () => {
    if (!client) return;

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            description: "Instant Meeting",
          },
        },
      });
      router.push(`/meeting/${call.id}`);
      toast.success("Meeting created successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error creating meeting");
    }
  };

//   join meeting bu click link
  const joinMeeting = (callId:string) => {
    if(!client) return toast.error("Error joining meeting, Please try again");
    router.push(`/meeting/${callId}`);
  };

  return {createInstantMeeting, joinMeeting};
};

export default useMeetingActions;

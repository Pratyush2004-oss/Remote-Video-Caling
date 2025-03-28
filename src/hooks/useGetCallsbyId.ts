import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const useGetCallById = (id: string | string[]) => {
  const [call, setcall] = useState<Call>();
  const [isCallLoading, setisCallLoading] = useState<boolean>(true);
  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    const getCall = async () => {
      try {
        const { calls } = await client.queryCalls({
          filter_conditions: { id },
        });
        if (calls.length > 0) setcall(calls[0]);
      } catch (error) {
        console.log(error);
        setcall(undefined);
      } finally {
        setisCallLoading(false);
      }
    };

    getCall();
}, [client, id]);
return { call, isCallLoading };
};

export default useGetCallById;

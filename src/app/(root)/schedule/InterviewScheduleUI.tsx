import UserInfo from "@/components/shared/UserInfo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../../../convex/_generated/api";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/shared/MeetingCard";

function InterviewScheduleUI() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setopen] = useState<boolean>(false);
  const [isCreating, setisCreating] = useState<boolean>(false);

  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];

  const createInterview = useMutation(api.interviews.createInterview);

  const candidates = users?.filter((user) => user.role === "candidate");
  const interviewers = users?.filter((user) => user.role === "interviewer");

  const [formData, setformData] = useState({
    title: "",
    description: "",
    date: Date.now(),
    time: "09:00",
    candidateId: "",
    interviewerIds: user?.id ? [user?.id] : [],
  });

  //   adding interviewers
  const addInterviewer = async (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setformData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }));
    }
  };

  //   removing interviewers
  const removeInterviewer = async (interviewId: string) => {
    if (interviewId === user?.id) return;

    setformData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((id) => id !== interviewId),
    }));
  };

  //   selected interviewers
  const selectedInterviewers = interviewers?.filter((i) =>
    formData.interviewerIds.includes(i.clerkId)
  );

  //   getting available interviewers
  const availableInterviewers = interviewers.filter(
    (i) => !formData.interviewerIds.includes(i.clerkId)
  );

  const scheduleMeeting = async () => {
    if (!user || !client) return;

    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and at least one interviewer");
      return;
    }
    setisCreating(true);

    try {
      const { title, description, date, time, candidateId, interviewerIds } =
        formData;
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      await createInterview({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcomming",
        streamCallId: id,
        candidateId,
        interviewerIds,
      });

      setopen(false);
      toast.success("Meeting scheduled successfully");

      setformData({
        title: "",
        description: "",
        date: Date.now(),
        candidateId: "",
        time: "09:00",
        interviewerIds: user?.id ? [user?.id] : [],
      });
    } catch (error) {
      console.log(error);
      toast.error("Error scheduling meeting, Please try again");
    } finally {
      setisCreating(false);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage interviews
          </p>
        </div>

        {/* Dialog */}
        <Dialog open={open} onOpenChange={setopen}>
          <DialogTrigger asChild>
            <Button size={"lg"}>Schedule Interview</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Interview Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title </label>
                <Input
                  placeholder="Interview Title"
                  value={formData.title}
                  onChange={(e) =>
                    setformData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* Interview description*/}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description </label>
                <Textarea
                  placeholder="Interview Description"
                  value={formData.description}
                  onChange={(e) =>
                    setformData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* CANDIDATE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Candidate</label>
                <Select
                  value={formData.candidateId}
                  onValueChange={(candidateId) =>
                    setformData({ ...formData, candidateId })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem
                        key={candidate.clerkId}
                        value={candidate.clerkId}
                      >
                        <UserInfo user={candidate} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* INTERVIEWERS */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Interviewers</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedInterviewers.map((interviewer) => (
                    <div
                      key={interviewer.clerkId}
                      className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                    >
                      <UserInfo user={interviewer} />
                      {interviewer.clerkId !== user?.id && (
                        <Button
                          className="hover:text-destructive transition-colors"
                          onClick={() => removeInterviewer(interviewer.clerkId)}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {availableInterviewers.length > 0 && (
                  <Select onValueChange={addInterviewer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add Interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInterviewers.map((interviewer) => (
                        <SelectItem
                          value={interviewer.clerkId}
                          key={interviewer.clerkId}
                        >
                          <UserInfo user={interviewer} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* DATE AND TIME */}
              <div className="flex gap-4">
                {/* Calender */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Calendar
                    mode="single"
                    selected={new Date(formData.date)}
                    onSelect={(date) =>
                      date && setformData({ ...formData, date: date.getTime() })
                    }
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
                {/* TIME */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Select
                    value={formData.time}
                    onValueChange={(time) => setformData({ ...formData, time })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant={"outline"} onClick={() => setopen(false)}>
                  Cancel
                </Button>
                <Button onClick={scheduleMeeting} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="animate-spin size-4 mr-2" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Meeting"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meeting Cards */}
      {!interviews ? (
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      ) : interviews.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <MeetingCard key={interview._id} interview={interview} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No interviews scheduled
        </div>
      )}
    </div>
  );
}

export default InterviewScheduleUI;

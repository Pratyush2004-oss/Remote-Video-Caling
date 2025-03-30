import { CallRecording } from "@stream-io/video-react-sdk";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { calculateRecordingDuration } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Calendar, Check, Clock, Copy, Play } from "lucide-react";
import { Button } from "../ui/button";
function RecordingCard({ recording }: { recording: CallRecording }) {
  const [copiedURL, setcopiedURL] = useState<string | null>(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(recording.url);
      setcopiedURL(recording.url);
      toast.success("Recording link copied to clipboard");
    } catch (error) {
      toast.error("Error in copying the URL");
    }
  };

  const formattedStartTime = recording.start_time
    ? format(new Date(recording.start_time), "MMM d, yyyy, hh:mm a")
    : "Unknown";

  const duration =
    recording.start_time && recording.end_time
      ? calculateRecordingDuration(recording.start_time, recording.end_time)
      : "Unknown Duration";
  return (
    <Card className="group hover:shadow-md transition-all">
      {/* HEADER */}
      <CardHeader className="space-y-1">
        <div className="space-y-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Calendar className="size-3.5" />
              <span>{formattedStartTime}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Clock className="size-3.5" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      {/* CARD CONTENT */}
      <CardContent>
        <div
          className="w-full aspect-video bg-muted/50 rounded-lg flex items-center justify-center cursor-pointer group"
          onClick={() => window.open(recording.url, "_blank")}
        >
          <div className="size-12 rounded-full bg-background/90 flex items-center justify-center group-hover:bg-primary transition-colors">
            <Play className="size-6 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          className="flex-1"
          onClick={() => window.open(recording.url, "_blank")}
        >
          <Play className="size-4 mr-2" />
          Play Recording
        </Button>
        <Button
          variant={"secondary"}
          onClick={handleCopyLink}
          disabled={copiedURL === recording.url}
        >
          {copiedURL === recording.url ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RecordingCard;

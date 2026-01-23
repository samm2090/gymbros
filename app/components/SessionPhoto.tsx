"use client";
import "./sessionPhoto.css";
import { formatDate } from "@/lib/utils/date";

type Props = {
  photoUrl: string;
  timestamp: Date;
};

export default function SessionPhoto({ photoUrl, timestamp }: Props) {
  return (
    <div className="session-photo">
      <img src={photoUrl} alt="Workout proof" />
      <span className="timestamp">{formatDate(timestamp)}</span>
    </div>
  );
}

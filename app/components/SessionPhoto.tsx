"use client";

import { getRandomNumber } from "@/lib/utils/number.util";
import "./sessionPhoto.css";
import { formatDate } from "@/lib/utils/date.util";

type Props = {
  photoUrl: string;
  timestamp: Date | null;
  isWinner?: boolean;
};

export default function SessionPhoto({
  photoUrl = "",
  timestamp,
  isWinner = false,
}: Props) {
  if (!photoUrl) {
    photoUrl = `/workout-placeholder-${getRandomNumber(1, 6)}.png`;
  }

  return (
    <div className={`session-photo ${isWinner ? "glow" : ""}`}>
      <img src={photoUrl} alt="workout proof" />
      {timestamp && <span className="timestamp">{formatDate(timestamp)}</span>}
    </div>
  );
}

import { randomUUID } from "crypto";
import { getDB } from "../infrastructure/mongo-client.infra";
import { uploadFileToVercel } from "../infrastructure/vercel-blob.infra";
import { DbTables } from "../types/db-tables.enum";
import { ObjectId } from "mongodb";
import {
  getRegionCurrentDate,
  getWeekEndDate,
  getWeekStartDate,
} from "../utils/date";

export async function recordSession(userId: string, file: File) {
  const extension = file.name.split(".").pop();
  const randomName = `${randomUUID()}.${extension}`;

  const filenameAndPath = `users/${userId}/workout-sessions/${randomName}`;

  const photoUrl = await uploadFileToVercel(filenameAndPath, file);
  const db = await getDB();

  const result = await db.collection(DbTables.WORKOUT_SESSIONS).insertOne({
    userId: new ObjectId(userId),
    timestamp: new Date(),
    photoUrl,
  });

  return { photoUrl };
}

export async function getUsersSessions(userIds?: string[]): Promise<
  {
    _id: string;
    name: string;
    profilePicture: string;
    isWinner: boolean;
    workoutSessions: { photoUrl: string; timestamp: Date }[];
  }[]
> {
  const db = await getDB();

  const today = getRegionCurrentDate();
  const weekStart = getWeekStartDate(today);
  const weekEnd = getWeekEndDate(today);

  const users = await db.collection(DbTables.USERS).find({}).toArray();

  const workoutSessions = await db
    .collection(DbTables.WORKOUT_SESSIONS)
    .find({
      timestamp: {
        $gte: weekStart,
        $lt: weekEnd,
      },
    })
    .toArray();

  let maxWorkoutSessions = 0;

  const response = users.map((user) => {
    const userWorkoutSessions = workoutSessions.filter(
      (workout) => String(workout.userId) === String(user._id),
    );

    userWorkoutSessions.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );

    maxWorkoutSessions = Math.max(
      maxWorkoutSessions,
      userWorkoutSessions.length,
    );

    return {
      _id: String(user._id),
      name: user.name,
      profilePicture: user.profilePicture,
      workoutSessions: JSON.parse(JSON.stringify(userWorkoutSessions)),
      isWinner: false,
    };
  });

  response.sort((a, b) => b.workoutSessions.length - a.workoutSessions.length);

  response.forEach((user) => {
    if (
      user.workoutSessions.length > 0 &&
      user.workoutSessions.length === maxWorkoutSessions
    ) {
      user.isWinner = true;
    }
  });

  return response;

  // const workoutSessions = await db
  //   .collection(DbTables.WORKOUT_SESSIONS)
  //   .aggregate([
  //     {
  //       $match: {
  //         date: {
  //           $gte: weekStart,
  //           $lt: weekEnd,
  //         },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: DbTables.USERS,
  //         localField: "userId",
  //         foreignField: "_id",
  //         as: "user",
  //       },
  //     },
  //     {
  //       $unwind: "$user",
  //     },
  //   ])
  //   .toArray();
}

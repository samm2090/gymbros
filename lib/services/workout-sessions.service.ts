import { randomUUID } from "crypto";
import { getDB } from "../infrastructure/mongo-client.infra";
import { uploadFileToVercel } from "../infrastructure/vercel-blob.infra";
import { DbTables } from "../types/db-tables.enum";
import { ObjectId } from "mongodb";
import { getWeekEndDate, getWeekStartDate } from "../utils/date";

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

  return result;
}

export async function getUsersSessions(userIds?: string[]): Promise<[]> {
  console.log("a");

  const db = await getDB();

  const today = new Date();
  const weekStart = getWeekStartDate(today);
  const weekEnd = getWeekEndDate(today);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 1);

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

  return users.map((user) => {
    const ownWorkoutSessions = workoutSessions.filter(
      (workout) => String(workout.userId) === String(user._id),
    );

    ownWorkoutSessions.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );

    return { name: user.name, workOutSessions: ownWorkoutSessions };
  });

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

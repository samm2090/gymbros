import { randomUUID } from "crypto";
import { getDB } from "../infrastructure/mongo-client.infra";
import { uploadFileToVercel } from "../infrastructure/vercel-blob.infra";
import { DbTables } from "../types/db-tables.enum";
import { ObjectId } from "mongodb";

export async function recordSession(userId: string, file: File) {
  const extension = file.name.split(".").pop();
  const randomName = `${randomUUID()}.${extension}`;

  const filenameAndPath = `users/${userId}/workout-sessions/${randomName}`;

  const photoUrl = await uploadFileToVercel(filenameAndPath, file);

  const result = (await getDB())
    .collection(DbTables.WORKOUT_SESSIONS)
    .insertOne({
      userId: new ObjectId(userId),
      timestamp: new Date(),
      photoUrl,
    });

  return result;
}

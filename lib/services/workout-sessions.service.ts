import { getDB } from "../infrastructure/mongo-client.infra";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";
import { uploadFileToVercel } from "../infrastructure/vercel-blob.infra";

export async function recordSession(userId: string, file: File) {
  const extension = file.name.split(".").pop();
  const randomName = `${randomUUID()}.${extension}`;

  const photoUrl = await uploadFileToVercel(
    `users/${userId}/workout-sessions/${randomName}`,
    file,
  );

  const result = (await getDB()).collection("workout-sessions").insertOne({
    userId: new ObjectId(userId),
    timestamp: new Date(),
    photoUrl,
  });

  return result;
}

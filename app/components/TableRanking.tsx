"use client";

import SessionPhoto from "./SessionPhoto";

type Props = {
  users: {
    _id: string;
    name: string;
    profilePicture: string;
    isWinner: boolean;
    workoutSessions: {
      photoUrl: string;
      timestamp: Date;
    }[];
  }[];
};

export default function TableRanking({ users }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-zinc-100 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              Bro
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              #
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              Foto
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={String(user._id)}
              className="border-t border-zinc-200 dark:border-zinc-800"
            >
              <td className="px-4 py-3 font-medium">
                {user.name}
                <div className="flex flex-direction-row">
                  <img
                    src={user?.profilePicture || "/profile-placeholder.png"}
                    alt="profile pic"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {user.isWinner ? "👑" : ""}
                </div>
              </td>

              <td className="px-4 py-3">
                {user?.workoutSessions?.length || 0}/7
              </td>

              <td className="px-4 py-3">
                <SessionPhoto
                  photoUrl={user?.workoutSessions[0]?.photoUrl}
                  isWinner={user?.isWinner}
                  timestamp={
                    user?.workoutSessions[0]?.timestamp
                      ? new Date(user?.workoutSessions[0]?.timestamp)
                      : null
                  }
                ></SessionPhoto>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

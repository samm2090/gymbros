import type { Metadata } from "next";
import Image from "next/image";

type Props = {
  params: Promise<{
    photoUrl: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { photoUrl } = await params;
  const decodedUrl = decodeURIComponent(photoUrl);

  return {
    title: "Workout completed 💪",
    description: "Check out my workout photo",
    openGraph: {
      title: "Workout completed 💪",
      description: "Check out my workout photo",
      images: [
        {
          url: decodedUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function Photo({ params }: Props) {
  const { photoUrl } = await params;
  const decodedUrl = decodeURIComponent(photoUrl);

  return (
    <div className="relative w-full max-w-md aspect-[3/4]">
      <Image
        src={decodedUrl}
        alt="Workout photo"
        width={500}
        height={800}
        className="h-auto w-full"
      />
    </div>
  );
}

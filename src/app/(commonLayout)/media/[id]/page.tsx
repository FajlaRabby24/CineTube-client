import MediaDetails from "@/components/modules/Media/MediaDetails";
import { getMediaById } from "@/services/Media/getMedia.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const MovieDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["movie-details", id],
    queryFn: () => getMediaById(id),
  });

  const media = await getMediaById(id);

  if (!media) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-4">
           <h1 className="text-4xl font-black">404</h1>
           <p className="text-slate-500">Movie not found</p>
        </div>
      </div>
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MediaDetails media={media} />
    </HydrationBoundary>
  );
};

export default MovieDetailsPage;

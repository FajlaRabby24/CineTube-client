import { MediaHeader } from "@/components/modules/Media/MediaHeader";
import MoviesListing from "@/components/modules/Media/MoviesListing";
import { BackgroundEffects } from "@/components/ui/background-effects";
import { getAllMedia } from "@/services/Media/getMedia.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const MediaPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const queryParamsObjects = await searchParams;

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key];
      if (value === undefined) {
        return "";
      }

      if (Array.isArray(value)) {
        return value
          .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join("&");
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");

  // Default to type=MOVIE for this page
  const fullQueryString = `type=MOVIE${queryString ? `&${queryString}` : ""}`;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["medias", queryString],
    queryFn: () => getAllMedia(fullQueryString),
  });

  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      <BackgroundEffects />
      <div className="container relative z-10 mx-auto px-4">
        {/* Page Header */}
        <MediaHeader />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <MoviesListing initialQueryString={fullQueryString} />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default MediaPage;

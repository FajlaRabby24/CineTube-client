import MoviesListing from "@/components/modules/Media/MoviesListing";
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
    queryKey: ["movies", queryString],
    queryFn: () => getAllMedia(fullQueryString),
  });

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
            Cinematic Library
          </div>
          <h1 className="text-4xl font-black text-white md:text-6xl uppercase font-outfit tracking-tighter">
            Discover <span className="text-primary italic">Movies</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg font-medium">
            Explore our vast collection of feature films across all genres. From timeless classics to the latest blockbusters.
          </p>
        </div>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <MoviesListing initialQueryString={fullQueryString} />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default MediaPage;

import Watchlist from "@/components/modules/Dashboard/Watchlist";
import { getUserWatchlist } from "@/services/Dashboard/watchlist.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const WatchlistPage = async ({
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

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user-watchlist", queryString],
    queryFn: () => getUserWatchlist(queryString),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Watchlist initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default WatchlistPage;

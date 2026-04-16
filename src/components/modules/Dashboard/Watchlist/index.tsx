"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  BookmarkIcon, 
  Trash2Icon, 
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  FilmIcon,
  TvIcon,
  CalendarIcon
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { getUserWatchlist, removeFromWatchlist, IWatchlistItem } from "@/services/Dashboard/watchlist.service";

interface WatchlistProps {
  initialQueryString: string;
}

const Watchlist = ({ initialQueryString }: WatchlistProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("searchTerm") || "";

  const [searchInput, setSearchInput] = useState(searchTerm);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = new URLSearchParams(initialQueryString);
  if (debouncedSearch) queryParams.set("searchTerm", debouncedSearch);
  queryParams.set("page", String(page));

  const { data: watchlistData, isLoading, refetch } = useQuery({
    queryKey: ["user-watchlist", page, debouncedSearch],
    queryFn: () => getUserWatchlist(queryParams.toString()),
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set("page", String(newPage));
    router.push(`/dashboard/watchlist?${params.toString()}`);
  };

  const removeMutation = useMutation({
    mutationFn: (mediaId: string) => removeFromWatchlist(mediaId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Removed from watchlist");
        queryClient.invalidateQueries({ queryKey: ["user-watchlist"] });
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Failed to remove item"),
  });

  const handleRemove = (mediaId: string, title: string) => {
    Swal.fire({
      title: "Remove from Watchlist?",
      text: `Are you sure you want to remove "${title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Remove",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        removeMutation.mutate(mediaId);
      }
    });
  };

  const items = watchlistData?.data || [];
  const meta = watchlistData?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-outfit">My Watchlist</h1>
          <p className="text-sm text-muted-foreground">Keep track of what you want to watch next</p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your watchlist..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
            {meta.total} {meta.total === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="border-dashed py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                    <BookmarkIcon className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Your watchlist is empty</h3>
                <p className="text-sm text-muted-foreground max-w-[250px] mt-1">
                    Once you save movies or shows, they'll appear here for easy access.
                </p>
                <Button asChild variant="outline" className="mt-6">
                    <Link href="/media">Browse Movies & Shows</Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item: IWatchlistItem) => (
            <Card key={item.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
               <div className="relative aspect-[2/3] overflow-hidden">
                    {item.media.posterUrl ? (
                        <Image
                            src={item.media.posterUrl}
                            alt={item.media.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                            <FilmIcon className="size-12 text-muted-foreground/20" />
                        </div>
                    )}
                    
                    {/* Overlay functionality */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div className="flex gap-2">
                             <Button asChild size="sm" className="flex-1">
                                <Link href={`/media/${item.media.slug}`}>
                                    <EyeIcon className="mr-2 size-4" /> View Details
                                </Link>
                             </Button>
                             <Button 
                                size="sm" 
                                variant="destructive" 
                                className="size-9 p-0"
                                onClick={() => handleRemove(item.mediaId, item.media.title)}
                             >
                                <Trash2Icon className="size-4" />
                             </Button>
                        </div>
                    </div>

                    <Badge className="absolute left-2 top-2 bg-black/60 text-white backdrop-blur-md border-none px-2 py-0.5 text-[10px]">
                        {item.media.type === "MOVIE" ? <FilmIcon className="size-3 mr-1 inline" /> : <TvIcon className="size-3 mr-1 inline" />}
                        {item.media.type}
                    </Badge>
               </div>
               <CardFooter className="flex flex-col items-start p-4 bg-card">
                    <h3 className="line-clamp-1 text-sm font-bold group-hover:text-primary transition-colors">
                        {item.media.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <CalendarIcon className="size-3" />
                        {item.media.releaseYear}
                    </div>
               </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-8">
          <p className="text-sm text-muted-foreground font-medium">
            Page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="h-9 px-4"
            >
              <ChevronLeftIcon className="mr-2 size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="h-9 px-4"
            >
              Next
              <ChevronRightIcon className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;

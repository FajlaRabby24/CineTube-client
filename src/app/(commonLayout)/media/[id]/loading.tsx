import { Skeleton } from "@/components/ui/skeleton";

const MediaLoading = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 overflow-hidden">
      {/* Hero Skeleton */}
      <div className="relative h-[60vh] md:h-[80vh] w-full bg-black/60">
        <Skeleton className="absolute inset-0 z-0 bg-white/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
        
        {/* Content Container Skeleton */}
        <div className="container relative z-20 mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* Poster Skeleton */}
            <Skeleton className="hidden md:block aspect-[2/3] w-64 shrink-0 rounded-2xl bg-white/5 border border-white/10" />
            
            {/* Meta Info Skeleton */}
            <div className="space-y-6 flex-1 w-full">
              <div className="flex gap-2">
                <Skeleton className="h-4 w-20 bg-white/5 rounded-full" />
                <Skeleton className="h-4 w-20 bg-white/5 rounded-full" />
              </div>
              <Skeleton className="h-16 md:h-24 w-3/4 bg-white/5 rounded-xl" />
              <div className="flex gap-6">
                <Skeleton className="h-6 w-24 bg-white/5 rounded-md" />
                <Skeleton className="h-6 w-24 bg-white/5 rounded-md" />
                <Skeleton className="h-6 w-24 bg-white/5 rounded-md" />
              </div>
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-14 w-40 bg-white/5 rounded-2xl" />
                <Skeleton className="h-14 w-40 bg-white/10 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Dashboard Skeleton */}
      <div className="container mx-auto px-4 mt-12 grid lg:grid-cols-4 gap-8 lg:gap-16">
        {/* Left: Synopsis Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-8 w-1/4 bg-white/5" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-3/4 bg-white/5" />
          </div>
          <div className="flex gap-2 pt-4">
             <Skeleton className="h-4 w-16 bg-white/5" />
             <Skeleton className="h-4 w-16 bg-white/5" />
             <Skeleton className="h-4 w-16 bg-white/5" />
          </div>
        </div>

        {/* Right: Metadata Modules Skeleton */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
             <Skeleton className="h-3 w-1/2 bg-white/5" />
             <Skeleton className="h-5 w-3/4 bg-white/10" />
          </div>
          <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
             <Skeleton className="h-3 w-1/2 bg-white/5" />
             <Skeleton className="h-5 w-3/4 bg-white/10" />
          </div>
        </div>
      </div>

      {/* Review Section Header Skeleton */}
      <div className="container mx-auto px-4 mt-20 space-y-8">
         <Skeleton className="h-12 w-1/3 bg-white/5" />
         <div className="h-48 w-full bg-white/5 rounded-[2.5rem] border border-white/5" />
      </div>
    </div>
  );
};

export default MediaLoading;

"use client";

import Image from "next/image";
import Link from "next/link";
import { StarIcon, PlayIcon, InfoIcon } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { IMediasResponse } from "@/services/Media/getMedia.service";

interface MediaCardProps {
  media: IMediasResponse;
}

const MediaCard = ({ media }: MediaCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-900 shadow-lg transition-all duration-500 hover:shadow-2xl"
    >
      <Link href={`/media/${media.slug}`}>
        <Image
          src={(media as any).posterUrl || "/placeholder-movie.jpg"}
          alt={media.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-[2px]"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Hover Actions */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <Button size="icon" className="size-12 rounded-full bg-primary text-white hover:scale-110 transition-transform">
            <PlayIcon className="size-6 fill-current" />
          </Button>
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white backdrop-blur-md hover:bg-white/20">
            <InfoIcon className="mr-2 size-4" /> View Info
          </Button>
        </div>

        {/* Info Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1 text-[10px] font-black text-yellow-400 uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
              <StarIcon className="size-2.5 fill-current" />
              {media.averageRating.toFixed(1)}
            </div>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{media.releaseYear}</span>
          </div>
          <h3 className="line-clamp-1 text-sm font-bold text-white group-hover:text-primary transition-colors">
            {media.title}
          </h3>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter mt-0.5">{media.type}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MediaCard;

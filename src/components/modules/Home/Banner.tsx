import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Trusted by 50K+ movie lovers
          </span>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Discover, Rate & <span className="text-primary">Review Movies</span>
          </h1>

          <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Explore thousands of movies and series. Share your honest reviews,
            rate titles 1-10, and connect with a community that loves cinema.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/movies">Browse Movies</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#">Watch Trailer</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 flex justify-center md:mt-16">
          <div className="relative w-full max-w-3xl aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted shadow-2xl">
            <Image
              src="/bg.jpg"
              alt="CuneTube Banner"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover "
              priority
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

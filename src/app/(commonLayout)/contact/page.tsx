import ConctactForm from "@/components/contact/ConctactForm";
import { BackgroundEffects } from "@/components/ui/background-effects";

export const metadata = {
  title: "Contact Us - CineTube",
  description: "Get in touch with the developer of CineTube.",
};

export default function ContactPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-start justify-center pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Cinematic theme background effects */}
      <BackgroundEffects />

      <div className="max-w-4xl w-full space-y-6 z-10">
        {/* Contact Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Get In <span className="text-red-500">Touch</span>
          </h1>
          <p className="text-gray-400 text-md max-w-2xl mx-auto font-medium">
            Have questions about CineTube, media feedback, or partnership
            requests? Send me a message and I will reply as soon as possible.
          </p>
        </div>

        {/* Form Component */}
        <ConctactForm />
      </div>
    </div>
  );
}

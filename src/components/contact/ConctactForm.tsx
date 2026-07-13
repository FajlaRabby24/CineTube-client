"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MagicCard } from "@/components/ui/magic-card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, MapPin, Send } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { submitContactForm } from "@/services/Contact/contact.service";

interface FormFields {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const contactSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required."),
  message: z
    .string()
    .min(1, "Message is required.")
    .min(10, "Message must be at least 10 characters."),
});

export default function ConctactForm() {
  const [formData, setFormData] = useState<FormFields>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof FormErrors;
        if (!newErrors[path]) {
          newErrors[path] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await submitContactForm(formData);

      if (res.success) {
        toast.success(res.message || "Thank you! Your message has been sent successfully.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setErrors({});
      } else {
        toast.error(res.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch w-full">
      {/* Left Card: Contact Info */}
      <MagicCard
        mode="orb"
        glowFrom="#dc2626"
        glowTo="#ea580c"
        className="flex flex-col justify-between p-5 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md"
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-">
              Contact Information
            </h2>
            <p className="text-gray-400 text-sm">
              Reach out directly or follow social profiles to connect.
            </p>
          </div>

          {/* Profile Image & Avatar */}
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 border border-white/5">
            <div className="relative w-16 h-16 sm:w-20 h-20 rounded-full overflow-hidden border-2 border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.4)] flex-shrink-0">
              <Image
                src="/profile.png"
                alt="Fajla Rabby"
                fill
                className="object-cover"
                sizes="80px"
                priority
              />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white leading-tight">
                Fajla Rabby
              </h3>
              <p className="text-[10px] uppercase tracking-wider text-red-500 font-bold">
                Lead Web Developer
              </p>
              <p className="text-[11px] text-gray-400">
                Full Stack Developer & CineTube Creator
              </p>
            </div>
          </div>

          {/* Detailed Contact List */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex-shrink-0">
                <Mail className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Email
                </p>
                <a
                  href="mailto:fajlarabby.dev@gmail.com"
                  className="text-xs sm:text-sm font-semibold break-all hover:underline"
                >
                  fajlarabby.dev@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex-shrink-0">
                <MapPin className="size-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Location
                </p>
                <span className="text-xs sm:text-sm font-semibold">
                  Dhaka, Bangladesh
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="mt-5 pt-4 border-t border-white/5">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">
            Follow Me
          </p>
          <div className="flex gap-3">
            <a
              href="https://github.com/FajlaRabby24"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2.5 rounded-full bg-slate-900 border border-white/5 text-gray-400 hover:text-white hover:border-red-500 hover:shadow-[0_0_8px_rgba(220,38,38,0.3)] transition-all hover:scale-105"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/fajlarabby24"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2.5 rounded-full bg-slate-900 border border-white/5 text-gray-400 hover:text-white hover:border-red-500 hover:shadow-[0_0_8px_rgba(220,38,38,0.3)] transition-all hover:scale-105"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="https://wa.me/8801307495864"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Chat"
              className="p-2.5 rounded-full bg-slate-900 border border-white/5 text-gray-400 hover:text-white hover:border-red-500 hover:shadow-[0_0_8px_rgba(220,38,38,0.3)] transition-all hover:scale-105"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.634-1.02-5.11-2.881-6.974-1.862-1.863-4.337-2.887-6.971-2.888-5.442 0-9.87 4.42-9.874 9.86-.001 1.75.483 3.42 1.4 4.932l-.991 3.616 3.702-.971zm11.367-7.46c-.327-.164-1.938-.956-2.239-1.065-.301-.11-.522-.164-.74.164-.217.328-.844 1.066-1.035 1.285-.19.22-.38.247-.708.082-.327-.164-1.383-.51-2.637-1.63-1.01-.902-1.69-2.016-1.887-2.343-.197-.329-.022-.507.142-.671.148-.148.328-.382.492-.574.164-.19.219-.328.328-.546.11-.22.055-.41-.027-.574-.082-.164-.74-1.782-1.014-2.44-.267-.643-.561-.555-.74-.564-.176-.01-.38-.012-.584-.012-.204 0-.535.077-.814.383-.28.307-1.07 1.047-1.07 2.553 0 1.506 1.096 2.962 1.246 3.162.15.2 2.157 3.295 5.225 4.617.729.315 1.3.504 1.743.645.733.232 1.399.2 1.926.12.587-.087 1.938-.792 2.21-1.558.272-.764.272-1.42.19-1.558-.08-.137-.301-.22-.628-.384z" />
              </svg>
            </a>
          </div>
        </div>
      </MagicCard>

      {/* Right Card: Contact Form */}
      <MagicCard
        mode="orb"
        glowFrom="#ea580c"
        glowTo="#3b82f6"
        className="p-5 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md"
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Send Message
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Fill out the form below and I will reply directly to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name & Email Row (Responsive desktop row to save vertical space) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Field
                data-invalid={errors.name ? "true" : undefined}
                className="space-y-1"
              >
                <FieldLabel
                  htmlFor="name"
                  className="text-[10px] uppercase tracking-wider font-bold text-gray-400"
                >
                  Your Name
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="bg-slate-950/80 border-white/10 hover:border-white/20 focus:border-red-500 focus:ring-red-500/20 text-white text-xs py-1.5 px-3 h-9.5"
                />
                <FieldError>{errors.name}</FieldError>
              </Field>

              <Field
                data-invalid={errors.email ? "true" : undefined}
                className="space-y-1"
              >
                <FieldLabel
                  htmlFor="email"
                  className="text-[10px] uppercase tracking-wider font-bold text-gray-400"
                >
                  Your Email
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="bg-slate-950/80 border-white/10 hover:border-white/20 focus:border-red-500 focus:ring-red-500/20 text-white text-xs py-1.5 px-3 h-9.5"
                />
                <FieldError>{errors.email}</FieldError>
              </Field>
            </div>

            {/* Phone & Subject Row (Responsive desktop row to save vertical space) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Field className="space-y-1">
                <FieldLabel
                  htmlFor="phone"
                  className="text-[10px] uppercase tracking-wider font-bold text-gray-400"
                >
                  Phone{" "}
                  <span className="text-gray-600 font-normal">(optional)</span>
                </FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="bg-slate-950/80 border-white/10 hover:border-white/20 focus:border-red-500 focus:ring-red-500/20 text-white text-xs py-1.5 px-3 h-9.5"
                />
              </Field>

              <Field
                data-invalid={errors.subject ? "true" : undefined}
                className="space-y-1"
              >
                <FieldLabel
                  htmlFor="subject"
                  className="text-[10px] uppercase tracking-wider font-bold text-gray-400"
                >
                  Subject
                </FieldLabel>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Regarding what?"
                  className="bg-slate-950/80 border-white/10 hover:border-white/20 focus:border-red-500 focus:ring-red-500/20 text-white text-xs py-1.5 px-3 h-9.5"
                />
                <FieldError>{errors.subject}</FieldError>
              </Field>
            </div>

            {/* Message */}
            <Field
              data-invalid={errors.message ? "true" : undefined}
              className="space-y-1"
            >
              <FieldLabel
                htmlFor="message"
                className="text-[10px] uppercase tracking-wider font-bold text-gray-400"
              >
                Message
              </FieldLabel>
              <Textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="bg-slate-950/80 border-white/10 hover:border-white/20 focus:border-red-500 focus:ring-red-500/20 text-white text-xs py-2 px-3 min-h-[90px]"
              />
              <FieldError>{errors.message}</FieldError>
            </Field>

            {/* Submit Button */}
            <div className="pt-1.5">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 cursor-pointer h-10.5 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl transition-all shadow-[0_0_12px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-[1.01] hover:from-red-500 hover:to-orange-500 disabled:opacity-70 disabled:cursor-not-allowed border-none text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin size-4.5" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4.5" />
                    <span>Send Message</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </MagicCard>
    </div>
  );
}

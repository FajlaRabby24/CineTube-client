"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createMedia } from "@/services/Media/mediaActions.service";
import { createMediaZodSchema, GenreEnum } from "@/zod/media.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return String(error);
};

export const CreateMediaModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const [createError, setCreateError] = useState<string | null>(null);

  const [genres, setGenres] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { mutateAsync: createMediaMutate, isPending: isCreating } = useMutation(
    {
      mutationFn: createMedia,
    },
  );

  const form = useForm({
    defaultValues: {
      title: "",
      synopsis: "",
      type: "" as any,
      releaseYear: new Date().getFullYear(),
      ageRating: "" as any,
      duration: undefined as any,
      youtubeStreamUrl: "",
      language: "English",
      country: "USA",
      pricingType: "" as any,
      status: "PUBLISHED" as "DRAFT" | "PUBLISHED" | "UNPUBLISHED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
    },
    onSubmit: async ({ value }) => {
      try {
        setCreateError(null);

        if (genres.length === 0) {
          toast.error("At least one genre is required");
          return;
        }

        const submissionValue = {
          ...value,
          releaseYear: Number(value.releaseYear),
          duration: value.duration ? Number(value.duration) : undefined,
          youtubeStreamUrl: value.youtubeStreamUrl || undefined,
          genres,
          tags: tags.length > 0 ? tags : undefined,
        };

        const result = await createMediaMutate(submissionValue);
        if (result.success) {
          toast.success(result.message);
          onOpenChange(false);
          form.reset();
          setGenres([]);
          setTags([]);
          queryClient.invalidateQueries({ queryKey: ["admin-media"] });
        } else {
          setCreateError(result.message);
        }
      } catch (error) {
        setCreateError("Failed to create media. Please try again.");
      }
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const toggleGenre = (genre: string) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter((g) => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Create New Media</DialogTitle>
          <DialogDescription>
            Add a new movie or series to the catalog with essential details.
          </DialogDescription>
        </DialogHeader>

        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col h-full"
        >
          <ScrollArea className="flex-1 max-h-[60vh] px-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto bg-transparent p-0 flex-wrap mb-4">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none"
                >
                  General Info
                </TabsTrigger>
                <TabsTrigger
                  value="metadata"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none"
                >
                  Genres & Tags
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-0 outline-none">
                <FieldGroup className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <form.Field
                      name="title"
                      validators={{
                        onChange: createMediaZodSchema.shape.title,
                      }}
                    >
                      {(field) => (
                        <div className="space-y-2 sm:col-span-2">
                          <FieldLabel htmlFor={field.name}>
                            Title <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Inception"
                          />
                        </div>
                      )}
                    </form.Field>
                  </Field>

                  <Field>
                    <form.Field
                      name="synopsis"
                      validators={{
                        onChange: createMediaZodSchema.shape.synopsis,
                      }}
                    >
                      {(field) => (
                        <div className="space-y-2 sm:col-span-2">
                          <FieldLabel htmlFor={field.name}>
                            Synopsis <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="A brief description..."
                          />
                        </div>
                      )}
                    </form.Field>
                  </Field>

                  <Field>
                    <form.Field name="type">
                      {(field) => (
                        <div className="space-y-2">
                          <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                          <Select
                            value={field.state.value}
                            onValueChange={field.handleChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MOVIE">Movie</SelectItem>
                              <SelectItem value="SERIES">Series</SelectItem>
                              <SelectItem value="TRAILER">Trailer</SelectItem>
                              <SelectItem value="EPISODE">Episode</SelectItem>
                              <SelectItem value="SHORT">Short</SelectItem>
                              <SelectItem value="FUNNY">Funny</SelectItem>
                              <SelectItem value="SPORT">Sport</SelectItem>
                              <SelectItem value="MOTIVATIONAL">
                                Motivational
                              </SelectItem>
                              <SelectItem value="EDUCATIONAL">
                                Educational
                              </SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </form.Field>
                  </Field>

                  <Field>
                    <form.Field name="releaseYear">
                      {(field) => (
                        <div className="space-y-2">
                          <FieldLabel htmlFor={field.name}>
                            Release Year
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="number"
                            value={field.state.value}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                          />
                        </div>
                      )}
                    </form.Field>
                  </Field>

                  <Field>
                    <form.Field name="youtubeStreamUrl">
                      {(field) => (
                        <div className="space-y-2 sm:col-span-2">
                          <FieldLabel htmlFor={field.name}>
                            YouTube URL
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                          />
                        </div>
                      )}
                    </form.Field>
                  </Field>

                  <Field>
                    <form.Field name="pricingType">
                      {(field) => (
                        <div className="space-y-2">
                          <FieldLabel htmlFor={field.name}>Pricing</FieldLabel>
                          <Select
                            value={field.state.value}
                            onValueChange={field.handleChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FREE">Free</SelectItem>
                              <SelectItem value="PREMIUM">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </form.Field>
                  </Field>

                  <Field>
                    <form.Field name="ageRating">
                      {(field) => (
                        <div className="space-y-2">
                          <FieldLabel htmlFor={field.name}>
                            Age Rating
                          </FieldLabel>
                          <Select
                            value={field.state.value}
                            onValueChange={field.handleChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="G">G</SelectItem>
                              <SelectItem value="PG">PG</SelectItem>
                              <SelectItem value="PG_13">PG-13</SelectItem>
                              <SelectItem value="R">R</SelectItem>
                              <SelectItem value="NC_17">NC-17</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </form.Field>
                  </Field>
                </FieldGroup>
              </TabsContent>

              <TabsContent
                value="metadata"
                className="mt-0 outline-none space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <form.Field name="language">
                      {(field) => (
                        <div className="space-y-2">
                          <FieldLabel htmlFor={field.name}>Language</FieldLabel>
                          <Input
                            id={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      )}
                    </form.Field>
                  </Field>
                  <Field>
                    <form.Field name="country">
                      {(field) => (
                        <div className="space-y-2">
                          <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                          <Input
                            id={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      )}
                    </form.Field>
                  </Field>
                </div>

                <div className="flex gap-4">
                  <form.Field name="isFeatured">
                    {(field) => (
                      <label className="flex gap-2 text-sm items-center cursor-pointer border p-2 rounded">
                        <input
                          type="checkbox"
                          checked={field.state.value}
                          onChange={(e) => field.handleChange(e.target.checked)}
                        />{" "}
                        Featured
                      </label>
                    )}
                  </form.Field>
                  <form.Field name="isTrending">
                    {(field) => (
                      <label className="flex gap-2 text-sm items-center cursor-pointer border p-2 rounded">
                        <input
                          type="checkbox"
                          checked={field.state.value}
                          onChange={(e) => field.handleChange(e.target.checked)}
                        />{" "}
                        Trending
                      </label>
                    )}
                  </form.Field>
                </div>

                <div className="space-y-2">
                  <FieldLabel>Genres</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {GenreEnum.options.map((g) => (
                      <Badge
                        key={g}
                        variant={genres.includes(g) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleGenre(g)}
                      >
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel>Tags</FieldLabel>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button type="button" onClick={addTag} variant="secondary">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((t) => (
                      <Badge key={t} variant="secondary" className="gap-1">
                        {t}
                        <button
                          type="button"
                          onClick={() =>
                            setTags(tags.filter((tag) => tag !== t))
                          }
                        >
                          <XIcon className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <div className="p-6 pt-4 border-t flex flex-col gap-2 bg-background z-10 sticky bottom-0">
            {createError && (
              <p className="text-sm text-red-500 font-medium">{createError}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Media"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

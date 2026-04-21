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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { createAdmin } from "@/services/Admin/createAdmin.service";
import {
  getAdminById,
  getAllAdmins,
  IAdminListItem,
} from "@/services/Admin/getAdmins.service";

import { createAdminZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return String(error);
};

import {
  CalendarIcon,
  Film,
  MailIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";

import Image from "next/image";

import { toast } from "sonner";

interface AdminManagementProps {
  initialQueryString: string;
}

const AdminManagement = ({ initialQueryString }: AdminManagementProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("searchTerm") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = new URLSearchParams(initialQueryString);
  if (debouncedSearch) {
    queryParams.set("searchTerm", debouncedSearch);
  }
  if (page) {
    queryParams.set("page", String(page));
  }

  const { data: adminsData, isLoading } = useQuery({
    queryKey: ["admin-admins", page, debouncedSearch],
    queryFn: () => getAllAdmins(queryParams.toString()),
  });

  const { data: selectedAdmin, isLoading: isLoadingAdmin } = useQuery({
    queryKey: ["admin-admin", selectedAdminId],
    queryFn: () => getAdminById(selectedAdminId!),
    enabled: !!selectedAdminId && isDetailsOpen,
  });

  const { mutateAsync: createAdminMutate, isPending: isCreating } = useMutation(
    {
      mutationFn: createAdmin,
    },
  );

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await createAdminMutate(value);
        if (result.success) {
          toast.success(result.message);
          setIsCreateOpen(false);
          form.reset();
        } else {
          setCreateError(result.message);
        }
      } catch (error) {
        setCreateError("Failed to create admin. Please try again.");
      }
    },
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(initialQueryString);
    params.set("page", String(newPage));
    if (debouncedSearch) params.set("searchTerm", debouncedSearch);
    router.push(`/admin/dashboard/admin-management?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    const params = new URLSearchParams(initialQueryString);
    params.set("page", "1");
    if (value) params.set("searchTerm", value);
    router.push(`/admin/dashboard/admin-management?${params.toString()}`);
  };

  const handleViewDetails = (adminId: string) => {
    setSelectedAdminId(adminId);
    setIsDetailsOpen(true);
  };

  const admins = adminsData?.data || [];

  const meta = adminsData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-600/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
          <Film className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen space-y-8 p-6 text-white lg:p-10">
        {/* Cinematic Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-2xl"
        >
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl text-red-600" />
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                Admin Management
              </h1>
              <p className="text-neutral-500">
                Orchestrate system administrators and access permissions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative w-full sm:w-72">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-600" />
                <Input
                  placeholder="Search admins..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSearch(searchInput)
                  }
                  className="border-white/5 bg-white/5 pl-9 text-white placeholder:text-neutral-600 focus:border-red-600/40 focus:ring-0"
                />
              </div>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-red-600 px-6 font-bold text-white transition-all hover:bg-red-700 active:scale-95"
              >
                <PlusIcon className="size-4" />
                Create Admin
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-600 to-red-900 opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Table Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-white/5 bg-black/40 p-1 backdrop-blur-xl"
        />
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">
                Admin
              </TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">
                Role
              </TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">
                Status
              </TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">
                Joined
              </TableHead>
              <TableHead className="text-right font-bold text-neutral-400 uppercase tracking-wider text-xs">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins?.map((admin: IAdminListItem) => (
                <TableRow
                  key={admin.id}
                  className="border-white/5 transition-colors hover:bg-white/5"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-10 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                        {admin.image ? (
                          <Image
                            src={admin.image}
                            alt={admin.name}
                            width={40}
                            height={40}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-sm font-black text-red-600">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white">{admin.name}</p>
                        <p className="text-xs text-neutral-500">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                        admin.role === "SUPER_ADMIN"
                          ? "bg-purple-600/20 text-purple-400 ring-1 ring-purple-600/40"
                          : "bg-blue-600/20 text-blue-400 ring-1 ring-blue-600/40"
                      }`}
                    >
                      {admin.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {admin.isBanned ? (
                        <Badge className="bg-red-600/20 text-red-400 ring-1 ring-red-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                          Banned
                        </Badge>
                      ) : admin.isActive ? (
                        <Badge className="bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-center flex items-center gap-1">
                          <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />{" "}
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-neutral-600/20 text-neutral-400 ring-1 ring-neutral-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-neutral-400">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="size-8 rounded-lg bg-white/5 p-0 text-neutral-400 transition-colors hover:bg-red-600/20 hover:text-red-600"
                        >
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 border-white/5 bg-black/90 p-1 text-white backdrop-blur-xl"
                      >
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-red-600/20 hover:text-red-600"
                          onClick={() => handleViewDetails(admin.admin.id)}
                        >
                          <UserIcon className="size-4" />
                          Admin Console
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              Operators
            </p>
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(meta.page - 1);
                    }}
                    className={`rounded-xl border-white/5 bg-white/5 text-neutral-400 transition-all hover:bg-red-600/10 hover:text-red-600 ${
                      meta.page <= 1
                        ? "pointer-events-none opacity-20"
                        : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                        isActive={meta.page === pageNum}
                        className={`rounded-xl transition-all ${
                          meta.page === pageNum
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-white/5 text-neutral-400 hover:bg-red-600/10 hover:text-red-600"
                        }`}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(meta.page + 1);
                    }}
                    className={`rounded-xl border-white/5 bg-white/5 text-neutral-400 transition-all hover:bg-red-600/10 hover:text-red-600 ${
                      meta.page >= meta.totalPages
                        ? "pointer-events-none opacity-20"
                        : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Admin Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-white/5 bg-black/95 p-8 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">
              Admin Console
            </DialogTitle>
            <DialogDescription className="text-neutral-500 font-medium">
              Real-time synchronization with operator credentials.
            </DialogDescription>
          </DialogHeader>

          {isLoadingAdmin ? (
            <div className="flex items-center justify-center py-12">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
                <ShieldIcon className="h-6 w-6 animate-pulse text-red-600" />
              </div>
            </div>
          ) : selectedAdmin ? (
            <div className="space-y-8">
              {/* Profile Section */}
              <div className="flex items-center gap-6 p-4 rounded-3xl bg-white/5 border border-white/5">
                <div className="size-20 overflow-hidden rounded-full bg-white/10 ring-2 ring-red-600/20 shadow-[0_0_20px_rgba(229,9,20,0.15)]">
                  {selectedAdmin.user.image ? (
                    <Image
                      src={selectedAdmin.user.image}
                      alt={selectedAdmin.user.name}
                      width={80}
                      height={80}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-3xl font-black text-red-600">
                      {selectedAdmin.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black italic tracking-tight text-white uppercase">
                    {selectedAdmin.user.name}
                  </h3>
                  <p className="text-sm font-medium text-neutral-500">
                    {selectedAdmin.user.email}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {selectedAdmin.user.isBanned ? (
                      <Badge className="bg-red-600/20 text-red-400 ring-1 ring-red-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                        Banned
                      </Badge>
                    ) : selectedAdmin.user.isActive ? (
                      <Badge className="bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-neutral-600/20 text-neutral-400 ring-1 ring-neutral-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                        Inactive
                      </Badge>
                    )}
                    <Badge
                      className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                        selectedAdmin.user.role === "SUPER_ADMIN"
                          ? "bg-purple-600/20 text-purple-400 ring-1 ring-purple-600/40"
                          : "bg-blue-600/20 text-blue-400 ring-1 ring-blue-600/40"
                      }`}
                    >
                      {selectedAdmin.user.role.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Grid Layout for details */}
              <div className="grid gap-4">
                {[
                  {
                    label: "Admin Information",
                    icon: ShieldIcon,
                    items: [
                      {
                        key: "Designation",
                        val: selectedAdmin.designation,
                        icon: ShieldIcon,
                      },
                      {
                        key: "Deployment Zone",
                        val: selectedAdmin.address,
                        icon: UserIcon,
                      },
                    ],
                  },
                  {
                    label: "Personal Intelligence",
                    icon: MailIcon,
                    items: [
                      {
                        key: "Comm Link",
                        val: selectedAdmin.user.email,
                        icon: MailIcon,
                      },
                      {
                        key: "Signal Line",
                        val: selectedAdmin.user.phoneNumber,
                        icon: PhoneIcon,
                      },
                      {
                        key: "Operational Bio",
                        val: selectedAdmin.user.bio,
                        icon: UserIcon,
                      },
                    ],
                  },
                  {
                    label: "Temporal Logs",
                    icon: CalendarIcon,
                    items: [
                      {
                        key: "Induction Date",
                        val: new Date(
                          selectedAdmin.user.createdAt,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }),
                        icon: CalendarIcon,
                      },
                      {
                        key: "Last Uplink",
                        val: new Date(
                          selectedAdmin.user.updatedAt,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }),
                        icon: CalendarIcon,
                      },
                    ],
                  },
                ].map((section) => (
                  <div
                    key={section.label}
                    className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-white/10 hover:bg-white/[0.07]"
                  >
                    <h4 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 transition-colors group-hover:text-red-600">
                      <section.icon className="size-3" /> {section.label}
                    </h4>
                    <div className="grid gap-4">
                      {section.items.map(
                        (item) =>
                          item.val && (
                            <div
                              key={item.key}
                              className="flex items-start gap-3"
                            >
                              <div className="mt-0.5 rounded-lg bg-white/5 p-1.5 ring-1 ring-white/5 group-hover:bg-red-600/10 group-hover:ring-red-600/20">
                                <item.icon className="size-3.5 text-neutral-500 group-hover:text-red-600" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-tighter">
                                  {item.key}
                                </p>
                                <p className="text-sm font-bold text-neutral-300 group-hover:text-white transition-colors">
                                  {item.val}
                                </p>
                              </div>
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="py-4 text-center text-muted-foreground">
              Unable to load admin details
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Admin Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="border-white/5 bg-black/95 p-8 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">
              Induct New Operator
            </DialogTitle>
            <DialogDescription className="text-neutral-500 font-medium">
              Grant high-level system clearance to a new administrator.
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
            className="mt-6"
          >
            <FieldGroup className="space-y-6">
              <Field>
                <form.Field
                  name="name"
                  validators={{ onChange: createAdminZodSchema.shape.name }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <FieldLabel
                        htmlFor={field.name}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-600"
                      >
                        <UserIcon className="size-3" /> Identity Name
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Operator Name"
                        className="h-12 border-white/5 bg-white/5 text-white placeholder:text-neutral-700 focus:border-red-600/40 focus:ring-1 focus:ring-red-600/20"
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter italic">
                            ⚠ {getErrorMessage(field.state.meta.errors[0])}
                          </p>
                        )}
                    </div>
                  )}
                </form.Field>
              </Field>

              <Field>
                <form.Field
                  name="email"
                  validators={{ onChange: createAdminZodSchema.shape.email }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <FieldLabel
                        htmlFor={field.name}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-600"
                      >
                        <MailIcon className="size-3" /> Secure Comm Line
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="operator@system.io"
                        className="h-12 border-white/5 bg-white/5 text-white placeholder:text-neutral-700 focus:border-red-600/40 focus:ring-1 focus:ring-red-600/20"
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter italic">
                            ⚠ {getErrorMessage(field.state.meta.errors[0])}
                          </p>
                        )}
                    </div>
                  )}
                </form.Field>
              </Field>

              <Field>
                <form.Field
                  name="password"
                  validators={{ onChange: createAdminZodSchema.shape.password }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <FieldLabel
                        htmlFor={field.name}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-600"
                      >
                        <ShieldIcon className="size-3" /> Access Cipher
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="MIN 8 CHARACTERS"
                        className="h-12 border-white/5 bg-white/5 text-white placeholder:text-neutral-700 focus:border-red-600/40 focus:ring-1 focus:ring-red-600/20 font-mono"
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter italic">
                            ⚠ {getErrorMessage(field.state.meta.errors[0])}
                          </p>
                        )}
                    </div>
                  )}
                </form.Field>
              </Field>
            </FieldGroup>

            {createError && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-900/50 bg-red-600/10 p-4 text-xs font-bold text-red-500 uppercase tracking-tighter">
                <ShieldIcon className="size-4 shrink-0" />
                {createError}
              </div>
            )}

            <div className="mt-10 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl border-white/5 bg-transparent px-8 font-black uppercase tracking-widest text-neutral-500 transition-all hover:bg-white/5 hover:text-white"
                onClick={() => {
                  setIsCreateOpen(false);
                  form.reset();
                }}
              >
                Abort
              </Button>
              <Button
                className="h-12 rounded-xl bg-red-600 px-10 font-black uppercase tracking-widest text-white transition-all hover:bg-red-700 hover:shadow-[0_0_20px_rgba(229,9,20,0.3)] active:scale-95 disabled:opacity-50"
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? "Deploying..." : "Induct Operator"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminManagement;

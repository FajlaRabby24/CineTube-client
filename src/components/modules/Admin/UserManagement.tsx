"use client";

import { motion } from "motion/react";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

import {
  getUserReviews,
  IGetUserReviewsResponse,
  IReview,
} from "@/services/Admin/getUserReviews.service";
import {
  getAllUsers,
  getUserById,
  IGetUserByIdResponse,
  IGetUsersApiResponse,
  IUser,
} from "@/services/Admin/getUsers.service";
import { banUser, unbanUser } from "@/services/Admin/userActions.service";

import { useMutation, useQuery } from "@tanstack/react-query";

import {
  BanIcon,
  BubblesIcon,
  CalendarIcon,
  CreditCardIcon,
  Film,
  HeartIcon,
  MailIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  SearchIcon,
  ShieldIcon,
  StarIcon,
  UserCheckIcon,
  UserIcon,
  UserXIcon,
} from "lucide-react";

import Image from "next/image";

import { UserRole } from "@/lib/authUtilts";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface UserManagementProps {
  initialQueryString: string;
}

const UserManagement = ({ initialQueryString }: UserManagementProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("searchTerm") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedReviewUserId, setSelectedReviewUserId] = useState<
    string | null
  >(null);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

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

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useQuery<IGetUsersApiResponse | null>({
    queryKey: ["admin-users", page, debouncedSearch],
    queryFn: () => getAllUsers(queryParams.toString()),
  });

  const { data: selectedUser, isLoading: isLoadingUser } =
    useQuery<IGetUserByIdResponse | null>({
      queryKey: ["admin-user", selectedUserId],
      queryFn: () => getUserById(selectedUserId!),
      enabled: !!selectedUserId && isDetailsOpen,
    });

  const {
    data: userReviews,
    isLoading: isLoadingReviews,
    refetch: refetchReviews,
  } = useQuery<IGetUserReviewsResponse | null>({
    queryKey: ["admin-user-reviews", selectedReviewUserId],
    queryFn: () => getUserReviews(selectedReviewUserId!, ""),
    enabled: !!selectedReviewUserId && isReviewsOpen,
  });

  console.log(selectedUser, "in user managemen");
  const banMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) =>
      banUser(userId, reason),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        refetch();
      } else {
        toast.error(data.message);
      }
    },
  });

  const unbanMutation = useMutation({
    mutationFn: (userId: string) => unbanUser(userId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        refetch();
      } else {
        toast.error(data.message);
      }
    },
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(initialQueryString);
    params.set("page", String(newPage));
    if (debouncedSearch) params.set("searchTerm", debouncedSearch);
    router.push(`/admin/dashboard/user-management?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    const params = new URLSearchParams(initialQueryString);
    params.set("page", "1");
    if (value) params.set("searchTerm", value);
    router.push(`/admin/dashboard/user-management?${params.toString()}`);
  };

  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId);
    setIsDetailsOpen(true);
  };

  const handleViewReviews = (userId: string) => {
    setSelectedReviewUserId(userId);
    setIsReviewsOpen(true);
  };

  const handleBan = (user: IUser) => {
    Swal.fire({
      title: "Ban User",
      input: "text",
      inputLabel: "Reason (optional)",
      showCancelButton: true,
      confirmButtonText: "Ban",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        banMutation.mutate({ userId: user.id, reason: result?.value });
      }
    });
  };

  const handleUnban = (userId: string) => {
    unbanMutation.mutate(userId);
  };

  const users = (usersData?.data || []).filter(
    (user) => user.role === UserRole.USER,
  );

  const meta = usersData?.meta || {
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
                User Management
              </h1>
              <p className="text-neutral-500">Monitor platform population and access parameters.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
               <div className="relative w-full sm:w-72">
                 <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-600" />
                 <input
                   placeholder="Search users..."
                   value={searchInput}
                   onChange={(e) => setSearchInput(e.target.value)}
                   onKeyDown={(e) =>
                     e.key === "Enter" && handleSearch(searchInput)
                   }
                   className="w-full rounded-xl border border-white/5 bg-white/5 py-2.5 pl-9 text-sm text-white placeholder:text-neutral-600 focus:border-red-600/40 focus:outline-none focus:ring-0"
                 />
               </div>
            </div>
          </div>
        </motion.div>

        {/* Table Container */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           className="rounded-3xl border border-white/5 bg-black/40 p-1 backdrop-blur-xl"
        >

        {/* Table */}
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">User</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Status</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Verified</TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Joined</TableHead>
                <TableHead className="text-right font-bold text-neutral-400 uppercase tracking-wider text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell
                    colSpan={5}
                    className="py-20 text-center"
                  >
                     <div className="flex flex-col items-center gap-2">
                       <UserXIcon className="size-10 text-neutral-800" />
                       <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">No citizens found in registry</p>
                     </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: IUser) => (
                  <TableRow key={user.id} className="border-white/5 transition-colors hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-10 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-sm font-black text-red-600">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white tracking-tight">{user.name}</p>
                          <p className="text-xs font-bold text-neutral-500 uppercase tracking-tighter">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.isBanned ? (
                          <Badge className="bg-red-600/20 text-red-400 ring-1 ring-red-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">Banned</Badge>
                        ) : user.isActive ? (
                          <Badge className="bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-center flex items-center gap-1">
                             <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" /> Active
                          </Badge>
                        ) : (
                          <Badge className="bg-neutral-600/20 text-neutral-400 ring-1 ring-neutral-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">Inactive</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.emailVerified ? (
                        <Badge
                          className="bg-blue-600/20 text-blue-400 ring-1 ring-blue-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit"
                        >
                          <UserCheckIcon className="size-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-red-600/20 text-red-400 ring-1 ring-red-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                          <UserXIcon className="size-3" />
                          Unverified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-neutral-500 tracking-tight">
                      {new Date(user.createdAt).toLocaleDateString()}
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
                            onClick={() => handleViewDetails(user.id)}
                          >
                            <UserIcon className="size-4" />
                            User Intel
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-red-600/20 hover:text-red-600"
                            onClick={() => handleViewReviews(user.id)}
                          >
                            <BubblesIcon className="size-4" />
                            Review Logs
                          </DropdownMenuItem>
  
                          {user.isBanned ? (
                            <DropdownMenuItem
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-green-600/20 hover:text-green-500"
                              onClick={() => handleUnban(user.id)}
                            >
                              <UserCheckIcon className="size-4" />
                              Restore Clearance
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-red-600/20 hover:text-red-600"
                              onClick={() => handleBan(user)}
                            >
                              <BanIcon className="size-4" />
                              Revoke Access
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              Citizens
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
                      meta.page <= 1 ? "pointer-events-none opacity-20" : "cursor-pointer"
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

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-white/5 bg-black/95 p-8 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">
              User Intel
            </DialogTitle>
            <DialogDescription className="text-neutral-500 font-medium">
              Comprehensive identity profile and platform activity.
            </DialogDescription>
          </DialogHeader>

          {isLoadingUser ? (
            <div className="flex items-center justify-center py-12">
               <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10">
                 <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
                 <ShieldIcon className="h-6 w-6 animate-pulse text-red-600" />
               </div>
            </div>
          ) : selectedUser ? (
            <div className="space-y-8">
              {/* Profile Section */}
              <div className="flex items-center gap-6 p-4 rounded-3xl bg-white/5 border border-white/5">
                <div className="size-20 overflow-hidden rounded-full bg-white/10 ring-2 ring-red-600/20 shadow-[0_0_20px_rgba(229,9,20,0.15)]">
                  {selectedUser.image ? (
                    <Image
                      src={selectedUser.image}
                      alt={selectedUser.name}
                      width={80}
                      height={80}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-3xl font-black text-red-600">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black italic tracking-tight text-white uppercase">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm font-medium text-neutral-500">
                    {selectedUser.email}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {selectedUser.isBanned ? (
                      <Badge className="bg-red-600/20 text-red-400 ring-1 ring-red-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">Banned</Badge>
                    ) : selectedUser.isActive ? (
                      <Badge className="bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-center flex items-center gap-1">
                         <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" /> Active
                      </Badge>
                    ) : (
                      <Badge className="bg-neutral-600/20 text-neutral-400 ring-1 ring-neutral-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">Inactive</Badge>
                    )}
                    {selectedUser.emailVerified ? (
                      <Badge className="bg-blue-600/20 text-blue-400 ring-1 ring-blue-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">Verified</Badge>
                    ) : (
                      <Badge className="bg-red-600/20 text-red-400 ring-1 ring-red-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">Unverified</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid Layout for details */}
              <div className="grid gap-4">
                 {[
                   { label: "Personal Intel", icon: UserIcon, items: [
                     { key: "Comm Link", val: selectedUser.email, icon: MailIcon },
                     { key: "Signal Line", val: selectedUser.phoneNumber, icon: PhoneIcon },
                     { key: "Access Role", val: selectedUser.role, icon: ShieldIcon },
                     { key: "Cipher Status", val: selectedUser.needPasswordChange ? "Reset Required" : "Secure", icon: ShieldIcon },
                   ]},
                   { label: "Financial Data", icon: CreditCardIcon, items: [
                     { key: "Subscription", val: selectedUser.subscription ? "Active Plan" : "No Plan", icon: CreditCardIcon }
                   ]},
                   { label: "Temporal Logs", icon: CalendarIcon, items: [
                     { key: "Citizen Since", val: new Date(selectedUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), icon: CalendarIcon },
                     { key: "Last Sync", val: new Date(selectedUser.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), icon: CalendarIcon }
                   ]}
                 ].map((section) => (
                   <div key={section.label} className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-white/10 hover:bg-white/[0.07]">
                     <h4 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 transition-colors group-hover:text-red-600">
                        <section.icon className="size-3" /> {section.label}
                     </h4>
                     <div className="grid gap-4">
                        {section.items.map((item) => (
                          item.val && (
                            <div key={item.key} className="flex items-start gap-3">
                              <div className="mt-0.5 rounded-lg bg-white/5 p-1.5 ring-1 ring-white/5 group-hover:bg-red-600/10 group-hover:ring-red-600/20">
                                <item.icon className="size-3.5 text-neutral-500 group-hover:text-red-600" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-tighter">{item.key}</p>
                                <p className="text-sm font-bold text-neutral-300 group-hover:text-white transition-colors">{item.val}</p>
                              </div>
                            </div>
                          )
                        ))}
                     </div>
                   </div>
                 ))}

                {/* Ban Intel */}
                {selectedUser.isBanned && (
                  <div className="group rounded-2xl border border-red-900/50 bg-red-600/10 p-4 transition-all hover:border-red-900/80">
                    <h4 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                       <BanIcon className="size-3" /> Punishment Profile
                    </h4>
                    <div className="grid gap-4">
                       <div className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-lg bg-red-600/20 p-1.5 ring-1 ring-red-600/30">
                             <BanIcon className="size-3.5 text-red-500" />
                          </div>
                          <div className="space-y-0.5">
                             <p className="text-[10px] font-bold text-red-900 uppercase tracking-tighter">Banned At</p>
                             <p className="text-sm font-bold text-red-400">{selectedUser.bannedAt ? new Date(selectedUser.bannedAt).toLocaleDateString() : "N/A"}</p>
                          </div>
                       </div>
                       {selectedUser.bannedReason && (
                         <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-lg bg-red-600/20 p-1.5 ring-1 ring-red-600/30">
                               <BanIcon className="size-3.5 text-red-500" />
                            </div>
                            <div className="space-y-0.5">
                               <p className="text-[10px] font-bold text-red-900 uppercase tracking-tighter">Violation Summary</p>
                               <p className="text-sm font-bold text-red-400">{selectedUser.bannedReason}</p>
                            </div>
                         </div>
                       )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="py-4 text-center text-muted-foreground uppercase text-xs font-bold tracking-widest">
              Unable to load user intel
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* User Reviews Dialog */}
      <Dialog open={isReviewsOpen} onOpenChange={setIsReviewsOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-white/5 bg-black/95 p-8 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">
               Review Logs
            </DialogTitle>
            <DialogDescription className="text-neutral-500 font-medium">
              Intelligence gathered from mission feedback.
            </DialogDescription>
          </DialogHeader>

          {isLoadingReviews ? (
            <div className="flex items-center justify-center py-12">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
                <BubblesIcon className="h-6 w-6 animate-pulse text-red-600" />
              </div>
            </div>
          ) : userReviews?.data?.reviews &&
            userReviews.data.reviews.length > 0 ? (
            <div className="space-y-6">
              {userReviews.data.reviews.map((review: IReview) => (
                <div
                  key={review.id}
                  className="rounded-3xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/[0.07] hover:border-white/10"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {review.mediaPoster && (
                        <Image
                          src={review.mediaPoster}
                          alt={review.mediaTitle || "Media"}
                          width={48}
                          height={72}
                          className="rounded-xl object-cover ring-1 ring-white/10"
                        />
                      )}
                      <div>
                        <p className="font-black italic text-white uppercase tracking-tight">
                          {review.mediaTitle || "Unknown Media"}
                        </p>
                        <p className="text-[10px] font-bold text-neutral-600 uppercase">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                          review.status === "APPROVED"
                            ? "bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/40"
                            : review.status === "REJECTED"
                              ? "bg-red-600/20 text-red-400 ring-1 ring-red-600/40"
                              : "bg-amber-600/20 text-amber-400 ring-1 ring-amber-600/40"
                        }`}
                      >
                        {review.status}
                      </Badge>
                      <div className="flex items-center gap-1.5 rounded-lg bg-black/40 px-2 py-1 ring-1 ring-white/5">
                        <StarIcon className="size-3 text-yellow-500" />
                        <span className="text-xs font-black text-white">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {review.title && (
                    <h4 className="mb-2 text-sm font-black italic text-white uppercase">
                      {review.title}
                    </h4>
                  )}

                  <p className="mb-4 text-xs font-medium text-neutral-400 leading-relaxed uppercase tracking-tighter">
                    {review.hasSpoiler && (
                      <span className="mr-2 inline-block rounded bg-red-600 text-[8px] font-black text-white px-1.5 py-0.5">
                        SPOILER ALERT
                      </span>
                    )}
                    {review.content}
                  </p>

                  <div className="flex items-center gap-6 text-[10px] font-black uppercase text-neutral-600">
                    <div className="flex items-center gap-2 group cursor-pointer hover:text-red-600 transition-colors">
                      <HeartIcon className="size-3.5" />
                      <span>{review.likesCount} Reaction</span>
                    </div>
                    <div className="flex items-center gap-2 group cursor-pointer hover:text-red-600 transition-colors">
                      <BubblesIcon className="size-3.5" />
                      <span>{review.commentsCount} Feedback</span>
                    </div>
                  </div>

                  {review.status === "REJECTED" && review.rejectedReason && (
                    <div className="mt-2 rounded bg-red-600/10 p-2 text-[10px] font-bold text-red-500 ring-1 ring-red-600/20">
                      <strong>REJECTION PROTOCOL:</strong>{" "}
                      {review.rejectedReason}
                    </div>
                  )}

                  {review.status === "APPROVED" && review.publishedAt && (
                    <p className="mt-2 text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                      UPLINKED:{" "}
                      {new Date(review.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}

              {/* Pagination Info */}
              {userReviews.data.meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[10px] font-black uppercase text-neutral-600">
                    Showing {userReviews.data.reviews.length} of{" "}
                    {userReviews.data.meta.total} reports
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-xs font-bold text-neutral-600 uppercase tracking-widest">
              No review records found
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;

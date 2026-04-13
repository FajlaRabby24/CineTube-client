"use client";

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
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 p-3 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor all users
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchInput)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: IUser) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-10 overflow-hidden rounded-full bg-muted">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.isBanned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : user.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <Badge
                        variant="outline"
                        className="border-green-500 text-green-500"
                      >
                        <UserCheckIcon className="mr-1 size-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-destructive">
                        <UserXIcon className="mr-1 size-3" />
                        Unverified
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="cursor-pointer"
                          size="icon"
                        >
                          <MoreHorizontalIcon className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 space-y-1"
                      >
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(user.id)}
                        >
                          <UserIcon className="mr-2 size-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleViewReviews(user.id)}
                        >
                          <BubblesIcon className="mr-2 size-4" />
                          View Reviews
                        </DropdownMenuItem>

                        {user.isBanned ? (
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleUnban(user.id)}
                          >
                            <UserCheckIcon className="mr-2 size-4" />
                            Unban User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive"
                            onClick={() => handleBan(user)}
                          >
                            <BanIcon className="mr-2 size-4" />
                            Ban User
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

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              users
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(meta.page - 1);
                    }}
                    className={
                      meta.page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
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
                    className={
                      meta.page >= meta.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about the user
            </DialogDescription>
          </DialogHeader>

          {isLoadingUser ? (
            <div className="flex items-center justify-center py-8">
              <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
          ) : selectedUser ? (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <div className="size-20 overflow-hidden rounded-full bg-muted">
                  {selectedUser.image ? (
                    <Image
                      src={selectedUser.image}
                      alt={selectedUser.name}
                      width={80}
                      height={80}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-2xl font-medium">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {selectedUser.isBanned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : selectedUser.isActive ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    {selectedUser.emailVerified ? (
                      <Badge
                        variant="outline"
                        className="border-green-500 text-green-500"
                      >
                        <UserCheckIcon className="mr-1 size-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-destructive">
                        <UserXIcon className="mr-1 size-3" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid gap-4 rounded-lg border p-4">
                <h4 className="font-semibold">Personal Information</h4>

                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <MailIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>

                  {selectedUser.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Phone Number
                        </p>
                        <p className="text-sm font-medium">
                          {selectedUser.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <ShieldIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm font-medium">{selectedUser.role}</p>
                    </div>
                  </div>

                  {selectedUser.bio && (
                    <div className="flex items-start gap-3">
                      <UserIcon className="mt-0.5 size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Bio</p>
                        <p className="text-sm font-medium">
                          {selectedUser.bio}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Details */}
              <div className="grid gap-4 rounded-lg border p-4">
                <h4 className="font-semibold">Account Details</h4>

                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Joined</p>
                      <p className="text-sm font-medium">
                        {new Date(selectedUser.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Last Updated
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(selectedUser.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {selectedUser.needPasswordChange && (
                    <div className="flex items-center gap-3">
                      <ShieldIcon className="size-4 text-yellow-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Password Status
                        </p>
                        <p className="text-sm font-medium text-yellow-500">
                          Password change required
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Subscription
                      </p>
                      <p className="text-sm font-medium">
                        {selectedUser.subscription ? "Active" : "None"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ban Information */}
              {selectedUser.isBanned && (
                <div className="grid gap-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                  <h4 className="font-semibold text-red-600 dark:text-red-400">
                    Ban Information
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3">
                      <BanIcon className="size-4 text-red-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Banned At
                        </p>
                        <p className="text-sm font-medium">
                          {selectedUser.bannedAt
                            ? new Date(
                                selectedUser.bannedAt,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    {selectedUser.bannedReason && (
                      <div className="flex items-start gap-3">
                        <BanIcon className="mt-0.5 size-4 text-red-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Reason
                          </p>
                          <p className="text-sm font-medium text-red-600 dark:text-red-400">
                            {selectedUser.bannedReason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="py-4 text-center text-muted-foreground">
              Unable to load user details
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* User Reviews Dialog */}
      <Dialog open={isReviewsOpen} onOpenChange={setIsReviewsOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Reviews</DialogTitle>
            <DialogDescription>Reviews written by this user</DialogDescription>
          </DialogHeader>

          {isLoadingReviews ? (
            <div className="flex items-center justify-center py-8">
              <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
          ) : userReviews?.data?.reviews &&
            userReviews.data.reviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.data.reviews.map((review: IReview) => (
                <div
                  key={review.id}
                  className="rounded-lg border p-4 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {review.mediaPoster && (
                        <Image
                          src={review.mediaPoster}
                          alt={review.mediaTitle || "Media"}
                          width={40}
                          height={60}
                          className="rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          {review.mediaTitle || "Unknown Media"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          review.status === "APPROVED"
                            ? "bg-green-500"
                            : review.status === "REJECTED"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }
                      >
                        {review.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <StarIcon className="size-3 text-yellow-500" />
                        {review.rating}/10
                      </Badge>
                    </div>
                  </div>

                  {review.title && (
                    <h4 className="mb-1 font-semibold">{review.title}</h4>
                  )}

                  <p className="mb-2 text-sm">
                    {review.hasSpoiler && (
                      <span className="mb-1 inline-block rounded bg-yellow-100 px-1 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Spoiler
                      </span>
                    )}
                    {review.content}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <HeartIcon className="size-4" />
                      <span>{review.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BubblesIcon className="size-4" />
                      <span>{review.commentsCount}</span>
                    </div>
                  </div>

                  {review.status === "REJECTED" && review.rejectedReason && (
                    <div className="mt-2 rounded bg-red-50 p-2 text-xs text-red-600 dark:bg-red-950 dark:text-red-400">
                      <strong>Rejected:</strong> {review.rejectedReason}
                    </div>
                  )}

                  {review.status === "APPROVED" && review.publishedAt && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Published:{" "}
                      {new Date(review.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}

              {/* Pagination Info */}
              {userReviews.data.meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {userReviews.data.reviews.length} of{" "}
                    {userReviews.data.meta.total} reviews
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No reviews found for this user
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;

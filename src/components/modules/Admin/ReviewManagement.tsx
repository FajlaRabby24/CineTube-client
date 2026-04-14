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
  DropdownMenuSeparator,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getAdminReviews,
  IAdminReview,
} from "@/services/Admin/getAdminReviews.service";
import {
  approveReview,
  deleteAdminReview,
  rejectReview,
} from "@/services/Admin/reviewActions.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  EyeIcon,
  MoreHorizontalIcon,
  SearchIcon,
  StarIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";

import Image from "next/image";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface ReviewManagementProps {
  initialQueryString: string;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const statusBadge = (status: "PENDING" | "APPROVED" | "REJECTED") => {
  if (status === "APPROVED")
    return (
      <Badge className="bg-green-500 text-white">
        <CheckCircle2Icon className="mr-1 size-3" />
        Approved
      </Badge>
    );
  if (status === "REJECTED")
    return (
      <Badge variant="destructive">
        <XCircleIcon className="mr-1 size-3" />
        Rejected
      </Badge>
    );
  return (
    <Badge className="bg-yellow-500 text-white">
      <ClockIcon className="mr-1 size-3" />
      Pending
    </Badge>
  );
};

const ReviewManagement = ({ initialQueryString }: ReviewManagementProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("searchTerm") || "";
  const statusFilter = searchParams.get("status") || "ALL";

  const [searchInput, setSearchInput] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedReview, setSelectedReview] = useState<IAdminReview | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const buildQueryParams = () => {
    const params = new URLSearchParams(initialQueryString);
    if (debouncedSearch) params.set("searchTerm", debouncedSearch);
    if (statusFilter && statusFilter !== "ALL")
      params.set("status", statusFilter);
    params.set("page", String(page));
    return params;
  };

  const queryParams = buildQueryParams();

  const {
    data: reviewsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-reviews", page, debouncedSearch, statusFilter],
    queryFn: () => getAdminReviews(queryParams.toString()),
  });

  const handlePageChange = (newPage: number) => {
    const params = buildQueryParams();
    params.set("page", String(newPage));
    router.push(`/admin/dashboard/review-management?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    const params = buildQueryParams();
    params.set("page", "1");
    if (value) params.set("searchTerm", value);
    else params.delete("searchTerm");
    router.push(`/admin/dashboard/review-management?${params.toString()}`);
  };

  const handleStatusFilter = (value: string) => {
    const params = buildQueryParams();
    params.set("page", "1");
    if (value && value !== "ALL") params.set("status", value);
    else params.delete("status");
    router.push(`/admin/dashboard/review-management?${params.toString()}`);
  };

  const approveMutation = useMutation({
    mutationFn: (reviewId: string) => approveReview(reviewId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Review approved successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Failed to approve review"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: string; reason: string }) =>
      rejectReview(reviewId, reason),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Review rejected");
        queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Failed to reject review"),
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => deleteAdminReview(reviewId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Review deleted");
        queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const handleApprove = (review: IAdminReview) => {
    Swal.fire({
      title: "Approve Review?",
      text: `Approve this review by ${review.user.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
      confirmButtonColor: "#22c55e",
    }).then((result) => {
      if (result.isConfirmed) {
        approveMutation.mutate(review.id);
      }
    });
  };

  const handleReject = (review: IAdminReview) => {
    Swal.fire({
      title: "Reject Review",
      input: "textarea",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Enter the reason for rejecting this review...",
      inputAttributes: { "aria-label": "Rejection reason" },
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#dc2626",
      inputValidator: (value) => {
        if (!value || !value.trim()) return "Please provide a rejection reason";
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        rejectMutation.mutate({ reviewId: review.id, reason: result.value });
      }
    });
  };

  const handleDelete = (review: IAdminReview) => {
    Swal.fire({
      title: "Delete Review?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(review.id);
      }
    });
  };

  const handleViewDetails = (review: IAdminReview) => {
    setSelectedReview(review);
    setIsDetailsOpen(true);
  };

  const reviews = reviewsData?.data ?? [];
  const meta = reviewsData?.meta ?? {
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
            <h1 className="text-2xl font-bold">Review Management</h1>
            <p className="text-sm text-muted-foreground">
              Moderate and manage all user reviews
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(searchInput)
                }
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User / Media</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review: IAdminReview) => (
                  <TableRow key={review.id}>
                    {/* User + Media */}
                    <TableCell className="min-w-[180px]">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="size-7 overflow-hidden rounded-full bg-muted text-xs font-semibold flex items-center justify-center shrink-0">
                            {review.user.image ? (
                              <Image
                                src={review.user.image}
                                alt={review.user.name}
                                width={28}
                                height={28}
                                className="size-full object-cover"
                              />
                            ) : (
                              review.user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {review.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {review.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {review.media.posterUrl && (
                            <Image
                              src={review.media.posterUrl}
                              alt={review.media.title}
                              width={24}
                              height={36}
                              className="rounded object-cover shrink-0"
                            />
                          )}
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {review.media.title}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Review Content */}
                    <TableCell className="max-w-[260px]">
                      {review.title && (
                        <p className="font-medium text-sm mb-1 line-clamp-1">
                          {review.title}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {review.content}
                      </p>
                      {review.hasSpoiler && (
                        <Badge
                          variant="outline"
                          className="mt-1 text-[10px] border-yellow-500 text-yellow-600"
                        >
                          <AlertTriangleIcon className="mr-1 size-3" />
                          Spoiler
                        </Badge>
                      )}
                    </TableCell>

                    {/* Rating */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <StarIcon className="size-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-sm">
                          {review.rating}
                          <span className="text-muted-foreground">/10</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <ThumbsUpIcon className="size-3" />
                          {review._count.likes}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <ThumbsDownIcon className="size-3" />
                          {review._count.comments}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>{statusBadge(review.status)}</TableCell>

                    {/* Date */}
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                          >
                            <MoreHorizontalIcon className="size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-44 space-y-1"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleViewDetails(review)}
                          >
                            <EyeIcon className="mr-2 size-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {review.status !== "APPROVED" && (
                            <DropdownMenuItem
                              className="cursor-pointer text-green-600 focus:text-green-600"
                              onClick={() => handleApprove(review)}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle2Icon className="mr-2 size-4" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          {review.status !== "REJECTED" && (
                            <DropdownMenuItem
                              className="cursor-pointer text-orange-600 focus:text-orange-600"
                              onClick={() => handleReject(review)}
                              disabled={rejectMutation.isPending}
                            >
                              <XCircleIcon className="mr-2 size-4" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => handleDelete(review)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2Icon className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              reviews
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (meta.page > 1) handlePageChange(meta.page - 1);
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
                      if (meta.page < meta.totalPages)
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

      {/* Review Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>Full details for this review</DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-5">
              {/* Reviewer + Media */}
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="size-12 overflow-hidden rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                    {selectedReview.user.image ? (
                      <Image
                        src={selectedReview.user.image}
                        alt={selectedReview.user.name}
                        width={48}
                        height={48}
                        className="size-full object-cover"
                      />
                    ) : (
                      selectedReview.user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{selectedReview.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.user.email}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {statusBadge(selectedReview.status)}
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <StarIcon className="size-3 text-yellow-400 fill-yellow-400" />
                      {selectedReview.rating}/10
                    </Badge>
                    {selectedReview.hasSpoiler && (
                      <Badge
                        variant="outline"
                        className="border-yellow-500 text-yellow-600"
                      >
                        <AlertTriangleIcon className="mr-1 size-3" />
                        Spoiler
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="flex items-center gap-3 rounded-lg border p-3">
                {selectedReview.media.posterUrl && (
                  <Image
                    src={selectedReview.media.posterUrl}
                    alt={selectedReview.media.title}
                    width={40}
                    height={60}
                    className="rounded object-cover shrink-0"
                  />
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Media</p>
                  <p className="font-medium">{selectedReview.media.title}</p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 rounded-lg border p-4">
                {selectedReview.title && (
                  <h3 className="font-semibold">{selectedReview.title}</h3>
                )}
                <p className="text-sm leading-relaxed">
                  {selectedReview.content}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Likes</p>
                  <p className="text-xl font-bold">
                    {selectedReview._count.likes}
                  </p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Comments</p>
                  <p className="text-xl font-bold">
                    {selectedReview._count.comments}
                  </p>
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedReview.status === "REJECTED" &&
                selectedReview.rejectedReason && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                      Rejection Reason
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {selectedReview.rejectedReason}
                    </p>
                  </div>
                )}

              {/* Dates */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  Submitted:{" "}
                  {new Date(selectedReview.createdAt).toLocaleString()}
                </p>
                {selectedReview.publishedAt && (
                  <p>
                    Published:{" "}
                    {new Date(selectedReview.publishedAt).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {selectedReview.status !== "APPROVED" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleApprove(selectedReview);
                    }}
                  >
                    <CheckCircle2Icon className="mr-2 size-4" />
                    Approve
                  </Button>
                )}
                {selectedReview.status !== "REJECTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleReject(selectedReview);
                    }}
                  >
                    <XCircleIcon className="mr-2 size-4" />
                    Reject
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  className="ml-auto"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleDelete(selectedReview);
                  }}
                >
                  <Trash2Icon className="mr-2 size-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewManagement;

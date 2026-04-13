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
  getAllAdmins,
  getAdminById,
  IGetAdminByIdResponse,
  IGetAdminsApiResponse,
  IAdmin,
} from "@/services/Admin/getAdmins.service";

import { useQuery } from "@tanstack/react-query";

import {
  CalendarIcon,
  CreditCardIcon,
  MailIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  SearchIcon,
  ShieldIcon,
  UserCheckIcon,
  UserIcon,
  UserXIcon,
} from "lucide-react";

import Image from "next/image";

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
    data: adminsData,
    isLoading,
  } = useQuery<IGetAdminsApiResponse | null>({
    queryKey: ["admin-admins", page, debouncedSearch],
    queryFn: () => getAllAdmins(queryParams.toString()),
  });

  const { data: selectedAdmin, isLoading: isLoadingAdmin } =
    useQuery<IGetAdminByIdResponse | null>({
      queryKey: ["admin-admin", selectedAdminId],
      queryFn: () => getAdminById(selectedAdminId!),
      enabled: !!selectedAdminId && isDetailsOpen,
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

  const admins = adminsData?.data?.data || [];

  const meta = adminsData?.data?.meta || {
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
            <h1 className="text-2xl font-bold">Admin Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor all admins
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search admins..."
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
              <TableHead>Admin</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin: IAdmin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-10 overflow-hidden rounded-full bg-muted">
                        {admin.image ? (
                          <Image
                            src={admin.image}
                            alt={admin.name}
                            width={40}
                            height={40}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-sm font-medium">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        admin.role === "SUPER_ADMIN"
                          ? "bg-purple-500"
                          : "bg-blue-500"
                      }
                    >
                      {admin.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {admin.isBanned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : admin.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    {admin.bannedReason && (
                      <p className="mt-1 text-xs text-red-500">
                        {admin.bannedReason}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {admin.emailVerified ? (
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
                    {new Date(admin.createdAt).toLocaleDateString()}
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
                          onClick={() => handleViewDetails(admin.id)}
                        >
                          <UserIcon className="mr-2 size-4" />
                          View Details
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} admins
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

      {/* Admin Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Admin Details</DialogTitle>
            <DialogDescription>
              Complete information about the admin
            </DialogDescription>
          </DialogHeader>

          {isLoadingAdmin ? (
            <div className="flex items-center justify-center py-8">
              <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
          ) : selectedAdmin?.data ? (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <div className="size-20 overflow-hidden rounded-full bg-muted">
                  {selectedAdmin.data.image ? (
                    <Image
                      src={selectedAdmin.data.image}
                      alt={selectedAdmin.data.name}
                      width={80}
                      height={80}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-2xl font-medium">
                      {selectedAdmin.data.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedAdmin.data.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedAdmin.data.email}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {selectedAdmin.data.isBanned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : selectedAdmin.data.isActive ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    <Badge
                      className={
                        selectedAdmin.data.role === "SUPER_ADMIN"
                          ? "bg-purple-500"
                          : "bg-blue-500"
                      }
                    >
                      {selectedAdmin.data.role.replace("_", " ")}
                    </Badge>
                    {selectedAdmin.data.emailVerified ? (
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
                        {selectedAdmin.data.email}
                      </p>
                    </div>
                  </div>

                  {selectedAdmin.data.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Phone Number
                        </p>
                        <p className="text-sm font-medium">
                          {selectedAdmin.data.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <ShieldIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm font-medium">
                        {selectedAdmin.data.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  {selectedAdmin.data.bio && (
                    <div className="flex items-start gap-3">
                      <UserIcon className="mt-0.5 size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Bio</p>
                        <p className="text-sm font-medium">
                          {selectedAdmin.data.bio}
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
                        {new Date(
                          selectedAdmin.data.createdAt,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
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
                        {new Date(
                          selectedAdmin.data.updatedAt,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {selectedAdmin.data.needPasswordChange && (
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
                </div>
              </div>
            </div>
          ) : (
            <p className="py-4 text-center text-muted-foreground">
              Unable to load admin details
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminManagement;
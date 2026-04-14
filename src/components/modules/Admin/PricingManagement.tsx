"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import { SubscriptionPlan } from "@/lib/enum";
import {
  createPricingPlan,
  getAllPricingPlans,
  IPricingPlan,
  updatePricingPlan,
} from "@/services/Admin/pricing.service";

const PricingManagement = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<IPricingPlan | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    plan: "MONTHLY",
    price: "",
    features: "",
    isActive: true,
    isPopular: false,
    stripePriceId: "",
  });

  const { data: pricingPlansData, isLoading } = useQuery<IPricingPlan[]>({
    queryKey: ["admin-pricing-plans"],
    queryFn: () => getAllPricingPlans() as Promise<any>,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => createPricingPlan(data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        setIsCreateOpen(false);
        queryClient.invalidateQueries({ queryKey: ["admin-pricing-plans"] });
      } else {
        toast.error(res.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updatePricingPlan(id, data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        setIsEditOpen(false);
        queryClient.invalidateQueries({ queryKey: ["admin-pricing-plans"] });
      } else {
        toast.error(res.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const plans = pricingPlansData || [];

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      plan: "MONTHLY",
      price: "",
      features: "",
      isActive: true,
      isPopular: false,
      stripePriceId: "",
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (plan: IPricingPlan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      plan: plan.plan,
      price: plan.price.toString(),
      features: plan.features.join("\\n"),
      isActive: plan.isActive,
      isPopular: plan.isPopular,
      stripePriceId: plan.stripePriceId || "",
    });
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: formData.name,
      plan: formData.plan as keyof typeof SubscriptionPlan,
      price: Number(formData.price),
      features: formData.features.split("\\n").filter((f) => f.trim() !== ""),
      isActive: formData.isActive,
      isPopular: formData.isPopular,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    updateMutation.mutate({
      id: selectedPlan.id,
      data: {
        name: formData.name,
        price: Number(formData.price),
        features: formData.features.split("\\n").filter((f) => f.trim() !== ""),
        isActive: formData.isActive,
        isPopular: formData.isPopular,
        stripePriceId: formData.stripePriceId || null,
      },
    });
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pricing Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage subscription pricing plans
            </p>
          </div>
          <Button onClick={handleOpenCreate}>
            <PlusIcon className="mr-2 size-4" />
            Add New Plan
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Popular</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No pricing plans found
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan: IPricingPlan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{plan.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    ${plan.price} / {plan.plan === "MONTHLY" ? "mo" : "yr"}
                  </TableCell>
                  <TableCell>
                    {plan.isActive ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {plan.isPopular && <Badge variant="default" className="bg-blue-500">Popular</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(plan)}>
                      <EditIcon className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Pricing Plan</DialogTitle>
            <DialogDescription>Add a new subscription plan.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Plan Name</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-plan">Plan Type</Label>
              <Select
                value={formData.plan}
                onValueChange={(val) => setFormData({ ...formData, plan: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select plan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-price">Price (USD)</Label>
              <Input
                id="create-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-features">Features (one per line)</Label>
              <textarea
                id="create-features"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="create-isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked as boolean })}
              />
              <Label htmlFor="create-isPopular" className="text-sm font-medium leading-none">
                Mark as Popular
              </Label>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="create-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              />
              <Label htmlFor="create-isActive" className="text-sm font-medium leading-none">
                Active
              </Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pricing Plan</DialogTitle>
            <DialogDescription>Update the details of the subscription plan.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Plan Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (USD)</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-features">Features (one per line)</Label>
              <textarea
                id="edit-features"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stripe-price">Stripe Price ID</Label>
              <Input
                id="edit-stripe-price"
                value={formData.stripePriceId}
                onChange={(e) => setFormData({ ...formData, stripePriceId: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="edit-isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked as boolean })}
              />
              <Label htmlFor="edit-isPopular" className="text-sm font-medium leading-none">
                Mark as Popular
              </Label>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              />
              <Label htmlFor="edit-isActive" className="text-sm font-medium leading-none">
                Active
              </Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PricingManagement;

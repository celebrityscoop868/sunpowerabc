import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  ChevronRight,
  User,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

import { ADMIN_ENABLED } from "../../config/admin.js";
import { api } from "../../api/Client.js";

import LoadingSpinner from "../common/LoadingSpinner.jsx";

import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog.jsx";

import { cn } from "../../lib/utils.js";

const stateConfig = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "Pending" },
  active: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", label: "Active" },
  inactive: { icon: XCircle, color: "text-slate-400", bg: "bg-slate-100", label: "Inactive" },
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const queryClient = useQueryClient();
  const canRun = ADMIN_ENABLED && api?.User;

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin_users"],
    enabled: canRun,
    queryFn: () => api.User.list("-created_date"),
    initialData: [],
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }) => api.User.update(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      setSelectedUser(null);
    },
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = (user.display_name || user.full_name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const q = search.toLowerCase();

      const matchesSearch = name.includes(q) || email.includes(q);
      const matchesState = filterState === "all" || user.state === filterState;
      return matchesSearch && matchesState;
    });
  }, [users, search, filterState]);

  const handleUpdateState = (newState) => {
    if (!selectedUser || !canRun) return;
    updateUserMutation.mutate({ userId: selectedUser.id, data: { state: newState } });
  };

  const handleApproveOnboarding = () => {
    if (!selectedUser || !canRun) return;
    updateUserMutation.mutate({
      userId: selectedUser.id,
      data: { onboarding_status: "approved", state: "active" },
    });
  };

  if (!ADMIN_ENABLED) {
    return (
      <div className="rounded-2xl border bg-white p-5 text-slate-700">
        <div className="text-lg font-bold">Admin Users</div>
        <div className="mt-1 text-sm text-slate-500">
          Admin is currently <b>DISABLED</b>. Enable it in <code>src/config/admin.js</code>.
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl pl-10"
          />
        </div>

        <Select value={filterState} onValueChange={setFilterState}>
          <SelectTrigger className="w-full rounded-xl sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No users found</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredUsers.map((user, index) => {
              const state = stateConfig[user.state || "pending"];
              const StateIcon = state.icon;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => setSelectedUser(user)}
                  className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    {user.profile_image_url ? (
                      <img src={user.profile_image_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <User size={20} className="text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate font-medium text-slate-800">
                        {user.display_name || user.full_name || "Unnamed"}
                      </h4>
                      {user.role === "admin" && <Shield size={14} className="text-orange-500" />}
                    </div>
                    <p className="truncate text-sm text-slate-500">{user.email}</p>
                  </div>

                  <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", state.bg, state.color)}>
                    <StateIcon size={12} />
                    {state.label}
                  </div>

                  <ChevronRight size={18} className="text-slate-300" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  {selectedUser.profile_image_url ? (
                    <img src={selectedUser.profile_image_url} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                  ) : (
                    <User size={32} className="text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.display_name || selectedUser.full_name}</h3>
                  <p className="text-sm text-slate-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-500">State</Label>
                  <p className="font-medium capitalize">{selectedUser.state || "pending"}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Onboarding</Label>
                  <p className="font-medium capitalize">{selectedUser.onboarding_status || "not_started"}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Department</Label>
                  <p className="font-medium">{selectedUser.department || "-"}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Location</Label>
                  <p className="font-medium">{selectedUser.location_name || "-"}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <Label className="mb-2 block text-sm font-medium">Change State</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateState("pending")}
                    className={cn("flex-1 rounded-lg", selectedUser.state === "pending" && "border-amber-300 bg-amber-50")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateState("active")}
                    className={cn("flex-1 rounded-lg", selectedUser.state === "active" && "border-emerald-300 bg-emerald-50")}
                  >
                    Active
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateState("inactive")}
                    className={cn("flex-1 rounded-lg", selectedUser.state === "inactive" && "border-slate-300 bg-slate-50")}
                  >
                    Inactive
                  </Button>
                </div>
              </div>

              {selectedUser.onboarding_status === "submitted" && (
                <Button
                  onClick={handleApproveOnboarding}
                  disabled={updateUserMutation.isPending}
                  className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600"
                >
                  <CheckCircle className="mr-2" size={16} />
                  Approve Apply & Activate
                </Button>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)} className="rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

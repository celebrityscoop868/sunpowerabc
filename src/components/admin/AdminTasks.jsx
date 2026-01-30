import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit,
  Trash2,
  User,
  Search,
  ChevronDown,
  AlertCircle,
  Check,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";

import { ADMIN_ENABLED } from "../../config/admin.js";
import { api } from "../../api/Client.js";

import LoadingSpinner from "../common/LoadingSpinner.jsx";

import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Textarea } from "../ui/textarea.jsx";
import { Label } from "../ui/label.jsx";
import { Switch } from "../ui/switch.jsx";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible.jsx";

import { cn } from "../../lib/utils.js";

const statusConfig = {
  locked: { icon: Lock, color: "text-slate-400", bg: "bg-slate-100" },
  available: { icon: ChevronDown, color: "text-orange-500", bg: "bg-orange-50" },
  completed: { icon: Check, color: "text-emerald-500", bg: "bg-emerald-50" },
  needs_fix: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
};

export default function AdminTasks() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [formData, setFormData] = useState({
    user_id: "",
    task_id: "",
    title: "",
    description: "",
    status: "available",
    note: "",
    order: 1,
    required: true,
  });

  const queryClient = useQueryClient();
  const canRun = ADMIN_ENABLED && api?.User && api?.OnboardingTask;

  const { data: users = [] } = useQuery({
    queryKey: ["admin_users"],
    enabled: canRun,
    queryFn: () => api.User.list("-created_date"),
    initialData: [],
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["admin_tasks"],
    enabled: canRun,
    queryFn: () => api.OnboardingTask.list("user_id,order"),
    initialData: [],
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({
      user_id: selectedUserId || "",
      task_id: "",
      title: "",
      description: "",
      status: "available",
      note: "",
      order: 1,
      required: true,
    });
  };

  const createMutation = useMutation({
    mutationFn: (data) => api.OnboardingTask.create({ ...data, updated_by: "admin" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_tasks"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.OnboardingTask.update(id, { ...data, updated_by: "admin" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_tasks"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.OnboardingTask.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_tasks"] });
    },
  });

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      user_id: task.user_id,
      task_id: task.task_id,
      title: task.title,
      description: task.description || "",
      status: task.status,
      note: task.note || "",
      order: task.order || 1,
      required: task.required !== false,
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.user_id || !canRun) return;

    const payload = {
      ...formData,
      order: Number.isFinite(Number(formData.order)) ? Number(formData.order) : 1,
    };

    if (editingTask) updateMutation.mutate({ id: editingTask.id, data: payload });
    else createMutation.mutate(payload);
  };

  const handleAddForUser = (userId) => {
    setSelectedUserId(userId);
    setFormData((p) => ({ ...p, user_id: userId }));
    setShowForm(true);
  };

  const toggleUser = (userId) => {
    setExpandedUsers((p) => ({ ...p, [userId]: !p[userId] }));
  };

  const tasksByUser = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.user_id]) acc[task.user_id] = [];
      acc[task.user_id].push(task);
      return acc;
    }, {});
  }, [tasks]);

  const pendingUsers = users.filter((u) => u.state === "pending");
  const filteredUsers = pendingUsers.filter((u) => {
    const name = (u.display_name || u.full_name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  if (!ADMIN_ENABLED) {
    return (
      <div className="rounded-2xl border bg-white p-5 text-slate-700">
        <div className="text-lg font-bold">Admin Tasks</div>
        <div className="mt-1 text-sm text-slate-500">
          Admin is currently <b>DISABLED</b>. Enable it in <code>src/config/admin.js</code>.
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            placeholder="Search pending users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl pl-10"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          <p className="text-slate-500">No pending users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user, index) => {
            const userTasks = tasksByUser[user.id] || [];
            const isExpanded = !!expandedUsers[user.id];
            const completedCount = userTasks.filter((t) => t.status === "completed").length;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="overflow-hidden rounded-xl border border-slate-100 bg-white"
              >
                <Collapsible open={isExpanded} onOpenChange={() => toggleUser(user.id)}>
                  <CollapsibleTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-slate-50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                        <User size={18} className="text-slate-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-medium text-slate-800">
                          {user.display_name || user.full_name || "Unnamed"}
                        </h4>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">
                          {completedCount}/{userTasks.length} tasks
                        </span>
                        <ChevronDown
                          size={18}
                          className={cn("text-slate-400 transition-transform", isExpanded && "rotate-180")}
                        />
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="space-y-2 border-t border-slate-100 p-4">
                      {userTasks.length === 0 ? (
                        <p className="py-4 text-center text-sm text-slate-400">No tasks assigned</p>
                      ) : (
                        userTasks
                          .slice()
                          .sort((a, b) => (a.order || 0) - (b.order || 0))
                          .map((task) => {
                            const config = statusConfig[task.status] || statusConfig.locked;
                            const Icon = config.icon;

                            return (
                              <div key={task.id} className={cn("flex items-center gap-3 rounded-lg p-3", config.bg)}>
                                <Icon size={16} className={config.color} />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-slate-700">{task.title}</p>
                                  {task.note && (
                                    <p className="mt-0.5 text-xs text-slate-500">Note: {task.note}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => handleEdit(task)} className="h-7 w-7">
                                    <Edit size={14} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteMutation.mutate(task.id)}
                                    className="h-7 w-7 text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddForUser(user.id)}
                        className="mt-2 w-full rounded-lg"
                      >
                        <Plus size={14} className="mr-1" />
                        Add Task
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={resetForm}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>User</Label>
              <Select value={formData.user_id} onValueChange={(v) => setFormData((p) => ({ ...p, user_id: v }))}>
                <SelectTrigger className="mt-1 rounded-xl">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {pendingUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.display_name || u.full_name || u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Task ID</Label>
                <Input
                  value={formData.task_id}
                  onChange={(e) => setFormData((p) => ({ ...p, task_id: e.target.value }))}
                  placeholder="e.g. personal_info"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label>Order</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData((p) => ({ ...p, order: Number(e.target.value) }))}
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Task title"
                className="mt-1 rounded-xl"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Task description..."
                className="mt-1 rounded-xl"
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData((p) => ({ ...p, status: v }))}>
                <SelectTrigger className="mt-1 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="locked">Locked</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="needs_fix">Needs Fix</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Admin Note</Label>
              <Textarea
                value={formData.note}
                onChange={(e) => setFormData((p) => ({ ...p, note: e.target.value }))}
                placeholder="Note visible to user..."
                className="mt-1 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Required for submission</Label>
              <Switch
                checked={formData.required}
                onCheckedChange={(checked) => setFormData((p) => ({ ...p, required: checked }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending || !formData.title || !formData.user_id}
              className="rounded-xl bg-orange-500 hover:bg-orange-600"
            >
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

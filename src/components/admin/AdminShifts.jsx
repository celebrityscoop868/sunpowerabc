import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";

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

export default function AdminShifts() {
  const [showForm, setShowForm] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    start_time: "09:00",
    end_time: "17:00",
    location_name: "",
    capacity: 10,
    status: "open",
  });

  const queryClient = useQueryClient();
  const canRun = ADMIN_ENABLED && api?.Shift;

  const { data: shifts = [], isLoading } = useQuery({
    queryKey: ["admin_shifts"],
    enabled: canRun,
    queryFn: () => api.Shift.list("-date"),
    initialData: [],
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingShift(null);
    setFormData({
      date: "",
      start_time: "09:00",
      end_time: "17:00",
      location_name: "",
      capacity: 10,
      status: "open",
    });
  };

  const createMutation = useMutation({
    mutationFn: (data) => api.Shift.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_shifts"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.Shift.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_shifts"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.Shift.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_shifts"] });
    },
  });

  const handleEdit = (shift) => {
    setEditingShift(shift);
    setFormData({
      date: shift.date,
      start_time: shift.start_time,
      end_time: shift.end_time,
      location_name: shift.location_name || "",
      capacity: typeof shift.capacity === "number" ? shift.capacity : 10,
      status: shift.status || "open",
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.date || !formData.location_name || !canRun) return;

    const payload = {
      ...formData,
      capacity: Number.isFinite(formData.capacity) ? formData.capacity : 10,
    };

    if (editingShift) updateMutation.mutate({ id: editingShift.id, data: payload });
    else createMutation.mutate(payload);
  };

  if (!ADMIN_ENABLED) {
    return (
      <div className="rounded-2xl border bg-white p-5 text-slate-700">
        <div className="text-lg font-bold">Admin Shifts</div>
        <div className="mt-1 text-sm text-slate-500">
          Admin is currently <b>DISABLED</b>. Enable it in <code>src/config/admin.js</code>.
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{shifts.length} Shifts</h3>
        <Button onClick={() => setShowForm(true)} className="rounded-xl bg-orange-500 hover:bg-orange-600">
          <Plus size={18} className="mr-2" />
          New Shift
        </Button>
      </div>

      <div className="space-y-3">
        {shifts.map((shift, index) => (
          <motion.div
            key={shift.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={cn(
              "rounded-xl border bg-white p-4",
              shift.status === "filled"
                ? "border-emerald-200 bg-emerald-50/30"
                : "border-slate-100"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-slate-100">
                <span className="text-xs text-slate-500">{format(parseISO(shift.date), "EEE")}</span>
                <span className="font-bold text-slate-800">{format(parseISO(shift.date), "d")}</span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    {shift.start_time} - {shift.end_time}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" />
                  <span className="text-sm text-slate-500">{shift.location_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    shift.status === "filled"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-700"
                  )}
                >
                  {shift.status === "filled" ? "Filled" : "Open"}
                </span>
                <span className="text-xs text-slate-500">{shift.capacity ?? 10} spots</span>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(shift)} className="h-8 w-8">
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(shift.id)}
                  className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={resetForm}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingShift ? "Edit Shift" : "New Shift"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                className="mt-1 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData((p) => ({ ...p, start_time: e.target.value }))}
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData((p) => ({ ...p, end_time: e.target.value }))}
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label>Location</Label>
              <Input
                value={formData.location_name}
                onChange={(e) => setFormData((p) => ({ ...p, location_name: e.target.value }))}
                placeholder="Warehouse A"
                className="mt-1 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setFormData((p) => ({ ...p, capacity: Number.isFinite(n) ? n : 10 }));
                  }}
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
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="filled">Filled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending || !formData.date || !formData.location_name}
              className="rounded-xl bg-orange-500 hover:bg-orange-600"
            >
              {editingShift ? "Save Changes" : "Create Shift"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

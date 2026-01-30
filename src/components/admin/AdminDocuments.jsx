import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import { ADMIN_ENABLED } from "../../config/admin.js";

// OJO: ajusta esta ruta si tu Client vive en otro lado
import { api } from "../../api/Client.js";

import LoadingSpinner from "../common/LoadingSpinner.jsx";

// Si tu repo actual NO tiene shadcn/ui, esto va a fallar.
// Solo pega esto si ya tienes esos componentes. Si no, me dices y te lo adapto a puro HTML/Tailwind.
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

// cn (si no existe en tu repo actual, te digo abajo cómo crearlo)
import { cn } from "../../lib/utils.js";

const docTypes = [
  { value: "policy", label: "Policy" },
  { value: "manual", label: "Manual" },
  { value: "security", label: "Security" },
  { value: "onboarding", label: "Onboarding" },
];

const confirmTypes = [
  { value: "acknowledgment", label: "Acknowledgment" },
  { value: "agreement", label: "Agreement" },
];

export default function AdminDocuments() {
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    document_type: "policy",
    document_version: "1.0",
    content: "",
    file_url: "",
    required_for_progress: false,
    confirmation_type: "acknowledgment",
  });

  const queryClient = useQueryClient();

  const canRun = ADMIN_ENABLED && api?.Document;

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["admin_documents"],
    enabled: canRun,
    queryFn: () => api.Document.list("-created_date"),
    initialData: [],
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingDoc(null);
    setFormData({
      title: "",
      document_type: "policy",
      document_version: "1.0",
      content: "",
      file_url: "",
      required_for_progress: false,
      confirmation_type: "acknowledgment",
    });
  };

  const createMutation = useMutation({
    mutationFn: (data) =>
      api.Document.create({ ...data, published_at: new Date().toISOString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_documents"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.Document.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_documents"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.Document.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_documents"] });
    },
  });

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      document_type: doc.document_type,
      document_version: doc.document_version,
      content: doc.content || "",
      file_url: doc.file_url || "",
      required_for_progress: !!doc.required_for_progress,
      confirmation_type: doc.confirmation_type || "acknowledgment",
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !canRun) return;
    if (editingDoc) updateMutation.mutate({ id: editingDoc.id, data: formData });
    else createMutation.mutate(formData);
  };

  if (!ADMIN_ENABLED) {
    return (
      <div className="rounded-2xl border bg-white p-5 text-slate-700">
        <div className="text-lg font-bold">Admin Documents</div>
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
        <h3 className="font-semibold text-slate-800">{documents.length} Documents</h3>
        <Button
          onClick={() => setShowForm(true)}
          className="rounded-xl bg-orange-500 hover:bg-orange-600"
        >
          <Plus size={18} className="mr-2" />
          New Document
        </Button>
      </div>

      <div className="space-y-3">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={cn(
              "rounded-xl border bg-white p-4",
              doc.required_for_progress ? "border-amber-200" : "border-slate-100"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-500">
                    {doc.document_type}
                  </span>
                  <span className="text-xs text-slate-400">v{doc.document_version}</span>
                  {doc.required_for_progress && (
                    <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                      Required
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-slate-800">{doc.title}</h4>
                {doc.content && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{doc.content}</p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(doc)} className="h-8 w-8">
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(doc.id)}
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
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingDoc ? "Edit Document" : "New Document"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Document title"
                className="mt-1 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={formData.document_type}
                  onValueChange={(v) => setFormData((p) => ({ ...p, document_type: v }))}
                >
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {docTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Version</Label>
                <Input
                  value={formData.document_version}
                  onChange={(e) => setFormData((p) => ({ ...p, document_version: e.target.value }))}
                  placeholder="1.0"
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label>Content / Summary</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                placeholder="Document content or summary..."
                className="mt-1 min-h-[100px] rounded-xl"
              />
            </div>

            <div>
              <Label>File URL (optional)</Label>
              <Input
                value={formData.file_url}
                onChange={(e) => setFormData((p) => ({ ...p, file_url: e.target.value }))}
                placeholder="https://..."
                className="mt-1 rounded-xl"
              />
            </div>

            <div>
              <Label>Confirmation Type</Label>
              <Select
                value={formData.confirmation_type}
                onValueChange={(v) => setFormData((p) => ({ ...p, confirmation_type: v }))}
              >
                <SelectTrigger className="mt-1 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {confirmTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Required for progress</Label>
                <p className="text-xs text-slate-500">Blocks onboarding if not accepted</p>
              </div>
              <Switch
                checked={formData.required_for_progress}
                onCheckedChange={(checked) =>
                  setFormData((p) => ({ ...p, required_for_progress: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetForm} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending || !formData.title}
              className="rounded-xl bg-orange-500 hover:bg-orange-600"
            >
              {editingDoc ? "Save Changes" : "Create Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

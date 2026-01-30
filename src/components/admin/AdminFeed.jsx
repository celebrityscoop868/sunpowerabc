import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Pin, PinOff } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

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
import { cn } from "../../lib/utils.js";

const postTypes = [
  { value: "news", label: "News" },
  { value: "welcome", label: "Welcome" },
  { value: "culture", label: "Culture" },
  { value: "announcement", label: "Announcement" },
];

export default function AdminFeed() {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    post_type: "news",
    title: "",
    content: "",
    image_url: "",
    pinned: false,
  });

  const queryClient = useQueryClient();
  const canRun = ADMIN_ENABLED && api?.FeedPost;

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin_posts"],
    enabled: canRun,
    queryFn: () => api.FeedPost.list("-created_date"),
    initialData: [],
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setFormData({ post_type: "news", title: "", content: "", image_url: "", pinned: false });
  };

  const createMutation = useMutation({
    mutationFn: (data) => api.FeedPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_posts"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.FeedPost.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_posts"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.FeedPost.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_posts"] });
    },
  });

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      post_type: post.post_type,
      title: post.title,
      content: post.content,
      image_url: post.image_url || "",
      pinned: !!post.pinned,
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content || !canRun) return;
    if (editingPost) updateMutation.mutate({ id: editingPost.id, data: formData });
    else createMutation.mutate(formData);
  };

  const togglePin = (post) => {
    if (!canRun) return;
    updateMutation.mutate({ id: post.id, data: { pinned: !post.pinned } });
  };

  if (!ADMIN_ENABLED) {
    return (
      <div className="rounded-2xl border bg-white p-5 text-slate-700">
        <div className="text-lg font-bold">Admin Feed</div>
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
        <h3 className="font-semibold text-slate-800">{posts.length} Posts</h3>
        <Button onClick={() => setShowForm(true)} className="rounded-xl bg-orange-500 hover:bg-orange-600">
          <Plus size={18} className="mr-2" />
          New Post
        </Button>
      </div>

      <div className="space-y-3">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={cn(
              "rounded-xl border bg-white p-4",
              post.pinned ? "border-orange-200" : "border-slate-100"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-500">
                    {post.post_type}
                  </span>
                  {post.pinned && (
                    <span className="rounded bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
                      Pinned
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-slate-800">{post.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{post.content}</p>
                {post.created_date && (
                  <p className="mt-2 text-xs text-slate-400">
                    {format(new Date(post.created_date), "MMM d, yyyy")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => togglePin(post)} className="h-8 w-8">
                  {post.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(post)} className="h-8 w-8">
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(post.id)}
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
            <DialogTitle>{editingPost ? "Edit Post" : "New Post"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select
                value={formData.post_type}
                onValueChange={(v) => setFormData((p) => ({ ...p, post_type: v }))}
              >
                <SelectTrigger className="mt-1 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {postTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Post title"
                className="mt-1 rounded-xl"
              />
            </div>

            <div>
              <Label>Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                placeholder="Post content..."
                className="mt-1 min-h-[100px] rounded-xl"
              />
            </div>

            <div>
              <Label>Image URL (optional)</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData((p) => ({ ...p, image_url: e.target.value }))}
                placeholder="https://..."
                className="mt-1 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Pin to top</Label>
              <Switch
                checked={formData.pinned}
                onCheckedChange={(checked) => setFormData((p) => ({ ...p, pinned: checked }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending || !formData.title || !formData.content}
              className="rounded-xl bg-orange-500 hover:bg-orange-600"
            >
              {editingPost ? "Save Changes" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

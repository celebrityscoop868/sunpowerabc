// src/components/feed/FeedCard.jsx
import React, { useState } from "react";
import { Heart, Clock, Megaphone, Users, Sparkles, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

const typeIcons = {
  news: Newspaper,
  welcome: Sparkles,
  culture: Users,
  announcement: Megaphone,
};

const typeColors = {
  news: "bg-blue-50 text-blue-600",
  welcome: "bg-emerald-50 text-emerald-600",
  culture: "bg-purple-50 text-purple-600",
  announcement: "bg-amber-50 text-amber-600",
};

function formatDateSafe(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function FeedCard({ post, liked = false, onLike, likesCount = 0 }) {
  const [isLiking, setIsLiking] = useState(false);
  const Icon = typeIcons[post?.post_type] || Newspaper;

  const handleLike = async () => {
    if (isLiking) return;
    if (!onLike || !post?.id) return;

    try {
      setIsLiking(true);
      await onLike(post.id);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {post?.image_url && (
        <div className="aspect-video bg-slate-100">
          <img src={post.image_url} alt={post?.title || ""} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className={cn("p-1.5 rounded-lg", typeColors[post?.post_type] || "bg-slate-50 text-slate-600")}>
            <Icon size={14} />
          </div>

          <span className="text-xs font-medium text-slate-500 capitalize">
            {(post?.post_type || "news").replace("_", " ")}
          </span>

          {!!post?.pinned && (
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              Pinned
            </span>
          )}
        </div>

        <h3 className="font-semibold text-slate-900 text-lg mb-2">{post?.title}</h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-4">{post?.content}</p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock size={14} />
            <span className="text-xs">{formatDateSafe(post?.created_date)}</span>
          </div>

          <button
            type="button"
            onClick={handleLike}
            disabled={isLiking || !onLike}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all",
              liked ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-500 hover:bg-slate-100",
              (isLiking || !onLike) && "opacity-60 cursor-not-allowed"
            )}
          >
            <Heart size={16} className={cn(liked && "fill-red-500")} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

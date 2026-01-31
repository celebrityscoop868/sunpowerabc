import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Trash2, Eye, EyeOff, Heart } from 'lucide-react';
import MobileCard from '@/components/ui/MobileCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const ADMIN_EMAIL = 'melany.hdz006@gmail.com';

export default function AdminFeed() {
  const [currentUser, setCurrentUser] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', image_url: '', publish_at: '', like_count_override: '' });
  const [editPost, setEditPost] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(userData => {
      setCurrentUser(userData);
      if (userData.email !== ADMIN_EMAIL) {
        navigate(createPageUrl('Feed'));
      }
    }).catch(() => navigate(createPageUrl('Feed')));
  }, [navigate]);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['adminFeedPosts'],
    queryFn: () => base44.entities.FeedPost.list('-created_date'),
    enabled: currentUser?.email === ADMIN_EMAIL,
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      const postData = {
        title: data.title,
        content: data.content,
        image_url: data.image_url || undefined,
        is_published: true,
        likes_enabled: true,
      };
      if (data.publish_at) {
        postData.publish_at = new Date(data.publish_at).toISOString();
      }
      if (data.like_count_override) {
        postData.like_count_override = parseInt(data.like_count_override);
      }
      return base44.entities.FeedPost.create(postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminFeedPosts']);
      setNewPost({ title: '', content: '', image_url: '', publish_at: '', like_count_override: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      const updateData = { ...data };
      if (updateData.publish_at) {
        updateData.publish_at = new Date(updateData.publish_at).toISOString();
      }
      if (updateData.like_count_override !== undefined && updateData.like_count_override !== '') {
        updateData.like_count_override = parseInt(updateData.like_count_override);
      }
      return base44.entities.FeedPost.update(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminFeedPosts']);
      setEditPost(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FeedPost.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['adminFeedPosts']),
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, is_published }) => base44.entities.FeedPost.update(id, { is_published: !is_published }),
    onSuccess: () => queryClient.invalidateQueries(['adminFeedPosts']),
  });

  if (currentUser?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-medium text-gray-800 mb-4">Administrar Feed</h1>

      <MobileCard>
        <h3 className="text-sm font-medium text-gray-800 mb-4">Crear Nuevo Post</h3>
        <div className="space-y-3">
          <Input
            placeholder="Título"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            placeholder="Contenido"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            rows={4}
          />
          <Input
            placeholder="URL de imagen (opcional)"
            value={newPost.image_url}
            onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
          />
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Fecha de publicación (opcional)</label>
            <Input
              type="datetime-local"
              value={newPost.publish_at}
              onChange={(e) => setNewPost({ ...newPost, publish_at: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Likes override (opcional)</label>
            <Input
              type="number"
              placeholder="Ej: 25"
              value={newPost.like_count_override}
              onChange={(e) => setNewPost({ ...newPost, like_count_override: e.target.value })}
            />
          </div>
          <Button
            onClick={() => createMutation.mutate(newPost)}
            disabled={!newPost.title || !newPost.content || createMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Crear Post
          </Button>
        </div>
      </MobileCard>

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <MobileCard>
            <p className="text-gray-500 text-center py-8">No hay posts</p>
          </MobileCard>
        ) : (
          posts.map(post => (
            <MobileCard key={post.id}>
              {editPost?.id === post.id ? (
                <div className="space-y-3">
                  <Input
                    value={editPost.title}
                    onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                  />
                  <Textarea
                    value={editPost.content}
                    onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                    rows={4}
                  />
                  <Input
                    placeholder="URL de imagen"
                    value={editPost.image_url || ''}
                    onChange={(e) => setEditPost({ ...editPost, image_url: e.target.value })}
                  />
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Fecha de publicación</label>
                    <Input
                      type="datetime-local"
                      value={editPost.publish_at ? new Date(editPost.publish_at).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditPost({ ...editPost, publish_at: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Likes override</label>
                    <Input
                      type="number"
                      value={editPost.like_count_override ?? ''}
                      onChange={(e) => setEditPost({ ...editPost, like_count_override: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditPost(null)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => updateMutation.mutate({ id: post.id, data: editPost })}
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-base text-gray-800 font-medium">{post.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{post.content}</p>
                      {post.publish_at && (
                        <p className="text-xs text-gray-400 mt-2">
                          Publica: {new Date(post.publish_at).toLocaleString()}
                        </p>
                      )}
                      {post.like_count_override !== null && post.like_count_override !== undefined && (
                        <div className="flex items-center gap-1 mt-2">
                          <Heart className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{post.like_count_override} likes (override)</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePublishMutation.mutate({ id: post.id, is_published: post.is_published })}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        {post.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(post.id)}
                        className="p-2 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={() => setEditPost(post)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Editar
                  </Button>
                </>
              )}
            </MobileCard>
          ))
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Trash2, FileText } from 'lucide-react';
import MobileCard from '@/components/ui/MobileCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ADMIN_EMAIL = 'melany.hdz006@gmail.com';

export default function AdminDocumentos() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newDoc, setNewDoc] = useState({ 
    title: '', 
    content: '', 
    version: '1.0', 
    category: 'other',
    requires_acceptance: false, 
    file_url: '' 
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(userData => {
      setUser(userData);
      if (userData.email !== ADMIN_EMAIL) {
        navigate(createPageUrl('Feed'));
      }
    }).catch(() => navigate(createPageUrl('Feed')));
  }, [navigate]);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['adminDocuments'],
    queryFn: () => base44.entities.Document.list('order'),
    enabled: user?.email === ADMIN_EMAIL,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Document.create({ ...data, order: documents.length + 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminDocuments']);
      setShowForm(false);
      setNewDoc({ title: '', content: '', version: '1.0', category: 'other', requires_acceptance: false, file_url: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Document.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['adminDocuments']),
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setNewDoc({ ...newDoc, file_url });
  };

  if (user?.email !== ADMIN_EMAIL) return null;

  const categories = {
    handbook: 'Employee Handbook',
    policy: 'Policies',
    safety: 'Safety',
    other: 'Other',
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-800">Documentos</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nuevo
        </Button>
      </div>

      {showForm && (
        <MobileCard>
          <div className="space-y-4">
            <Input
              placeholder="Título del documento"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Versión"
                value={newDoc.version}
                onChange={(e) => setNewDoc({ ...newDoc, version: e.target.value })}
                className="w-24"
              />
              <Select value={newDoc.category} onValueChange={(val) => setNewDoc({ ...newDoc, category: val })}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categories).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Descripción"
              value={newDoc.content}
              onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
              rows={3}
            />
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Subir archivo PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {newDoc.file_url && (
                <p className="text-xs text-green-600 mt-1">Archivo subido ✓</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">¿Requiere aceptación en Setup?</span>
              <Switch
                checked={newDoc.requires_acceptance}
                onCheckedChange={(checked) => setNewDoc({ ...newDoc, requires_acceptance: checked })}
              />
            </div>
            <Button
              onClick={() => createMutation.mutate(newDoc)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newDoc.title || !newDoc.version || createMutation.isPending}
            >
              Crear documento
            </Button>
          </div>
        </MobileCard>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <MobileCard key={doc.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base text-gray-800 font-medium truncate">{doc.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">v{doc.version}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {categories[doc.category] || doc.category}
                    </span>
                    {doc.requires_acceptance && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Setup
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(doc.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </MobileCard>
          ))}
        </div>
      )}
    </div>
  );
}

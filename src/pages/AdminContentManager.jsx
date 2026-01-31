import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ADMIN_EMAIL = 'melany.hdz006@gmail.com';

const DEFAULT_COPY = [
  { key: 'screen1_title', section: 'Onboarding Screen 1', content: 'Warehouse Roles & Schedule Overview', default_content: 'Warehouse Roles & Schedule Overview', content_type: 'heading' },
  { key: 'screen2_title', section: 'Onboarding Screen 2', content: 'Employment Documents', default_content: 'Employment Documents', content_type: 'heading' },
  { key: 'screen3_title', section: 'Onboarding Screen 3', content: 'Employment Eligibility Verification (Form I-9)', default_content: 'Employment Eligibility Verification (Form I-9)', content_type: 'heading' },
  { key: 'screen4_title', section: 'Onboarding Screen 4', content: 'Shift Selection', default_content: 'Shift Selection', content_type: 'heading' },
  { key: 'screen5_title', section: 'Onboarding Screen 5', content: 'Safety Footwear Program', default_content: 'Safety Footwear Program', content_type: 'heading' },
  { key: 'screen6_title', section: 'Onboarding Screen 6', content: 'First Day Instructions', default_content: 'First Day Instructions', content_type: 'heading' },
  { key: 'screen7_title', section: 'Onboarding Screen 7', content: 'Site Contacts / Team', default_content: 'Site Contacts / Team', content_type: 'heading' },
];

export default function AdminContentManager() {
  const [user, setUser] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me()
      .then(userData => {
        setUser(userData);
        if (userData.email !== ADMIN_EMAIL) {
          navigate(createPageUrl('Admin'));
        }
      })
      .catch(() => navigate(createPageUrl('Admin')));
  }, [navigate]);

  const { data: contentCopy = [], isLoading } = useQuery({
    queryKey: ['contentCopy'],
    queryFn: () => base44.entities.ContentCopy.list(),
    enabled: user?.email === ADMIN_EMAIL,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, content, section, default_content, content_type }) => {
      const existing = contentCopy.find(c => c.key === key);
      if (existing) {
        await base44.entities.ContentCopy.update(existing.id, {
          content,
          updated_by: ADMIN_EMAIL,
        });
      } else {
        await base44.entities.ContentCopy.create({
          key,
          section,
          content,
          default_content,
          content_type,
          updated_by: ADMIN_EMAIL,
        });
      }
      await base44.entities.AdminAuditLog.create({
        admin_email: ADMIN_EMAIL,
        action: 'update_content_copy',
        details: { key, content },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contentCopy']);
      setEditingKey(null);
      setEditValue('');
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (key) => {
      const existing = contentCopy.find(c => c.key === key);
      if (existing) {
        await base44.entities.ContentCopy.update(existing.id, {
          content: existing.default_content,
          updated_by: ADMIN_EMAIL,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contentCopy']);
    },
  });

  if (user?.email !== ADMIN_EMAIL) return null;

  const getCopyValue = (key) => {
    const copy = contentCopy.find(c => c.key === key);
    if (copy) return copy.content;
    const defaultCopy = DEFAULT_COPY.find(c => c.key === key);
    return defaultCopy?.content || '';
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8] p-4 pb-24">
      <button 
        onClick={() => navigate(createPageUrl('Admin'))} 
        className="flex items-center gap-2 text-blue-600 font-medium mb-4 hover:text-blue-700"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Admin</span>
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Content Manager</h1>

      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {DEFAULT_COPY.map(item => {
            const currentValue = getCopyValue(item.key);
            const isEditing = editingKey === item.key;
            const hasChanges = currentValue !== item.default_content;

            return (
              <div key={item.key} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Label className="text-sm font-semibold text-gray-900">{item.section}</Label>
                    <p className="text-xs text-gray-500">{item.key}</p>
                  </div>
                  {hasChanges && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Modified</span>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={3}
                      className="font-medium"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateMutation.mutate({
                          key: item.key,
                          content: editValue,
                          section: item.section,
                          default_content: item.default_content,
                          content_type: item.content_type,
                        })}
                        disabled={updateMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingKey(null);
                          setEditValue('');
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-base text-gray-800 mb-3 font-medium">{currentValue}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setEditingKey(item.key);
                          setEditValue(currentValue);
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      {hasChanges && (
                        <Button
                          onClick={() => resetMutation.mutate(item.key)}
                          variant="outline"
                          size="sm"
                          className="text-orange-600 border-orange-200"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

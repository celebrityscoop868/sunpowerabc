import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Save, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ADMIN_EMAIL = 'melany.hdz006@gmail.com';

export default function AdminPPEManager() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
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

  const { data: settings, isLoading } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const results = await base44.entities.AppSettings.list();
      if (results.length === 0) {
        return base44.entities.AppSettings.create({
          app_name: 'Sun Power ABC',
          hr_email: 'hr@sunpowerc.energy',
        });
      }
      return results[0];
    },
    enabled: user?.email === ADMIN_EMAIL,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        ppe_shop_link_url: settings.ppe_shop_link_url || '',
        ppe_instructions: settings.ppe_instructions || '',
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.AppSettings.update(settings.id, formData);
      await base44.entities.AdminAuditLog.create({
        admin_email: ADMIN_EMAIL,
        action: 'update_ppe_settings',
        details: { changes: formData },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['appSettings']);
    },
  });

  if (user?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="min-h-screen bg-[#F3F5F8] p-4 pb-24">
      <button 
        onClick={() => navigate(createPageUrl('Admin'))} 
        className="flex items-center gap-2 text-blue-600 font-medium mb-4 hover:text-blue-700"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Admin</span>
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">PPE / Links Manager</h1>

      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <div>
              <Label htmlFor="ppe_shop_link_url">PPE Shop Link URL</Label>
              <Input
                id="ppe_shop_link_url"
                value={formData.ppe_shop_link_url || ''}
                onChange={(e) => setFormData({ ...formData, ppe_shop_link_url: e.target.value })}
                placeholder="https://shop.example.com/ppe"
              />
              <p className="text-xs text-gray-500 mt-1">
                Employees will see this link on the Safety Footwear step. Leave empty to hide the link.
              </p>
              {formData.ppe_shop_link_url && (
                <a
                  href={formData.ppe_shop_link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Preview link
                </a>
              )}
            </div>

            <div>
              <Label htmlFor="ppe_instructions">PPE Program Instructions</Label>
              <Textarea
                id="ppe_instructions"
                value={formData.ppe_instructions || ''}
                onChange={(e) => setFormData({ ...formData, ppe_instructions: e.target.value })}
                placeholder="All employees must wear approved safety footwear..."
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                This text appears on the Safety Footwear onboarding screen.
              </p>
            </div>
          </div>

          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-4 rounded-xl font-semibold shadow-md"
          >
            <Save className="w-5 h-5 mr-2" />
            {updateMutation.isPending ? 'Saving...' : 'Save PPE Settings'}
          </Button>

          {updateMutation.isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-green-800 font-medium">PPE settings saved successfully!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

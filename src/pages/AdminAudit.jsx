import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import MobileCard from '@/components/ui/MobileCard';

const ADMIN_EMAIL = 'melany.hdz006@gmail.com';

export default function AdminAudit() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(userData => {
      setUser(userData);
      if (userData.email !== ADMIN_EMAIL) {
        navigate(createPageUrl('Feed'));
      }
    }).catch(() => navigate(createPageUrl('Feed')));
  }, [navigate]);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.AdminAuditLog.list('-created_date'),
    enabled: user?.email === ADMIN_EMAIL,
  });

  if (user?.email !== ADMIN_EMAIL) return null;

  const actionLabels = {
    invite_user: 'Invited user',
    revoke_access: 'Revoked access',
    restore_access: 'Restored access',
    activate_user: 'Activated user',
    update_setup_step: 'Updated setup step',
    unlock_ppe: 'Unlocked PPE',
    approve_setup: 'Approved setup',
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-medium text-gray-800 mb-4">Audit Log</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <MobileCard>
          <p className="text-gray-500 text-center py-8">No audit logs yet</p>
        </MobileCard>
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
            <MobileCard key={log.id} className="py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {actionLabels[log.action] || log.action}
                  </p>
                  {log.target_user_id && (
                    <p className="text-xs text-gray-500">Target: {log.target_user_id}</p>
                  )}
                  {log.details && Object.keys(log.details).length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      {JSON.stringify(log.details)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {format(new Date(log.created_date), "MMM d, HH:mm")}
                </span>
              </div>
            </MobileCard>
          ))}
        </div>
      )}
    </div>
  );
}

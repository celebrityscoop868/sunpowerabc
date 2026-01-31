import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronRight, UserPlus, Ban, RotateCcw } from 'lucide-react';
import MobileCard from '@/components/ui/MobileCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const ADMIN_EMAIL = 'melany.hdz006@gmail.com';

export default function AdminEmpleados() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showRevoke, setShowRevoke] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteEmployeeId, setInviteEmployeeId] = useState('');
  const [revokeReason, setRevokeReason] = useState('');
  const [filter, setFilter] = useState('all');
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

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list('-created_date'),
    enabled: currentUser?.email === ADMIN_EMAIL,
  });

  const logAction = async (action, targetUserId, details) => {
    await base44.entities.AdminAuditLog.create({
      admin_email: ADMIN_EMAIL,
      action,
      target_user_id: targetUserId,
      details,
    });
  };

  const revokeAccessMutation = useMutation({
    mutationFn: async ({ userId, reason }) => {
      await base44.entities.User.update(userId, {
        access_revoked: true,
        access_revoked_reason: reason,
        access_revoked_at: new Date().toISOString(),
      });
      await logAction('revoke_access', userId, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setShowRevoke(null);
      setRevokeReason('');
    },
  });

  const restoreAccessMutation = useMutation({
    mutationFn: async (userId) => {
      await base44.entities.User.update(userId, {
        access_revoked: false,
        access_revoked_reason: null,
        access_revoked_at: null,
      });
      await logAction('restore_access', userId, {});
    },
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  const activateMutation = useMutation({
    mutationFn: async (userId) => {
      await base44.entities.User.update(userId, { state: 'active' });
      await logAction('activate_user', userId, {});
    },
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  const handleInvite = async () => {
    if (!inviteEmail || !inviteEmployeeId) return;
    await base44.users.inviteUser(inviteEmail, 'user');
    await base44.entities.User.filter({ email: inviteEmail }).then(async users => {
      if (users[0]) {
        await base44.entities.User.update(users[0].id, { employee_id: inviteEmployeeId });
      }
    });
    await logAction('invite_user', null, { email: inviteEmail, employee_id: inviteEmployeeId });
    setInviteEmail('');
    setInviteEmployeeId('');
    setShowInvite(false);
    queryClient.invalidateQueries(['users']);
  };

  if (currentUser?.email !== ADMIN_EMAIL) return null;

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true;
    if (filter === 'revoked') return u.access_revoked;
    return u.state === filter;
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-800">Empleados</h1>
        <Button
          onClick={() => setShowInvite(!showInvite)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <UserPlus className="w-4 h-4 mr-1" />
          Invitar
        </Button>
      </div>

      {showInvite && (
        <MobileCard>
          <div className="space-y-4">
            <Input
              placeholder="Employee ID"
              value={inviteEmployeeId}
              onChange={(e) => setInviteEmployeeId(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email interno ({id}@abc.local)"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <Button
              onClick={handleInvite}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!inviteEmail || !inviteEmployeeId}
            >
              Enviar invitación
            </Button>
          </div>
        </MobileCard>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {[
          { value: 'all', label: 'Todos' },
          { value: 'pending', label: 'Pending' },
          { value: 'active', label: 'Active' },
          { value: 'revoked', label: 'Revoked' },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === tab.value 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map(user => (
            <MobileCard key={user.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base text-gray-800 font-medium truncate">
                      {user.display_name || user.full_name || 'Sin nombre'}
                    </h3>
                    {user.access_revoked && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Revoked</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  {user.employee_id && (
                    <p className="text-xs text-gray-400">ID: {user.employee_id}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      user.state === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.state || 'pending'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {!user.access_revoked && user.state === 'pending' && (
                    <Button
                      onClick={() => activateMutation.mutate(user.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs"
                    >
                      Activar
                    </Button>
                  )}
                  {user.access_revoked ? (
                    <Button
                      onClick={() => restoreAccessMutation.mutate(user.id)}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Restaurar
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowRevoke(user.id)}
                      size="sm"
                      variant="outline"
                      className="text-xs text-red-600 border-red-200"
                    >
                      <Ban className="w-3 h-3 mr-1" />
                      Revocar
                    </Button>
                  )}
                </div>
              </div>

              {showRevoke === user.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <Textarea
                    placeholder="Razón de revocación"
                    value={revokeReason}
                    onChange={(e) => setRevokeReason(e.target.value)}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowRevoke(null)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => revokeAccessMutation.mutate({ userId: user.id, reason: revokeReason })}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      size="sm"
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              )}
            </MobileCard>
          ))}
        </div>
      )}
    </div>
  );
}

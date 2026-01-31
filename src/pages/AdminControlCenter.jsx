import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, Users, CheckCircle, XCircle, Clock, AlertCircle,
  Settings, FileText, Calendar, Shield, Bell, BarChart3,
  TrendingUp, Activity, Eye, Edit, Trash2, Lock, Unlock,
  ChevronDown, ChevronUp, Search, Filter, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ADMIN_EMAIL = 'melany.hdz006@gmail.com';

export default function AdminControlCenter() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
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

  // ===== DATA ANALYSIS LAYER =====
  // Fetch ALL data sessions and entities
  const { data: employmentSetups = [] } = useQuery({
    queryKey: ['allEmploymentSetups'],
    queryFn: () => base44.entities.EmploymentSetup.list('-updated_date'),
    enabled: user?.email === ADMIN_EMAIL,
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    enabled: user?.email === ADMIN_EMAIL,
  });

  const { data: shiftOptions = [] } = useQuery({
    queryKey: ['shiftOptions'],
    queryFn: () => base44.entities.ShiftOption.list('order'),
    enabled: user?.email === ADMIN_EMAIL,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list(),
    enabled: user?.email === ADMIN_EMAIL,
  });

  const { data: feedPosts = [] } = useQuery({
    queryKey: ['feedPosts'],
    queryFn: () => base44.entities.FeedPost.list('-created_date'),
    enabled: user?.email === ADMIN_EMAIL,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => base44.entities.Notification.list('-created_date', 50),
    enabled: user?.email === ADMIN_EMAIL,
  });

  const { data: siteContacts = [] } = useQuery({
    queryKey: ['siteContacts'],
    queryFn: () => base44.entities.SiteContact.list(),
    enabled: user?.email === ADMIN_EMAIL,
  });

  const { data: appSettings = [] } = useQuery({
    queryKey: ['appSettings'],
    queryFn: () => base44.entities.AppSettings.list(),
    enabled: user?.email === ADMIN_EMAIL,
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.AdminAuditLog.list('-created_date', 100),
    enabled: user?.email === ADMIN_EMAIL,
  });

  // ===== AUTOMATIC ANALYSIS =====
  const systemAnalysis = React.useMemo(() => {
    // Analyze pending reviews
    const ppeReviews = employmentSetups.filter(s => s.ppe_status === 'awaiting_approval');
    const completedOnboarding = employmentSetups.filter(s => s.onboarding_submitted || s.status === 'completed');
    const inProgressOnboarding = employmentSetups.filter(s => s.status === 'in_progress' && !s.onboarding_submitted);
    
    // User status analysis
    const pendingUsers = allUsers.filter(u => !u.employee_status || u.employee_status === 'pending');
    const approvedUsers = allUsers.filter(u => u.employee_status === 'approved');
    const blockedUsers = allUsers.filter(u => u.access_revoked);
    
    // Content analysis
    const publishedPosts = feedPosts.filter(p => p.is_published);
    const draftPosts = feedPosts.filter(p => !p.is_published);
    const unreadNotifications = notifications.filter(n => !n.is_read);
    
    // Configuration status
    const activeShifts = shiftOptions.filter(s => s.is_available);
    const requiredDocuments = documents.filter(d => d.requires_acceptance);
    const activeContacts = siteContacts.filter(c => c.is_active);

    return {
      reviews: {
        ppe: ppeReviews.length,
        onboarding: completedOnboarding.length,
        total: ppeReviews.length + completedOnboarding.length
      },
      users: {
        total: allUsers.length,
        pending: pendingUsers.length,
        approved: approvedUsers.length,
        blocked: blockedUsers.length,
        inProgress: inProgressOnboarding.length
      },
      content: {
        posts: feedPosts.length,
        published: publishedPosts.length,
        drafts: draftPosts.length,
        notifications: notifications.length,
        unread: unreadNotifications.length
      },
      configuration: {
        shifts: shiftOptions.length,
        activeShifts: activeShifts.length,
        documents: documents.length,
        requiredDocs: requiredDocuments.length,
        contacts: siteContacts.length,
        activeContacts: activeContacts.length,
        settings: appSettings.length
      },
      audit: {
        recentActions: auditLogs.length,
        today: auditLogs.filter(l => new Date(l.created_date).toDateString() === new Date().toDateString()).length
      }
    };
  }, [employmentSetups, allUsers, feedPosts, notifications, shiftOptions, documents, siteContacts, appSettings, auditLogs]);

  // ===== UNIFIED MUTATIONS =====
  const approvePPEMutation = useMutation({
    mutationFn: async ({ setupId, userEmail }) => {
      // CRITICAL: Auto-complete PPE step on approval
      await base44.entities.EmploymentSetup.update(setupId, {
        ppe_status: 'approved',
        screen_5_completed: true
      });
      await base44.entities.Notification.create({
        user_email: userEmail,
        title: 'Safety Footwear Approved',
        message: 'Your safety footwear purchase has been approved. You can now continue with shift selection.',
        type: 'approved'
      });
      await base44.entities.AdminAuditLog.create({
        admin_email: ADMIN_EMAIL,
        action: 'approve_ppe',
        details: { userEmail, setupId, auto_completed: true }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allEmploymentSetups']);
      queryClient.invalidateQueries(['auditLogs']);
    }
  });

  const rejectPPEMutation = useMutation({
    mutationFn: async ({ setupId, userEmail, reason }) => {
      await base44.entities.EmploymentSetup.update(setupId, {
        ppe_status: 'rejected',
        ppe_admin_note: reason,
        screen_5_completed: false
      });
      await base44.entities.Notification.create({
        user_email: userEmail,
        title: 'Safety Footwear Requires Action',
        message: `Your safety footwear submission was not approved. Reason: ${reason}`,
        type: 'needs_fix'
      });
      await base44.entities.AdminAuditLog.create({
        admin_email: ADMIN_EMAIL,
        action: 'reject_ppe',
        details: { userEmail, setupId, reason }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allEmploymentSetups']);
      queryClient.invalidateQueries(['auditLogs']);
    }
  });

  const blockUserMutation = useMutation({
    mutationFn: async ({ userId, reason }) => {
      const targetUser = allUsers.find(u => u.id === userId);
      await base44.entities.User.update(userId, {
        access_revoked: true,
        access_revoked_reason: reason
      });
      await base44.entities.AdminAuditLog.create({
        admin_email: ADMIN_EMAIL,
        action: 'block_user',
        target_user_id: userId,
        details: { reason, userEmail: targetUser.email }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers']);
      queryClient.invalidateQueries(['auditLogs']);
    }
  });

  const unblockUserMutation = useMutation({
    mutationFn: async ({ userId }) => {
      const targetUser = allUsers.find(u => u.id === userId);
      await base44.entities.User.update(userId, {
        access_revoked: false,
        access_revoked_reason: null
      });
      await base44.entities.AdminAuditLog.create({
        admin_email: ADMIN_EMAIL,
        action: 'unblock_user',
        target_user_id: userId,
        details: { userEmail: targetUser.email }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers']);
      queryClient.invalidateQueries(['auditLogs']);
    }
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getUserName = (email) => {
    const u = allUsers.find(usr => usr.email === email);
    return u?.full_name || u?.display_name || email;
  };

  if (user?.email !== ADMIN_EMAIL) return null;

  // ===== RENDER SECTIONS =====
  const renderOverview = () => (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{systemAnalysis.reviews.total}</span>
          </div>
          <p className="text-sm text-gray-600">Pending Reviews</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{systemAnalysis.users.total}</span>
          </div>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{systemAnalysis.users.approved}</span>
          </div>
          <p className="text-sm text-gray-600">Approved Users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{systemAnalysis.audit.today}</span>
          </div>
          <p className="text-sm text-gray-600">Actions Today</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveTab('reviews')}
            className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left"
          >
            <div className="flex items-center justify-between mb-1">
              <Clock className="w-4 h-4 text-yellow-600" />
              {systemAnalysis.reviews.total > 0 && (
                <span className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-700 text-xs flex items-center justify-center font-semibold">
                  {systemAnalysis.reviews.total}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-gray-900">Review Inbox</p>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left"
          >
            <Users className="w-4 h-4 text-blue-600 mb-1" />
            <p className="text-xs font-medium text-gray-900">Manage Users</p>
          </button>

          <button
            onClick={() => navigate(createPageUrl('AdminAppSettings'))}
            className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left"
          >
            <Settings className="w-4 h-4 text-gray-600 mb-1" />
            <p className="text-xs font-medium text-gray-900">Settings</p>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left"
          >
            <BarChart3 className="w-4 h-4 text-purple-600 mb-1" />
            <p className="text-xs font-medium text-gray-900">Audit Log</p>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">System Status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Active Shifts</span>
            <span className="text-xs font-semibold text-gray-900">{systemAnalysis.configuration.activeShifts}/{systemAnalysis.configuration.shifts}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Published Posts</span>
            <span className="text-xs font-semibold text-gray-900">{systemAnalysis.content.published}/{systemAnalysis.content.posts}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Active Contacts</span>
            <span className="text-xs font-semibold text-gray-900">{systemAnalysis.configuration.activeContacts}/{systemAnalysis.configuration.contacts}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Required Documents</span>
            <span className="text-xs font-semibold text-gray-900">{systemAnalysis.configuration.requiredDocs}</span>
          </div>
        </div>
      </div>
    </div>
  );
  const manualCompleteStepMutation = useMutation({
    mutationFn: async ({ setupId, userEmail, screenNum }) => {
      await base44.entities.EmploymentSetup.update(setupId, {
        [`screen_${screenNum}_completed`]: true
      });
      await base44.entities.AdminAuditLog.create({
        admin_email: ADMIN_EMAIL,
        action: 'manual_complete_step',
        details: { userEmail, setupId, screenNum }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allEmploymentSetups']);
      queryClient.invalidateQueries(['auditLogs']);
    }
  });

  const renderReviews = () => {
    const ppeReviews = employmentSetups.filter(s => s.ppe_status === 'awaiting_approval');
    const allReviews = employmentSetups.filter(s => 
      s.ppe_status === 'awaiting_approval' || 
      (!s.screen_2_completed || !s.screen_3_completed || !s.screen_4_completed)
    );

    return (
      <div className="space-y-4">
        {/* PPE Reviews */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">PPE Submissions ({ppeReviews.length})</h3>
          {ppeReviews.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No pending PPE reviews</p>
          ) : (
            <div className="space-y-3">
              {ppeReviews.map(setup => (
                <div key={setup.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{getUserName(setup.user_email)}</p>
                      <p className="text-xs text-gray-500">{setup.user_email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Under Review</span>
                  </div>
                  {setup.ppe_link_opened && (
                    <p className="text-xs text-gray-600 mb-2">✓ Vendor store accessed</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => approvePPEMutation.mutate({ setupId: setup.id, userEmail: setup.user_email })}
                      disabled={approvePPEMutation.isPending}
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason:');
                        if (reason) {
                          rejectPPEMutation.mutate({ setupId: setup.id, userEmail: setup.user_email, reason });
                        }
                      }}
                      disabled={rejectPPEMutation.isPending}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual Step Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Manual Step Overrides</h3>
          <p className="text-xs text-gray-600 mb-3">Manually complete or reset any onboarding step</p>
          <Button
            onClick={() => setActiveTab('users')}
            variant="outline"
            className="w-full text-sm"
          >
            Manage Individual Users
          </Button>
        </div>

        <Button
          onClick={() => navigate(createPageUrl('AdminUserSubmissions'))}
          variant="outline"
          className="w-full"
        >
          View Full PPE Review Inbox
        </Button>
      </div>
    );
  };

  const renderUsers = () => {
    const filteredUsers = allUsers.filter(u => 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
          
          <div className="space-y-3">
            {filteredUsers.map(u => {
              const setup = employmentSetups.find(s => s.user_email === u.email);
              const isBlocked = u.access_revoked;
              const isExpanded = expandedSections[u.id];
              
              return (
                <div key={u.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{u.full_name || u.email}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                      {u.employee_id && (
                        <p className="text-xs text-gray-400">ID: {u.employee_id}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isBlocked ? 'bg-red-100 text-red-800' :
                        u.employee_status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {isBlocked ? 'Blocked' : u.employee_status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {setup && (
                    <div className="text-xs text-gray-600 mb-2">
                      Onboarding: {setup.status || 'in_progress'} • 
                      Steps: {[2,3,4,5,6,7].filter(n => setup[`screen_${n}_completed`]).length}/6 completed
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-2">
                    <Button
                      onClick={() => navigate(createPageUrl(`AdminEmpleadoDetalle?userId=${u.id}`))}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {setup && (
                      <Button
                        onClick={() => toggleSection(u.id)}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                        Steps
                      </Button>
                    )}
                    {isBlocked ? (
                      <Button
                        onClick={() => unblockUserMutation.mutate({ userId: u.id })}
                        disabled={unblockUserMutation.isPending}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Unlock className="w-3 h-3 mr-1" />
                        Unblock
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          const reason = prompt('Enter reason for blocking:');
                          if (reason) {
                            blockUserMutation.mutate({ userId: u.id, reason });
                          }
                        }}
                        disabled={blockUserMutation.isPending}
                        size="sm"
                        variant="outline"
                        className="flex-1 text-red-600 border-red-200"
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        Block
                      </Button>
                    )}
                  </div>

                  {/* Expanded Step Controls */}
                  {isExpanded && setup && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Onboarding Steps Control</p>
                      <div className="space-y-1.5">
                        {[
                          { num: 2, label: 'Employment Docs', key: 'screen_2_completed' },
                          { num: 3, label: 'I-9 Readiness', key: 'screen_3_completed' },
                          { num: 5, label: 'PPE/Safety', key: 'screen_5_completed', isPPE: true },
                          { num: 4, label: 'Shift Selection', key: 'screen_4_completed' },
                          { num: 6, label: 'First Day Info', key: 'screen_6_completed' },
                          { num: 7, label: 'Site Contacts', key: 'screen_7_completed' },
                        ].map(step => {
                          const isCompleted = step.isPPE ? setup.ppe_status === 'approved' : setup[step.key];
                          return (
                            <div key={step.num} className="flex items-center justify-between text-xs">
                              <span className={isCompleted ? 'text-green-600' : 'text-gray-500'}>
                                {isCompleted ? '✓' : '○'} {step.label}
                              </span>
                              <Button
                                onClick={async () => {
                                  if (step.isPPE) {
                                    if (setup.ppe_status === 'approved') {
                                      await base44.entities.EmploymentSetup.update(setup.id, {
                                        ppe_status: 'pending',
                                        screen_5_completed: false
                                      });
                                    } else {
                                      await base44.entities.EmploymentSetup.update(setup.id, {
                                        ppe_status: 'approved',
                                        screen_5_completed: true
                                      });
                                    }
                                  } else {
                                    await base44.entities.EmploymentSetup.update(setup.id, {
                                      [step.key]: !isCompleted
                                    });
                                  }
                                  await base44.entities.AdminAuditLog.create({
                                    admin_email: ADMIN_EMAIL,
                                    action: isCompleted ? 'reset_step' : 'complete_step',
                                    details: { userEmail: u.email, step: step.label }
                                  });
                                  queryClient.invalidateQueries(['allEmploymentSetups']);
                                }}
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                              >
                                {isCompleted ? 'Reset' : 'Complete'}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderAudit = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Actions</h3>
        {auditLogs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No audit logs yet</p>
        ) : (
          <div className="space-y-2">
            {auditLogs.slice(0, 20).map(log => (
              <div key={log.id} className="border-b border-gray-100 pb-2 last:border-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{log.action.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-500">{log.admin_email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(log.created_date).toLocaleString()}
                  </span>
                </div>
                {log.details && (
                  <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={() => navigate(createPageUrl('AdminAudit'))}
        variant="outline"
        className="w-full"
      >
        View Full Audit Log
      </Button>
    </div>
  );

  const renderConfiguration = () => (
    <div className="space-y-4">
      {/* Configuration Tools */}
      {[
        { icon: Calendar, label: 'Shift Options', page: 'AdminShiftsManager', count: shiftOptions.length },
        { icon: FileText, label: 'Documents', page: 'AdminDocumentos', count: documents.length },
        { icon: Users, label: 'Site Contacts', page: 'AdminSiteContacts', count: siteContacts.length },
        { icon: Settings, label: 'App Settings', page: 'AdminAppSettings', count: appSettings.length },
        { icon: Bell, label: 'Content Manager', page: 'AdminContentManager', count: 0 },
        { icon: Shield, label: 'PPE Configuration', page: 'AdminPPEManager', count: 0 },
        { icon: Activity, label: 'Feed Posts', page: 'AdminFeed', count: feedPosts.length },
      ].map(({ icon: Icon, label, page, count }) => (
        <button
          key={page}
          onClick={() => navigate(createPageUrl(page))}
          className="w-full bg-white rounded-xl shadow-sm p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </div>
            {count > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{count}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F5F8] p-4 pb-24">
      <button 
        onClick={() => navigate(createPageUrl('Admin'))} 
        className="flex items-center gap-2 text-blue-600 font-medium mb-4 hover:text-blue-700"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Control Center</h1>
        <p className="text-sm text-gray-600">Unified administrative control panel</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm p-2 mb-4 flex gap-1 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview', icon: TrendingUp },
          { key: 'reviews', label: 'Reviews', icon: Clock, badge: systemAnalysis.reviews.total },
          { key: 'users', label: 'Users', icon: Users },
          { key: 'config', label: 'Config', icon: Settings },
          { key: 'audit', label: 'Audit', icon: BarChart3 },
        ].map(({ key, label, icon: Icon, badge }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 min-w-[80px] flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === key
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {badge > 0 && (
              <span className={`ml-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                activeTab === key ? 'bg-white text-blue-600' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'reviews' && renderReviews()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'config' && renderConfiguration()}
      {activeTab === 'audit' && renderAudit()}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Users, ClipboardList, Newspaper, FileText, ChevronRight, Shield } from 'lucide-react';
import MobileCard from '@/components/ui/MobileCard';

const ADMIN_EMAIL = 'melany.hdz006@gmail.com';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me()
      .then(userData => {
        setUser(userData);
        if (userData.email !== ADMIN_EMAIL) {
          navigate(createPageUrl('Feed'));
        }
      })
      .catch(() => navigate(createPageUrl('Feed')))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (user?.email !== ADMIN_EMAIL) {
    return null;
  }

  const adminSections = [
    { 
      title: 'Admin Control Center', 
      description: 'Unified hub for all administrative functions',
      icon: Shield, 
      page: 'AdminControlCenter' 
    },
    { 
      title: 'App Settings', 
      description: 'Global settings and configuration',
      icon: Shield, 
      page: 'AdminAppSettings' 
    },
    { 
      title: 'Content Manager', 
      description: 'Edit app copy and text',
      icon: FileText, 
      page: 'AdminContentManager' 
    },
    { 
      title: 'Shifts Manager', 
      description: 'Manage shift options and availability',
      icon: ClipboardList, 
      page: 'AdminShiftsManager' 
    },
    { 
      title: 'PPE / Links', 
      description: 'Manage PPE shop links and instructions',
      icon: Shield, 
      page: 'AdminPPEManager' 
    },
    { 
      title: 'Site Contacts', 
      description: 'Manage site contact information',
      icon: Users, 
      page: 'AdminSiteContacts' 
    },
    { 
      title: 'User Submissions', 
      description: 'View all onboarding submissions',
      icon: ClipboardList, 
      page: 'AdminUserSubmissions' 
    },
    { 
      title: 'Empleados', 
      description: 'Gestionar empleados y credenciales',
      icon: Users, 
      page: 'AdminEmpleados' 
    },
    { 
      title: 'Feed', 
      description: 'Publicar noticias y actualizaciones',
      icon: Newspaper, 
      page: 'AdminFeed' 
    },
    { 
      title: 'Documentos', 
      description: 'Gestionar documentos y políticas',
      icon: FileText, 
      page: 'AdminDocumentos' 
    },
    { 
      title: 'Audit Log', 
      description: 'Ver registro de acciones admin',
      icon: Shield, 
      page: 'AdminAudit' 
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-medium text-gray-800 mb-4">Panel de Administración</h1>

      <div className="space-y-3">
        {adminSections.map(section => {
          const Icon = section.icon;
          return (
            <Link key={section.page} to={createPageUrl(section.page)}>
              <MobileCard className={`flex items-center gap-4 ${
                section.page === 'AdminControlCenter' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : ''
              }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  section.page === 'AdminControlCenter' ? 'bg-white/20' : 'bg-blue-50'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    section.page === 'AdminControlCenter' ? 'text-white' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base font-medium ${
                    section.page === 'AdminControlCenter' ? 'text-white' : 'text-gray-800'
                  }`}>{section.title}</h3>
                  <p className={`text-sm ${
                    section.page === 'AdminControlCenter' ? 'text-blue-100' : 'text-gray-500'
                  }`}>{section.description}</p>
                </div>
                <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
                  section.page === 'AdminControlCenter' ? 'text-white' : 'text-gray-400'
                }`} />
              </MobileCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

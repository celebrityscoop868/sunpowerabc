import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MobileCard from '@/components/ui/MobileCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminEmpleadoDetalle() {
  const [currentUser, setCurrentUser] = useState(null);
  const [taskNote, setTaskNote] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const { data: employee, isLoading: empLoading } = useQuery({
    queryKey: ['employee', userId],
    queryFn: () => base44.entities.User.filter({ id: userId }).then(res => res[0]),
    enabled: !!userId,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['onboardingTasks'],
    queryFn: () => base44.entities.OnboardingTask.list('order'),
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['userProgress', employee?.email],
    queryFn: () => base44.entities.UserTaskProgress.filter({ user_email: employee.email }),
    enabled: !!employee?.email,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status) => base44.entities.User.update(userId, { employee_status: status }),
    onSuccess: () => queryClient.invalidateQueries(['employee', userId]),
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status, note }) => {
      const existing = progress.find(p => p.task_id === taskId);
      if (existing) {
        return base44.entities.UserTaskProgress.update(existing.id, { status, admin_note: note });
      }
      return base44.entities.UserTaskProgress.create({
        user_email: employee.email,
        task_id: taskId,
        status,
        admin_note: note
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      setSelectedTaskId(null);
      setTaskNote('');
    },
  });

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-4">
        <MobileCard>
          <p className="text-gray-500 text-center py-8">Acceso solo para administradores</p>
        </MobileCard>
      </div>
    );
  }

  if (empLoading) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-4">
        <MobileCard>
          <p className="text-gray-500 text-center py-8">Empleado no encontrado</p>
        </MobileCard>
      </div>
    );
  }

  const getTaskStatus = (taskId) => {
    const taskProgress = progress.find(p => p.task_id === taskId);
    return taskProgress?.status || 'pending';
  };

  const getTaskNote = (taskId) => {
    const taskProgress = progress.find(p => p.task_id === taskId);
    return taskProgress?.admin_note;
  };

  return (
    <div className="p-4 space-y-4">
      <Link to={createPageUrl('AdminEmpleados')} className="flex items-center gap-2 text-gray-600 mb-4">
        <ArrowLeft className="w-5 h-5" />
        <span>Volver</span>
      </Link>

      {/* Employee info */}
      <MobileCard>
        <h2 className="text-lg font-medium text-gray-800">{employee.full_name || 'Sin nombre'}</h2>
        <p className="text-sm text-gray-500 mt-1">{employee.email}</p>
        {employee.phone && <p className="text-sm text-gray-500">{employee.phone}</p>}
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <label className="text-sm text-gray-600 block mb-2">Estado del empleado</label>
          <Select 
            value={employee.employee_status || 'pending'} 
            onValueChange={(val) => updateStatusMutation.mutate(val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </MobileCard>

      {/* Tasks progress */}
      <h3 className="text-base font-medium text-gray-800 mt-6">Progreso de aplicación</h3>
      
      <div className="space-y-3">
        {tasks.map(task => {
          const status = getTaskStatus(task.id);
          const note = getTaskNote(task.id);
          const isSelected = selectedTaskId === task.id;
          
          return (
            <MobileCard key={task.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-base text-gray-800">{task.title}</h4>
                  <div className="mt-2">
                    <StatusBadge status={status} />
                  </div>
                  {note && status === 'needs_fix' && (
                    <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">{note}</p>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => updateTaskMutation.mutate({ taskId: task.id, status: 'completed' })}
                    className={`p-2 rounded ${status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedTaskId(isSelected ? null : task.id)}
                    className={`p-2 rounded ${status === 'needs_fix' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Textarea
                    placeholder="Nota para el empleado (qué debe corregir)"
                    value={taskNote}
                    onChange={(e) => setTaskNote(e.target.value)}
                    rows={2}
                    className="mb-3"
                  />
                  <Button
                    onClick={() => updateTaskMutation.mutate({ 
                      taskId: task.id, 
                      status: 'needs_fix', 
                      note: taskNote 
                    })}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                  >
                    Marcar como requiere corrección
                  </Button>
                </div>
              )}
            </MobileCard>
          );
        })}
      </div>
    </div>
  );
}

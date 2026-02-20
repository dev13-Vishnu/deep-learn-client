import { useState, useCallback } from 'react';
import { adminApi, type InstructorApplication } from '../../../api/admin.api';
import { useNotify } from '../../../notifications/useNotify';

interface UseApplicationActionsReturn {
  approveTarget: InstructorApplication | null;
  rejectTarget: InstructorApplication | null;
  isActioning: boolean;
  openApproveModal: (app: InstructorApplication) => void;
  openRejectModal: (app: InstructorApplication) => void;
  closeModals: () => void;
  confirmApprove: (onSuccess: (id: string) => void) => Promise<void>;
  confirmReject: (reason: string, onSuccess: (id: string) => void) => Promise<void>;
}

// No longer takes addToast as a parameter — uses the global notification system.
// Swapping to react-toastify only requires changing NotificationProvider.tsx.
export function useApplicationActions(): UseApplicationActionsReturn {
  const notify = useNotify();

  const [approveTarget, setApproveTarget] = useState<InstructorApplication | null>(null);
  const [rejectTarget, setRejectTarget] = useState<InstructorApplication | null>(null);
  const [isActioning, setIsActioning] = useState(false);

  const openApproveModal = useCallback((app: InstructorApplication) => {
    setApproveTarget(app);
  }, []);

  const openRejectModal = useCallback((app: InstructorApplication) => {
    setRejectTarget(app);
  }, []);

  const closeModals = useCallback(() => {
    setApproveTarget(null);
    setRejectTarget(null);
  }, []);

  const confirmApprove = useCallback(
    async (onSuccess: (id: string) => void) => {
      if (!approveTarget) return;
      const id = approveTarget.id;
      setIsActioning(true);
      try {
        await adminApi.approveApplication(id);
        closeModals();
        onSuccess(id);
        notify('Application approved. Instructor role has been granted.', 'success');
      } catch (err: any) {
        notify(
          err?.response?.data?.message ?? 'Failed to approve application.',
          'error'
        );
      } finally {
        setIsActioning(false);
      }
    },
    [approveTarget, closeModals, notify]
  );

  const confirmReject = useCallback(
    async (reason: string, onSuccess: (id: string) => void) => {
      if (!rejectTarget) return;
      const id = rejectTarget.id;
      setIsActioning(true);
      try {
        const { data } = await adminApi.rejectApplication(id, reason);
        closeModals();
        onSuccess(id);
        notify(
          `Application rejected. Applicant cannot reapply for ${data.cooldown.durationDays} days.`,
          'success'
        );
      } catch (err: any) {
        notify(
          err?.response?.data?.message ?? 'Failed to reject application.',
          'error'
        );
      } finally {
        setIsActioning(false);
      }
    },
    [rejectTarget, closeModals, notify]
  );

  return {
    approveTarget,
    rejectTarget,
    isActioning,
    openApproveModal,
    openRejectModal,
    closeModals,
    confirmApprove,
    confirmReject,
  };
}
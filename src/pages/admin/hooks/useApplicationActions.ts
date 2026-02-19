import { useState, useCallback } from 'react';
import { adminApi, type InstructorApplication } from '../../../api/admin.api';
import type { ToastType } from '../components/Toast';

interface UseApplicationActionsReturn {
  // Modal state
  approveTarget: InstructorApplication | null;
  rejectTarget: InstructorApplication | null;
  isActioning: boolean;

  // Open/close modals
  openApproveModal: (app: InstructorApplication) => void;
  openRejectModal: (app: InstructorApplication) => void;
  closeModals: () => void;

  // Confirm actions
  confirmApprove: (onSuccess: (id: string) => void) => Promise<void>;
  confirmReject: (reason: string, onSuccess: (id: string) => void) => Promise<void>;
}

type AddToast = (text: string, type: ToastType) => void;

export function useApplicationActions(addToast: AddToast): UseApplicationActionsReturn {
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
        onSuccess(id); // triggers optimistic update
        addToast('Application approved. Instructor role granted.', 'success');
      } catch (err: any) {
        addToast(
          err?.response?.data?.message ?? 'Failed to approve application.',
          'error'
        );
      } finally {
        setIsActioning(false);
      }
    },
    [approveTarget, closeModals, addToast]
  );

  const confirmReject = useCallback(
    async (reason: string, onSuccess: (id: string) => void) => {
      if (!rejectTarget) return;
      const id = rejectTarget.id;
      setIsActioning(true);

      try {
        const { data } = await adminApi.rejectApplication(id, reason);
        closeModals();
        onSuccess(id); // triggers optimistic update
        addToast(
          `Application rejected. Cooldown: ${data.cooldown.durationDays} days.`,
          'success'
        );
      } catch (err: any) {
        addToast(
          err?.response?.data?.message ?? 'Failed to reject application.',
          'error'
        );
      } finally {
        setIsActioning(false);
      }
    },
    [rejectTarget, closeModals, addToast]
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
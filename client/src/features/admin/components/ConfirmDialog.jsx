import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm'} size="sm">
      <p className="text-gray-300 mb-6">{message || 'Are you sure? This action cannot be undone.'}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} isLoading={loading}>Delete</Button>
      </div>
    </Modal>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input, Select, Badge, Modal } from '@/components/ui';
import AdminDataTable from '@/features/admin/components/AdminDataTable';
import ConfirmDialog from '@/features/admin/components/ConfirmDialog';
import adminService from '@/features/admin/services/adminService';
import { useToast } from '@/hooks/useToast';

const ACTIVE_OPTIONS = [
  { value: 1, label: 'Active' },
  { value: 0, label: 'Inactive' },
];

const POLL_TYPE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'trophy', label: 'Trophy (World Cup)' },
];

const emptyForm = { title: '', description: '', expires_at: '', is_active: 1, poll_type: 'default' };

export default function AdminPollsPage() {
  const { showToast } = useToast();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editPoll, setEditPoll] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [options, setOptions] = useState([{ option_text: '' }]);

  const fetchPolls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getAllPolls();
      const data = res.data?.data;
      setPolls(Array.isArray(data) ? data : data?.polls || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load polls');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const openCreate = () => {
    setEditPoll(null);
    setForm(emptyForm);
    setOptions([{ option_text: '' }, { option_text: '' }]);
    setShowForm(true);
  };

  const openEdit = (poll) => {
    setEditPoll(poll);
    setForm({
      title: poll.title || '',
      description: poll.description || '',
      expires_at: poll.expires_at ? poll.expires_at.slice(0, 16) : '',
      is_active: poll.is_active != null ? Number(poll.is_active) : 1,
      poll_type: poll.poll_type || 'default',
    });
    const existingOptions = Array.isArray(poll.options) ? poll.options.map((o) => ({ option_text: o.option_text || '', trophy_count: o.trophy_count || 0 })) : [{ option_text: '', trophy_count: 0 }, { option_text: '', trophy_count: 0 }];
    setOptions(existingOptions.length >= 2 ? existingOptions : [{ option_text: '' }, { option_text: '' }]);
    setShowForm(true);
  };

  const addOption = () => {
    setOptions((prev) => [...prev, { option_text: '', trophy_count: 0 }]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOption = (index, field, value) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validOptions = options.filter((o) => o.option_text.trim());
    if (validOptions.length < 2) {
      showToast('Please add at least 2 options', 'error');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        title: form.title,
        description: form.description,
        poll_type: form.poll_type,
        is_active: Number(form.is_active),
        expires_at: form.expires_at || null,
        options: validOptions.map(o => ({
          option_text: o.option_text,
          trophy_count: form.poll_type === 'trophy' ? (parseInt(o.trophy_count) || 0) : 0,
        })),
      };
      if (editPoll) {
        await adminService.updatePoll(editPoll.id, payload);
        showToast('Poll updated successfully', 'success');
      } else {
        await adminService.createPoll(payload);
        showToast('Poll created successfully', 'success');
      }
      setShowForm(false);
      fetchPolls();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save poll', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await adminService.deletePoll(deleteTarget.id);
      showToast('Poll deleted successfully', 'success');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchPolls();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete poll', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const getTotalVotes = (poll) => {
    if (!Array.isArray(poll.options)) return 0;
    return poll.options.reduce((sum, o) => sum + (o.votes ?? o.vote_count ?? 0), 0);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'title',
      label: 'Title',
      render: (val) => <span className="text-white font-medium">{val}</span>,
    },
    {
      key: 'options',
      label: 'Options',
      render: (val) => <span className="text-gray-300">{Array.isArray(val) ? val.length : 0}</span>,
    },
    {
      key: 'total_votes',
      label: 'Votes',
      render: (_, row) => <span className="text-gray-300">{getTotalVotes(row)}</span>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (val) =>
        Number(val) === 1 ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="neutral">Inactive</Badge>
        ),
    },
    {
      key: 'expires_at',
      label: 'Expires',
      render: (val) =>
        val ? (
          <span className="text-gray-300">{new Date(val).toLocaleDateString()}</span>
        ) : (
          <span className="text-gray-500">&mdash;</span>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => { setDeleteTarget(row); setShowDelete(true); }}>Delete</Button>
        </div>
      ),
    },
  ];

  const mobileRender = (row) => (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <span className="text-white font-semibold">{row.title}</span>
        {Number(row.is_active) === 1 ? (
          <Badge variant="success" size="sm">Active</Badge>
        ) : (
          <Badge variant="neutral" size="sm">Inactive</Badge>
        )}
      </div>
      <div className="flex gap-3 text-sm text-gray-400">
        <span>{Array.isArray(row.options) ? row.options.length : 0} options</span>
        <span>&middot;</span>
        <span>{getTotalVotes(row)} votes</span>
        {row.expires_at && (
          <>
            <span>&middot;</span>
            <span>Expires {new Date(row.expires_at).toLocaleDateString()}</span>
          </>
        )}
      </div>
      <div className="flex gap-2 pt-1">
        <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => { setDeleteTarget(row); setShowDelete(true); }}>Delete</Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Polls</h1>
        <Button variant="primary" onClick={openCreate}>+ New Poll</Button>
      </div>

      <Card padding="md">
        <AdminDataTable
          columns={columns}
          data={polls}
          loading={loading}
          error={error}
          emptyTitle="No polls found"
          emptyDescription="Create your first poll to get started."
          mobileRender={mobileRender}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editPoll ? 'Edit Poll' : 'New Poll'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="Poll title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-100 placeholder:text-gray-500 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-y min-h-[80px]"
              placeholder="Poll description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Poll Type"
              options={POLL_TYPE_OPTIONS}
              value={form.poll_type}
              onChange={(e) => setForm({ ...form, poll_type: e.target.value })}
            />
            <Input
              label="Expires At"
              type="datetime-local"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
            />
            <Select
              label="Status"
              options={ACTIVE_OPTIONS}
              value={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.value })}
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-gray-400">Options</label>
              <Button type="button" size="sm" variant="ghost" onClick={addOption}>+ Add Option</Button>
            </div>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    placeholder={`Option ${i + 1}`}
                    value={opt.option_text}
                    onChange={(e) => updateOption(i, 'option_text', e.target.value)}
                    required
                  />
                  {form.poll_type === 'trophy' && (
                    <div className="w-24 shrink-0">
                      <Input
                        type="number"
                        placeholder="🏆"
                        value={opt.trophy_count || ''}
                        onChange={(e) => updateOption(i, 'trophy_count', e.target.value)}
                      />
                    </div>
                  )}
                  {options.length > 2 && (
                    <Button type="button" size="sm" variant="danger" onClick={() => removeOption(i)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="lg" isLoading={saving}>
              {editPoll ? 'Update Poll' : 'Create Poll'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setDeleteTarget(null); }}
        onConfirm={handleDelete}
        title="Delete Poll"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All votes will be lost.`}
        loading={deleting}
      />
    </div>
  );
}

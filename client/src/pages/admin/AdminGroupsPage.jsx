import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input, Modal } from '@/components/ui';
import AdminDataTable from '@/features/admin/components/AdminDataTable';
import ConfirmDialog from '@/features/admin/components/ConfirmDialog';
import adminService from '@/features/admin/services/adminService';
import { useToast } from '@/hooks/useToast';

export default function AdminGroupsPage() {
  const { showToast } = useToast();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [name, setName] = useState('');

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getGroups();
      const data = res.data?.data;
      const arr = Array.isArray(data) ? data : data?.groups || [];
      setGroups(arr);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const openCreate = () => {
    setEditGroup(null);
    setName('');
    setShowForm(true);
  };

  const openEdit = (group) => {
    setEditGroup(group);
    setName(group.name || '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editGroup) {
        await adminService.updateGroup(editGroup.id, { name });
        showToast('Group updated successfully', 'success');
      } else {
        await adminService.createGroup({ name });
        showToast('Group created successfully', 'success');
      }
      setShowForm(false);
      fetchGroups();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save group', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await adminService.deleteGroup(deleteTarget.id);
      showToast('Group deleted successfully', 'success');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchGroups();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete group', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'name',
      label: 'Name',
      render: (val) => <span className="text-white font-medium">{val}</span>,
    },
    {
      key: 'teams',
      label: 'Teams',
      render: (val) => <span className="text-gray-300">{Array.isArray(val) ? val.length : 0} teams</span>,
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
      <div className="flex justify-between items-center">
        <span className="text-white font-semibold">{row.name}</span>
        <span className="text-gray-400 text-sm">{Array.isArray(row.teams) ? row.teams.length : 0} teams</span>
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
        <h1 className="text-2xl font-bold text-white">Groups</h1>
        <Button variant="primary" onClick={openCreate}>+ New Group</Button>
      </div>

      <Card padding="md">
        <AdminDataTable
          columns={columns}
          data={groups}
          loading={loading}
          error={error}
          emptyTitle="No groups found"
          emptyDescription="Create your first group to get started."
          mobileRender={mobileRender}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editGroup ? 'Edit Group' : 'New Group'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Group Name"
            placeholder="e.g. Group A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="lg" isLoading={saving}>
              {editGroup ? 'Update Group' : 'Create Group'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setDeleteTarget(null); }}
        onConfirm={handleDelete}
        title="Delete Group"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All teams in this group will be unassigned.`}
        loading={deleting}
      />
    </div>
  );
}

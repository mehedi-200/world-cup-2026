import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input, Select, Badge, Modal } from '@/components/ui';
import AdminDataTable from '@/features/admin/components/AdminDataTable';
import ConfirmDialog from '@/features/admin/components/ConfirmDialog';
import adminService from '@/features/admin/services/adminService';
import { useToast } from '@/hooks/useToast';

const ROLE_FILTER_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
];

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
];

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleTarget, setRoleTarget] = useState(null);
  const [newRole, setNewRole] = useState('user');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: 20 };
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;
      const res = await adminService.getUsers(params);
      const data = res.data?.data;
      setUsers(Array.isArray(data) ? data : data?.users || []);
      setPagination(res.data?.pagination || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const openRoleModal = (user) => {
    setRoleTarget(user);
    setNewRole(user.role || 'user');
    setShowRoleModal(true);
  };

  const handleRoleChange = async () => {
    try {
      setSaving(true);
      await adminService.updateUserRole(roleTarget.id, newRole);
      showToast('User role updated successfully', 'success');
      setShowRoleModal(false);
      setRoleTarget(null);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update role', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await adminService.deleteUser(deleteTarget.id);
      showToast('User deleted successfully', 'success');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = pagination?.totalPages || pagination?.total_pages || 1;

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'username',
      label: 'Username',
      render: (val) => <span className="text-white font-medium">{val}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (val) => <span className="text-gray-300">{val}</span>,
    },
    {
      key: 'role',
      label: 'Role',
      render: (val) => (
        <Badge variant={val === 'admin' ? 'warning' : 'neutral'}>
          {val || 'user'}
        </Badge>
      ),
    },
    {
      key: 'total_points',
      label: 'Points',
      render: (val) => <span className="text-white font-bold">{val ?? 0}</span>,
    },
    {
      key: 'predictions_count',
      label: 'Predictions',
      render: (val) => <span className="text-gray-300">{val ?? 0}</span>,
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (val) => <span className="text-gray-400 text-sm">{val ? new Date(val).toLocaleDateString() : '—'}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openRoleModal(row)}>Change Role</Button>
          <Button size="sm" variant="danger" onClick={() => { setDeleteTarget(row); setShowDelete(true); }}>Delete</Button>
        </div>
      ),
    },
  ];

  const mobileRender = (row) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-white font-semibold">{row.username}</span>
          <p className="text-gray-400 text-sm">{row.email}</p>
        </div>
        <Badge variant={row.is_admin === 1 ? 'gold' : 'neutral'} size="sm">
          {row.is_admin === 1 ? 'Admin' : 'User'}
        </Badge>
      </div>
      <div className="flex gap-3 text-sm text-gray-400">
        <span>{row.total_points ?? 0} pts</span>
        <span>&middot;</span>
        <span>{row.predictions_count ?? 0} predictions</span>
      </div>
      <div className="flex gap-2 pt-1">
        <Button size="sm" variant="secondary" onClick={() => openRoleModal(row)}>Change Role</Button>
        <Button size="sm" variant="danger" onClick={() => { setDeleteTarget(row); setShowDelete(true); }}>Delete</Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Users</h1>
      </div>

      {/* Filters */}
      <Card padding="md" className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={ROLE_FILTER_OPTIONS}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card padding="md">
        <AdminDataTable
          columns={columns}
          data={users}
          loading={loading}
          error={error}
          emptyTitle="No users found"
          emptyDescription="No users match your search criteria."
          mobileRender={mobileRender}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-4 border-t border-white/10 mt-4">
            <Button
              size="sm"
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      {/* Change Role Modal */}
      <Modal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} title="Change User Role" size="sm">
        <div className="space-y-4">
          <p className="text-gray-300">
            Change role for <span className="text-white font-semibold">{roleTarget?.username}</span>
          </p>
          <Select
            label="Role"
            options={ROLE_OPTIONS}
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => setShowRoleModal(false)}>Cancel</Button>
            <Button variant="primary" size="lg" isLoading={saving} onClick={handleRoleChange}>Save Role</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setDeleteTarget(null); }}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.username}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}

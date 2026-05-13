import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input, Select, Badge, Modal } from '@/components/ui';
import AdminDataTable from '@/features/admin/components/AdminDataTable';
import ConfirmDialog from '@/features/admin/components/ConfirmDialog';
import adminService from '@/features/admin/services/adminService';
import { useToast } from '@/hooks/useToast';

const emptyForm = { name: '', code: '', flag_url: '', group_id: '' };
const emptyStandings = { played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0 };

export default function AdminTeamsPage() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [showStandings, setShowStandings] = useState(false);
  const [standingsTeam, setStandingsTeam] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [standings, setStandings] = useState(emptyStandings);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getTeams();
      const data = res.data?.data;
      setTeams(Array.isArray(data) ? data : data?.teams || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await adminService.getGroups();
      const data = res.data?.data;
      const arr = Array.isArray(data) ? data : data?.groups || [];
      setGroups(arr);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchTeams();
    fetchGroups();
  }, [fetchTeams, fetchGroups]);

  const groupOptions = groups.map((g) => ({ value: g.id, label: g.name }));

  const openCreate = () => {
    setEditTeam(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (team) => {
    setEditTeam(team);
    setForm({
      name: team.name || '',
      code: team.code || '',
      flag_url: team.flag_url || '',
      group_id: team.group_id || '',
    });
    setShowForm(true);
  };

  const openStandings = (team) => {
    setStandingsTeam(team);
    setStandings({
      played: team.played ?? 0,
      won: team.won ?? 0,
      drawn: team.drawn ?? 0,
      lost: team.lost ?? 0,
      goals_for: team.goals_for ?? 0,
      goals_against: team.goals_against ?? 0,
    });
    setShowStandings(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editTeam) {
        await adminService.updateTeam(editTeam.id, form);
        showToast('Team updated successfully', 'success');
      } else {
        await adminService.createTeam(form);
        showToast('Team created successfully', 'success');
      }
      setShowForm(false);
      fetchTeams();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save team', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStandingsSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {};
      Object.keys(standings).forEach((k) => {
        payload[k] = Number(standings[k]);
      });
      await adminService.updateStandings(standingsTeam.id, payload);
      showToast('Standings updated successfully', 'success');
      setShowStandings(false);
      fetchTeams();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update standings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await adminService.deleteTeam(deleteTarget.id);
      showToast('Team deleted successfully', 'success');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchTeams();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete team', 'error');
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
      key: 'code',
      label: 'Code',
      render: (val) => <Badge variant="neutral">{val || '—'}</Badge>,
    },
    {
      key: 'group_name',
      label: 'Group',
      render: (val) => <span className="text-gray-300">{val || '—'}</span>,
    },
    { key: 'played', label: 'P' },
    { key: 'won', label: 'W' },
    { key: 'drawn', label: 'D' },
    { key: 'lost', label: 'L' },
    {
      key: 'pts',
      label: 'Pts',
      render: (val) => <span className="text-white font-bold">{val ?? 0}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
          <Button size="sm" variant="gold" onClick={() => openStandings(row)}>Standings</Button>
          <Button size="sm" variant="danger" onClick={() => { setDeleteTarget(row); setShowDelete(true); }}>Delete</Button>
        </div>
      ),
    },
  ];

  const mobileRender = (row) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-white font-semibold">{row.name}</span>
        <Badge variant="neutral" size="sm">{row.code || '—'}</Badge>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">{row.group_name || 'No group'}</span>
        <span className="text-white font-bold">{row.pts ?? 0} pts</span>
      </div>
      <div className="flex gap-2 pt-1">
        <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
        <Button size="sm" variant="gold" onClick={() => openStandings(row)}>Standings</Button>
        <Button size="sm" variant="danger" onClick={() => { setDeleteTarget(row); setShowDelete(true); }}>Delete</Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Teams</h1>
        <Button variant="primary" onClick={openCreate}>+ New Team</Button>
      </div>

      <Card padding="md">
        <AdminDataTable
          columns={columns}
          data={teams}
          loading={loading}
          error={error}
          emptyTitle="No teams found"
          emptyDescription="Create your first team to get started."
          mobileRender={mobileRender}
        />
      </Card>

      {/* Create / Edit Team Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editTeam ? 'Edit Team' : 'New Team'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Team Name"
            placeholder="e.g. Brazil"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Code"
            placeholder="e.g. BRA"
            maxLength={3}
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            required
          />
          <Input
            label="Flag URL"
            placeholder="https://..."
            value={form.flag_url}
            onChange={(e) => setForm({ ...form, flag_url: e.target.value })}
          />
          <Select
            label="Group"
            options={groupOptions}
            placeholder="Select group"
            value={form.group_id}
            onChange={(e) => setForm({ ...form, group_id: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="lg" isLoading={saving}>
              {editTeam ? 'Update Team' : 'Create Team'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Standings Modal */}
      <Modal isOpen={showStandings} onClose={() => setShowStandings(false)} title={`Standings: ${standingsTeam?.name || ''}`} size="md">
        <form onSubmit={handleStandingsSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Played"
              type="number"
              min="0"
              value={standings.played}
              onChange={(e) => setStandings({ ...standings, played: e.target.value })}
            />
            <Input
              label="Won"
              type="number"
              min="0"
              value={standings.won}
              onChange={(e) => setStandings({ ...standings, won: e.target.value })}
            />
            <Input
              label="Drawn"
              type="number"
              min="0"
              value={standings.drawn}
              onChange={(e) => setStandings({ ...standings, drawn: e.target.value })}
            />
            <Input
              label="Lost"
              type="number"
              min="0"
              value={standings.lost}
              onChange={(e) => setStandings({ ...standings, lost: e.target.value })}
            />
            <Input
              label="Goals For"
              type="number"
              min="0"
              value={standings.goals_for}
              onChange={(e) => setStandings({ ...standings, goals_for: e.target.value })}
            />
            <Input
              label="Goals Against"
              type="number"
              min="0"
              value={standings.goals_against}
              onChange={(e) => setStandings({ ...standings, goals_against: e.target.value })}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowStandings(false)}>Cancel</Button>
            <Button type="submit" variant="gold" size="lg" isLoading={saving}>Update Standings</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setDeleteTarget(null); }}
        onConfirm={handleDelete}
        title="Delete Team"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}

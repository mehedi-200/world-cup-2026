import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input, Select, Badge, Modal, Loader } from '@/components/ui';
import AdminDataTable from '@/features/admin/components/AdminDataTable';
import ConfirmDialog from '@/features/admin/components/ConfirmDialog';
import adminService from '@/features/admin/services/adminService';
import { useToast } from '@/hooks/useToast';

const STAGE_OPTIONS = [
  { value: 'group', label: 'Group Stage' },
  { value: 'round_of_32', label: 'Round of 32' },
  { value: 'round_of_16', label: 'Round of 16' },
  { value: 'quarter_final', label: 'Quarter Final' },
  { value: 'semi_final', label: 'Semi Final' },
  { value: 'third_place', label: 'Third Place' },
  { value: 'final', label: 'Final' },
];

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'live', label: 'Live' },
  { value: 'half_time', label: 'Half Time' },
  { value: 'completed', label: 'Completed' },
  { value: 'postponed', label: 'Postponed' },
];

const STATUS_BADGE = {
  completed: 'success',
  live: 'danger',
  scheduled: 'info',
  half_time: 'warning',
  postponed: 'neutral',
};

const emptyForm = {
  home_team_id: '',
  away_team_id: '',
  match_date: '',
  venue: '',
  city: '',
  stage: 'group',
  status: 'scheduled',
  home_score: '',
  away_score: '',
};

export default function AdminMatchesPage() {
  const { showToast } = useToast();
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMatch, setEditMatch] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getMatches({ limit: 100 });
      const data = res.data?.data;
      setMatches(Array.isArray(data) ? data : data?.matches || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await adminService.getTeams();
      const data = res.data?.data;
      setTeams(Array.isArray(data) ? data : data?.teams || []);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, [fetchMatches, fetchTeams]);

  const teamOptions = teams.map((t) => ({ value: t.id, label: t.name }));

  const openCreate = () => {
    setEditMatch(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (match) => {
    setEditMatch(match);
    setForm({
      home_team_id: match.home_team_id || '',
      away_team_id: match.away_team_id || '',
      match_date: match.match_date ? match.match_date.slice(0, 16) : '',
      venue: match.venue || '',
      city: match.city || '',
      stage: match.stage || 'group',
      status: match.status || 'scheduled',
      home_score: match.home_score ?? '',
      away_score: match.away_score ?? '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...form,
        home_score: form.home_score !== '' ? Number(form.home_score) : null,
        away_score: form.away_score !== '' ? Number(form.away_score) : null,
      };
      if (editMatch) {
        await adminService.updateMatch(editMatch.id, payload);
        showToast('Match updated successfully', 'success');
      } else {
        await adminService.createMatch(payload);
        showToast('Match created successfully', 'success');
      }
      setShowForm(false);
      fetchMatches();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save match', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await adminService.deleteMatch(deleteTarget.id);
      showToast('Match deleted successfully', 'success');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchMatches();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete match', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'home_team_name',
      label: 'Match',
      render: (_, row) => (
        <span className="text-gray-100 font-medium">
          {row.home_team_name || 'TBD'} <span className="text-gray-500">vs</span> {row.away_team_name || 'TBD'}
        </span>
      ),
    },
    {
      key: 'home_score',
      label: 'Score',
      render: (_, row) =>
        row.home_score != null && row.away_score != null ? (
          <span className="font-mono font-bold text-white">{row.home_score} - {row.away_score}</span>
        ) : (
          <span className="text-gray-500">&mdash;</span>
        ),
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (val) => <Badge variant="neutral">{val?.replace(/_/g, ' ') || 'N/A'}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge variant={STATUS_BADGE[val] || 'neutral'}>{val || 'N/A'}</Badge>,
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
        <span className="text-white font-semibold">
          {row.home_team_name || 'TBD'} vs {row.away_team_name || 'TBD'}
        </span>
        {row.home_score != null && row.away_score != null && (
          <span className="font-mono font-bold text-white">{row.home_score} - {row.away_score}</span>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge variant="neutral" size="sm">{row.stage?.replace(/_/g, ' ') || 'N/A'}</Badge>
        <Badge variant={STATUS_BADGE[row.status] || 'neutral'} size="sm">{row.status || 'N/A'}</Badge>
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
        <h1 className="text-2xl font-bold text-white">Matches</h1>
        <Button variant="primary" onClick={openCreate}>+ New Match</Button>
      </div>

      <Card padding="md">
        <AdminDataTable
          columns={columns}
          data={matches}
          loading={loading}
          error={error}
          emptyTitle="No matches found"
          emptyDescription="Create your first match to get started."
          mobileRender={mobileRender}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editMatch ? 'Edit Match' : 'New Match'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Home Team"
              options={teamOptions}
              placeholder="Select home team"
              value={form.home_team_id}
              onChange={(e) => setForm({ ...form, home_team_id: e.target.value })}
              required
            />
            <Select
              label="Away Team"
              options={teamOptions}
              placeholder="Select away team"
              value={form.away_team_id}
              onChange={(e) => setForm({ ...form, away_team_id: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Match Date"
              type="datetime-local"
              value={form.match_date}
              onChange={(e) => setForm({ ...form, match_date: e.target.value })}
              required
            />
            <Select
              label="Stage"
              options={STAGE_OPTIONS}
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Venue"
              placeholder="Stadium name"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            />
            <Input
              label="City"
              placeholder="City name"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Home Score"
              type="number"
              min="0"
              value={form.home_score}
              onChange={(e) => setForm({ ...form, home_score: e.target.value })}
            />
            <Input
              label="Away Score"
              type="number"
              min="0"
              value={form.away_score}
              onChange={(e) => setForm({ ...form, away_score: e.target.value })}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="lg" isLoading={saving}>
              {editMatch ? 'Update Match' : 'Create Match'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setDeleteTarget(null); }}
        onConfirm={handleDelete}
        title="Delete Match"
        message={`Are you sure you want to delete this match? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}

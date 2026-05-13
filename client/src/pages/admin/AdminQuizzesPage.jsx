import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input, Select, Badge, Modal } from '@/components/ui';
import AdminDataTable from '@/features/admin/components/AdminDataTable';
import ConfirmDialog from '@/features/admin/components/ConfirmDialog';
import adminService from '@/features/admin/services/adminService';
import { useToast } from '@/hooks/useToast';

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const ACTIVE_OPTIONS = [
  { value: 1, label: 'Active' },
  { value: 0, label: 'Inactive' },
];

const CORRECT_OPTIONS = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
  { value: 'c', label: 'C' },
  { value: 'd', label: 'D' },
];

const DIFFICULTY_BADGE = {
  easy: 'success',
  medium: 'warning',
  hard: 'danger',
};

const emptyQuizForm = { title: '', description: '', difficulty: 'easy', is_active: 1 };
const emptyQuestion = { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'a', points: 10 };

export default function AdminQuizzesPage() {
  const { showToast } = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editQuiz, setEditQuiz] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyQuizForm);

  // Questions modal state
  const [showQuestions, setShowQuestions] = useState(false);
  const [questionsQuiz, setQuestionsQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [savingQuestion, setSavingQuestion] = useState(false);

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getAllQuizzes();
      const data = res.data?.data;
      setQuizzes(Array.isArray(data) ? data : data?.quizzes || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const openCreate = () => {
    setEditQuiz(null);
    setForm(emptyQuizForm);
    setShowForm(true);
  };

  const openEdit = (quiz) => {
    setEditQuiz(quiz);
    setForm({
      title: quiz.title || '',
      description: quiz.description || '',
      difficulty: quiz.difficulty || 'easy',
      is_active: quiz.is_active != null ? Number(quiz.is_active) : 1,
    });
    setShowForm(true);
  };

  const openQuestions = (quiz) => {
    setQuestionsQuiz(quiz);
    setQuestions(Array.isArray(quiz.questions) ? quiz.questions : []);
    setQuestionForm(emptyQuestion);
    setShowQuestions(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = { ...form, is_active: Number(form.is_active) };
      if (editQuiz) {
        await adminService.updateQuiz(editQuiz.id, payload);
        showToast('Quiz updated successfully', 'success');
        setShowForm(false);
        fetchQuizzes();
      } else {
        const res = await adminService.createQuiz(payload);
        showToast('Quiz created successfully', 'success');
        setShowForm(false);
        fetchQuizzes();
        // Open add questions modal for newly created quiz
        const created = res.data?.data || res.data;
        if (created?.id) {
          setQuestionsQuiz(created);
          setQuestions([]);
          setQuestionForm(emptyQuestion);
          setShowQuestions(true);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save quiz', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!questionsQuiz?.id) return;
    try {
      setSavingQuestion(true);
      const payload = { ...questionForm, points: Number(questionForm.points) };
      await adminService.addQuestion(questionsQuiz.id, payload);
      showToast('Question added successfully', 'success');
      setQuestions((prev) => [...prev, { ...payload, id: Date.now() }]);
      setQuestionForm(emptyQuestion);
      fetchQuizzes();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add question', 'error');
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await adminService.deleteQuestion(questionId);
      showToast('Question deleted', 'success');
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      fetchQuizzes();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete question', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await adminService.deleteQuiz(deleteTarget.id);
      showToast('Quiz deleted successfully', 'success');
      setShowDelete(false);
      setDeleteTarget(null);
      fetchQuizzes();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete quiz', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'title',
      label: 'Title',
      render: (val) => <span className="text-white font-medium">{val}</span>,
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (val) => <Badge variant={DIFFICULTY_BADGE[val] || 'neutral'}>{val || 'N/A'}</Badge>,
    },
    {
      key: 'question_count',
      label: 'Questions',
      render: (val, row) => <span className="text-gray-300">{val ?? row.questions?.length ?? 0}</span>,
    },
    {
      key: 'attempt_count',
      label: 'Attempts',
      render: (val) => <span className="text-gray-300">{val ?? 0}</span>,
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
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
          <Button size="sm" variant="gold" onClick={() => openQuestions(row)}>Questions</Button>
          <Button size="sm" variant="danger" onClick={() => { setDeleteTarget(row); setShowDelete(true); }}>Delete</Button>
        </div>
      ),
    },
  ];

  const mobileRender = (row) => (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <span className="text-white font-semibold">{row.title}</span>
        <Badge variant={DIFFICULTY_BADGE[row.difficulty] || 'neutral'} size="sm">{row.difficulty}</Badge>
      </div>
      <div className="flex gap-2 items-center text-sm text-gray-400">
        <span>{row.question_count ?? row.questions?.length ?? 0} questions</span>
        <span>&middot;</span>
        <span>{row.attempt_count ?? 0} attempts</span>
        <span>&middot;</span>
        {Number(row.is_active) === 1 ? (
          <Badge variant="success" size="sm">Active</Badge>
        ) : (
          <Badge variant="neutral" size="sm">Inactive</Badge>
        )}
      </div>
      <div className="flex gap-2 pt-1">
        <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
        <Button size="sm" variant="gold" onClick={() => openQuestions(row)}>Questions</Button>
        <Button size="sm" variant="danger" onClick={() => { setDeleteTarget(row); setShowDelete(true); }}>Delete</Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Quizzes</h1>
        <Button variant="primary" onClick={openCreate}>+ New Quiz</Button>
      </div>

      <Card padding="md">
        <AdminDataTable
          columns={columns}
          data={quizzes}
          loading={loading}
          error={error}
          emptyTitle="No quizzes found"
          emptyDescription="Create your first quiz to get started."
          mobileRender={mobileRender}
        />
      </Card>

      {/* Create / Edit Quiz Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editQuiz ? 'Edit Quiz' : 'New Quiz'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="Quiz title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-100 placeholder:text-gray-500 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-y min-h-[80px]"
              placeholder="Quiz description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Difficulty"
              options={DIFFICULTY_OPTIONS}
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            />
            <Select
              label="Status"
              options={ACTIVE_OPTIONS}
              value={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.value })}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="lg" isLoading={saving}>
              {editQuiz ? 'Update Quiz' : 'Create Quiz'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Questions Modal */}
      <Modal isOpen={showQuestions} onClose={() => setShowQuestions(false)} title={`Questions: ${questionsQuiz?.title || ''}`} size="lg">
        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Existing questions */}
          {questions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Existing Questions ({questions.length})</h4>
              {questions.map((q, i) => (
                <div key={q.id || i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-100 text-sm font-medium">{i + 1}. {q.question_text}</span>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteQuestion(q.id)}>Remove</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
                    <span>A: {q.option_a}</span>
                    <span>B: {q.option_b}</span>
                    <span>C: {q.option_c}</span>
                    <span>D: {q.option_d}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <Badge variant="success" size="sm">Answer: {q.correct_option?.toUpperCase()}</Badge>
                    <Badge variant="info" size="sm">{q.points ?? 10} pts</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add question form */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Add New Question</h4>
            <form onSubmit={handleAddQuestion} className="space-y-3">
              <Input
                label="Question Text"
                placeholder="Enter the question..."
                value={questionForm.question_text}
                onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Option A"
                  placeholder="Option A"
                  value={questionForm.option_a}
                  onChange={(e) => setQuestionForm({ ...questionForm, option_a: e.target.value })}
                  required
                />
                <Input
                  label="Option B"
                  placeholder="Option B"
                  value={questionForm.option_b}
                  onChange={(e) => setQuestionForm({ ...questionForm, option_b: e.target.value })}
                  required
                />
                <Input
                  label="Option C"
                  placeholder="Option C"
                  value={questionForm.option_c}
                  onChange={(e) => setQuestionForm({ ...questionForm, option_c: e.target.value })}
                  required
                />
                <Input
                  label="Option D"
                  placeholder="Option D"
                  value={questionForm.option_d}
                  onChange={(e) => setQuestionForm({ ...questionForm, option_d: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Correct Answer"
                  options={CORRECT_OPTIONS}
                  value={questionForm.correct_option}
                  onChange={(e) => setQuestionForm({ ...questionForm, correct_option: e.target.value })}
                />
                <Input
                  label="Points"
                  type="number"
                  min="1"
                  value={questionForm.points}
                  onChange={(e) => setQuestionForm({ ...questionForm, points: e.target.value })}
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="submit" variant="primary" size="lg" isLoading={savingQuestion}>Add Question</Button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10 mt-4">
          <Button variant="secondary" onClick={() => setShowQuestions(false)}>Done</Button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setDeleteTarget(null); }}
        onConfirm={handleDelete}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All questions and attempts will be lost.`}
        loading={deleting}
      />
    </div>
  );
}

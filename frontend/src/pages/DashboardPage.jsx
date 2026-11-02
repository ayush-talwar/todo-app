import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import TaskFilters from '../components/TaskFilters';
import { getErrorMessage } from '../utils/errors';
import { btnGhost } from '../ui';

export default function DashboardPage() {
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0); // Key to force re-render
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    ordering: ''
  });

 useEffect(() => {
  let ignore = false;
  async function load() {
    try{
      const response = await getTasks(filters);
      if (!ignore) {
        setTasks(response.data);
        setError('');
      }
     } catch (err) {
        if (!ignore) setError(getErrorMessage(err, 'Could not load tasks.'));
      } finally {
        if (!ignore) setLoading(false);
      }
    }
  load();
  return () => {
    ignore = true;
  }
 }, [filters, reloadKey]);

  const runAction = async (action) => {
    setError('');
    try{
      await action();
      setReloadKey(prevKey => prevKey + 1); // Trigger re-render to reload tasks
      return true;
    } catch (error) {
      setError(getErrorMessage(error));
      return false;
    }
  };

  const handleAddOrUpdate = (formData) => 
    runAction(async () => {
    if (editingTask) {
      await updateTask(editingTask.id, formData);
      setEditingTask(null);
    } else {
      await createTask(formData);
    }
  });

  const handleToggleStatus = (task) => 
    runAction(() =>
    updateTask(task.id, {
      status: task.status === 'completed' ? 'pending' : 'completed',
    })
  );

  const handleDelete = (id) => runAction(() => deleteTask(id));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <button className={btnGhost} onClick={logout}>Logout</button>
      </div>
      {error && (
        <div
        role="alert"
        className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          <span>{error}</span>
          <button onClick={() => setError('')} aria-label="Dismiss" className="cursor-pointer text-lg leading-none">x</button>
        </div>
      )}
      <TaskForm
        onSubmit={handleAddOrUpdate}
        onCancel={() => setEditingTask(null)}
        initialData={editingTask || {}}
        key={editingTask?.id || 'new'}
      />

        <TaskFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <p className="py-8 text-center text-gray-500">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="py-8 text-center text-gray-500">No tasks yet.</p>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              onEdit={setEditingTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

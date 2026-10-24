import { useState, useEffect } from 'react';
import { GrAddCircle } from "react-icons/gr";
import './TaskList.css';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [showForm, setShowForm] = useState(false);

    const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchTasks();
  }, [statusFilter]); // on filter change re-render the component

  const handleAddOrUpdate = async (formData) => {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
        setEditingTask(null);
      } else {
        await createTask(formData);
      }
      setShowForm(false);
      fetchTasks(); // refresh the page after update
    };
  
    const handleToggleStatus = async (task) => {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTask(task.id, { status: newStatus });
      fetchTasks(); // refresh the page after update
    };
  
    const handleDelete = async (taskId) => {
      await deleteTask(taskId);
      fetchTasks(); // refresh the page after deletion
    };

    return (
        <>
        <div>
      <label> Filter: </label> {" "}
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <div style={{ display: 'flex', alignItems: 'center' }}>
                <GrAddCircle size={24} style={{ cursor: 'pointer' }} onClick={() => setShowForm(true)} />
              </div>
        {showForm && (
              <TaskForm 
                onSubmit={handleAddOrUpdate}
                initialData = {editingTask || {} }
                key = { editingTask?.id || 'new' }
                onClose = {() => { setShowForm(false) }}
              />
            )}
    </div>
    {loading ? (
                <p>Loading...</p>
            ) : (
                tasks.length === 0 ? (
                    <p>No tasks yet...</p>
                ) : (
                    tasks.map((task) => (
                       <TaskItem 
                       key = { task.id }
                       task = { task }
                       onToggleStatus = { handleToggleStatus }
                        onDelete = { handleDelete }
                        onEdit = { handleAddOrUpdate }
                       /> 
                    ))
                )
    )}
    </>
    );
};
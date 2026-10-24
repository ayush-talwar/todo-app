import { useState } from 'react';
import { card, input, btnPrimary, btnGhost } from '../ui';

export default function TaskForm({ onSubmit, initialData = {}, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    priority: initialData.priority || 'medium',
    category: initialData.category || '',
    due_date: initialData.due_date || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success && !initialData.id) {
      // reset only for "add new", not when editing
      setFormData({ title: '', description: '', priority: 'medium', category: '', due_date: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${card} grid gap-3`}>
      <input
        className={input}
        name="title"
        placeholder="Task title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        className={input}
        name="description"
        placeholder="Description (optional)"
        value={formData.description}
        onChange={handleChange}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <select className={input} name="priority" value={formData.priority} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        className={input}
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
      />
      <input
        className={input}
        name="due_date"
        type="date"
        value={formData.due_date}
        onChange={handleChange}
      />
      </div>
      <div className="flex gap-2">
        <button type="submit" className={btnPrimary}>
          {initialData.id ? 'Update Task' : 'Create Task'}
        </button>
        {initialData.id && (
          <button type="button" onClick={onCancel} className={btnGhost}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
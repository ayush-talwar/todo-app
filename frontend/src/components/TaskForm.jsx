import { useState } from 'react';
import './TaskForm.css';
import { MdOutlineClose } from "react-icons/md";


export default function TaskForm({ onSubmit, initialData = {}, onClose }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    priority: initialData.priority || 'medium',
    category: initialData.category || '',
    due_date: initialData.due_date || '',
  });

  const handleSubmit = (e) => {
   e.preventDefault();
   onSubmit(formData);
   if (!initialData.id) {
     setFormData({
       title: '',
       description: '',
       priority: 'medium',
       category: '',
       due_date: '',
     });
   }
  };

  const handleChange = (e) => {
     const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name]:value}));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button type="button" className="close-button" onClick={onClose}>
          <MdOutlineClose />
        </button>
        <h2>{initialData.id ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleSubmit}>
            <div class="mb-3">
        <input type="text"
         class="form-control"
          placeholder="What we want to do ?" 
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          />
      </div>
      <div class="mb-3">
        <textarea
         class="form-control" 
         rows="3" 
         placeholder="Description (Optional)" 
         name="description" 
         value={formData.description}
          onChange={handleChange} />
      </div>
        <select 
        class="form-select form-select-sm" 
        aria-label="Small select example"
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <br />
        <div class="input-group input-group-sm mb-3">
  <span class="input-group-text" id="inputGroup-sizing-sm">Category</span>
  <input type="text" 
  class="form-control" 
  aria-label="Sizing example input" 
  aria-describedby="inputGroup-sizing-sm" 
  name="category"
  value={formData.category}
  onChange={handleChange}
  />
</div>
<div>
  <label>Due Date:</label>
        <input
        style={{ marginLeft: '10px' }}
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
        />
        </div>
        <br />
        <button type="submit" className="btn btn-primary submit-button">
          {initialData.id ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};
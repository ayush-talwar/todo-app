import { input } from '../ui';

export default function TaskFilters({ filters, onChange }){
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  }

  return (
    <div className="my-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <select className={input} name="status" value={filters.status} onChange={handleChange}>
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      <select className={input} name="priority" value={filters.priority} onChange={handleChange}>
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <input
        className={input}
        name="category"
        placeholder="Filter by category"
        value={filters.category}
        onChange={handleChange}
      />

      <select className={input} name="ordering" value={filters.ordering} onChange={handleChange}>
        <option value="">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="due_date">Due date</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
};
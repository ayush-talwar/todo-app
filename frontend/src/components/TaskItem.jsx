import { card, btnPrimary, btnGhost, btnDanger } from '../ui';

const priorityBorder = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-green-500',
};
const priorityBadge = {
  high: 'bg-red-50 text-red-700 ring-red-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  low: 'bg-green-50 text-green-700 ring-green-200',
};
const badge =
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset';
const neutralBadge = 'bg-gray-50 text-gray-600 ring-gray-200';

export default function TaskItem({ task, onToggleStatus, onDelete, onEdit }) {
  const done = task.status === 'completed';
  const today = new Date().toLocaleDateString();
  const overdue = !done && task.due_date && task.due_date < today;

  return (
    <div className={`${card} flex flex-col gap-2 border-1-4 ${priorityBorder[task.priority]}`}>
      <h4 className={`font-semibold ${done ? 'text-gray-400 line-through' : ''}`}>
        {task.title}
      </h4>
      {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
      <div className="flex flex-wrap gap-1.5">
        <span className={`${badge} ${priorityBadge[task.priority]}`}>{task.priority}</span>
        {task.category && (
          <span className={`${badge} ${neutralBadge}`}>{task.category}</span>
        )}
        {task.due_date && (
          <span className={`${badge} ${overdue ? priorityBadge.high : neutralBadge}`}>
            {overdue ? 'Overdue: ' : 'Due: '}
            {task.due_date}
          </span>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <button className={btnPrimary} onClick={() => onToggleStatus(task)}>
          {done ? 'Mark Pending' : 'Mark Complete'}
        </button>
        <button className={btnGhost} onClick={() => onEdit(task)}>Edit</button>
        <button className={btnDanger} onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
}
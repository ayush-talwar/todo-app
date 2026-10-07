
export default function TaskItem({ task, onToggleStatus, onDelete, onEdit}) {
    const formatted_due_date = task.due_date ? new Date(task.due_date).toLocaleDateString() : null;
    
    return (
        <div style={{ border:'1px solid #ccc', padding: '10px', marginBottom: '8px' }}>
            <h4 style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                {task.title}
            </h4>
            {task.description && <p>{task.description}</p>}
            <small>
                Priority: {task.priority} | Category: {task.category}
                {" | "}
                Due Date: {formatted_due_date || 'No Due Date'}
            </small>
            <div>
                <button onClick={() => onToggleStatus(task)}>
                    {task.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
                </button>
                <button onClick={() => onEdit(task)}>Edit</button>
                <button onClick={() => onDelete(task.id)}>Delete</button>
            </div>
        </div>
    );
};
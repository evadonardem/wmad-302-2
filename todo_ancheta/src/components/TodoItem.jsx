const TodoItem = ({ todo, onToggle, onDelete }) => {
    return (
        <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                    // Increased size and margin for better click target
                    style={{ cursor: 'pointer', transform: 'scale(1.2)', marginRight: '15px' }} 
                />
                <span style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    // Changed to 'text' to match the updated App.jsx
                    color: todo.completed ? '#6c757d' : '#212529',
                    flexGrow: 1, // Allow text to take up space
                    wordBreak: 'break-word', // Prevent overflow with long words
                }}>
                    {todo.text}
                </span>
            </div>
            <button 
                onClick={() => onDelete(todo.id)}
                style={{
                    marginLeft: '15px', // Added margin for separation
                    backgroundColor: '#dc3545', // Danger red
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    flexShrink: 0, // Prevent button from shrinking
                }}
            >
                Delete
            </button>
        </div>
    );
};

export default TodoItem;
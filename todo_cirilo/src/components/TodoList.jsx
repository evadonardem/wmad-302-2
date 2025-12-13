const TodoList = ({ list = [], handleToggleComplete }) => {
    
    // Check if the list is empty
    if (list.length === 0) {
        return (
            // This div is rendered when the list is empty
            <div 
                style={{ 
                    backgroundColor: '#dc3545', // Bootstrap Red
                    color: 'white', 
                    padding: '10px', 
                    borderRadius: '5px',
                    textAlign: 'center',
                    margin: '15px 0'
                }}
            >
                No tasks yet, champ! Let's get something done. 🚀
            </div>
        );
    }

    // This block is rendered only when the list has items
    return (
        <>
            {list.map((item) => (
                // Added a class for better styling (optional)
                <div 
                    key={item.id} 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '8px 0',
                        borderBottom: '1px solid #eee' // Separator line
                    }}
                >
                    <input 
                        type="checkbox" 
                        checked={item.completed} 
                        // To make the checkbox interactive, you need an onClick handler 
                        // that calls a function passed from the parent component.
                        // I've added a prop named 'handleToggleComplete' for this purpose.
                        onChange={() => handleToggleComplete(item.id)}
                        style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                    />
                    <span 
                        style={{
                            // Apply a line-through style if the task is completed
                            textDecoration: item.completed ? 'line-through' : 'none',
                            color: item.completed ? '#6c757d' : '#212529' // Faded color for completed
                        }}
                    >
                        {item.task}
                    </span>
                </div>
            ))}
        </>
    );
};

export default TodoList;
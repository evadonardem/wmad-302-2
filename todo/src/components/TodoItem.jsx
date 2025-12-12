import { Form, Button, Badge } from "react-bootstrap";

const TodoItem = ({ todo, onToggle, onDelete }) => {
    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'secondary';
        }
    };

    const getCategoryIcon = (category) => {
        switch(category) {
            case 'Work': return 'bi-briefcase';
            case 'Personal': return 'bi-person';
            case 'Health': return 'bi-heart';
            case 'Learning': return 'bi-book';
            default: return 'bi-tag';
        }
    };

    return (
        <div className={`todo-item p-3 mb-3 border rounded shadow-sm ${todo.completed ? 'bg-light' : 'bg-white'}`}
             style={{
                 borderLeft: `4px solid ${
                     todo.priority === 'high' ? '#dc3545' : 
                     todo.priority === 'medium' ? '#ffc107' : '#0dcaf0'
                 }`,
                 transition: 'all 0.3s ease',
                 opacity: todo.completed ? 0.8 : 1
             }}>
            <div className="d-flex align-items-center">
                <Form.Check 
                    type="checkbox"
                    className="me-3"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                    style={{ transform: 'scale(1.2)' }}
                />
                
                <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                        <span 
                            className={`fw-bold ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}
                            style={{ fontSize: '1.1rem' }}
                        >
                            {todo.text}
                        </span>
                        
                        <Badge bg={getPriorityColor(todo.priority)} className="ms-2">
                            <i className={`bi bi-flag me-1`}></i>
                            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                        </Badge>
                        
                        <Badge bg="secondary" className="ms-2">
                            <i className={`bi ${getCategoryIcon(todo.category)} me-1`}></i>
                            {todo.category}
                        </Badge>
                    </div>
                    
                    {todo.createdAt && (
                        <small className="text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {new Date(todo.createdAt).toLocaleDateString()}
                        </small>
                    )}
                </div>
                
                <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => onDelete(todo.id)}
                    className="ms-3"
                    title="Delete task"
                >
                    <i className="bi bi-trash"></i>
                </Button>
            </div>
        </div>
    );
};

export default TodoItem;
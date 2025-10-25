import { Alert, ListGroup } from 'react-bootstrap';
import TodoItem from './TodoItem';

const TodoList = ({ todos = [], onToggle, onDelete }) => {
    if (!todos || todos.length === 0) {
        return <Alert variant="danger">I'm lazy to do a task today!!</Alert>;
    }

    return (
        <ListGroup>
            {todos.map((todo) => (
                <ListGroup.Item key={todo.id}>
                    <TodoItem 
                        todo={todo}
                        onToggle={onToggle}
                        onDelete={onDelete}
                    />
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default TodoList;

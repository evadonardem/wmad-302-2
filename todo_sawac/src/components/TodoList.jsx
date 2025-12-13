import TodoItem from "./TodoItem";
import { ListGroup } from "react-bootstrap";

function TodoList({ todos, toggleTodo, deleteTodo }) {
  return (
    <ListGroup className="mb-4">
      {todos.length === 0 && (
        <p className="text-center text-muted">No tasks yet. Add one below!</p>
      )}
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </ListGroup>
  );
}

export default TodoList;

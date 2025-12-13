import { ListGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCheckCircle, faCircle } from "@fortawesome/free-solid-svg-icons";

function TodoItem({ todo, toggleTodo, deleteTodo }) {
  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center"
      style={{
        textDecoration: todo.done ? "line-through" : "none",
        opacity: todo.done ? 0.6 : 1,
      }}
    >
      <div
        onClick={() => toggleTodo(todo.id)}
        style={{ cursor: "pointer", flex: 1 }}
      >
        <FontAwesomeIcon
          icon={todo.done ? faCheckCircle : faCircle}
          className="me-2 text-success"
        />
        {todo.text}
      </div>

      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => deleteTodo(todo.id)}
      >
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </ListGroup.Item>
  );
}

export default TodoItem;

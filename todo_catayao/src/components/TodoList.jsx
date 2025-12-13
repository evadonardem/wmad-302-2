import { ListGroup, Button, Form } from "react-bootstrap";

function TodoList({ todos, onDelete, onToggle }) {
  if (todos.length === 0) {
    return (
      <p className="text-center text-muted fs-6">
        <i className="far fa-face-smile-wink me-1"></i>
        No tasks yet — add one below!
      </p>
    );
  }

  return (
    <ListGroup variant="flush">
      {todos.map((todo, index) => (
        <ListGroup.Item
          key={index}
          className="d-flex justify-content-between align-items-center py-2 px-3"
          style={{
            border: "none",
            background: "transparent",
            borderBottom: "1px solid #eee",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <Form.Check
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(index)}
              style={{ transform: "scale(1.3)" }}
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#888" : "#333",
                fontSize: "1rem",
                transition: "color 0.2s ease",
              }}
            >
              {todo.text}
            </span>
          </div>

          <Button
            variant="light"
            size="sm"
            onClick={() => onDelete(index)}
            className="text-danger"
            style={{
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <i className="fas fa-trash"></i>
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default TodoList;

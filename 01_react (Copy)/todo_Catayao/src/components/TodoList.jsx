import { ListGroup, Button } from "react-bootstrap";

function TodoList({ todos, onDelete, onToggle }) {
  if (todos.length === 0) {
    return <p className="text-center text-muted">No tasks yet 😴</p>;
  }

  return (
    <ListGroup variant="flush">
      {todos.map((todo, index) => (
        <ListGroup.Item
          key={index}
          className="d-flex justify-content-between align-items-center"
          style={{
            border: "none",
            background: "transparent",
            padding: "12px 0",
            borderBottom: "1px solid #eee",
            transition: "background 0.2s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span
            onClick={() => onToggle(index)}
            style={{
              fontSize: "1rem",
              color: todo.completed ? "#aaa" : "#333",
              textDecoration: todo.completed ? "line-through" : "none",
              opacity: todo.completed ? 0.6 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {todo.text}
          </span>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(index)}
            style={{
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
            }}
          >
            ✕
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default TodoList;

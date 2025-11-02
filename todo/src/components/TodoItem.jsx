import { Button } from "react-bootstrap";

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "8px",
      }}
    >
      <span
        onClick={() => onToggle(todo.id)}
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          cursor: "pointer",
          flexGrow: 1,
        }}
      >
        {todo.text}
      </span>
      <Button
        variant="danger"
        size="sm"
        onClick={() => onDelete(todo.id)}
        style={{ marginLeft: "10px" }}
      >
        Delete
      </Button>
    </div>
  );
}

export default TodoItem;

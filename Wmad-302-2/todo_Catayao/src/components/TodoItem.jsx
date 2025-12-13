import { ListGroup, Button, Form } from "react-bootstrap";

const TodoItem = ({ todo, index, onToggle, onDelete }) => {
  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center py-3 px-3"
      style={{
        border: "none",
        background: "transparent",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* ✅ Checkbox + text */}
      <div className="d-flex align-items-center gap-3">
        <Form.Check
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(index)}
          style={{
            transform: "scale(1.3)",
            cursor: "pointer",
          }}
        />

        <span
          style={{
            textDecoration: todo.completed ? "line-through" : "none",
            color: todo.completed ? "#999" : "#333",
            fontSize: "1.05rem",
            transition: "color 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {todo.completed && (
            <i className="fa-solid fa-circle-check text-success"></i>
          )}
          {todo.text}
        </span>
      </div>

      {/* 🗑️ Delete button */}
      <Button
        variant="light"
        size="sm"
        onClick={() => onDelete(index)}
        className="text-danger"
        style={{
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#ffe6e6";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "white";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <i className="fa-solid fa-trash"></i>
      </Button>
    </ListGroup.Item>
  );
};

export default TodoItem;

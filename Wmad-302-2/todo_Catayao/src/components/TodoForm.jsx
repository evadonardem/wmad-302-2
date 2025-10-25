import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

function TodoForm({ onAdd }) {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() === "") return;
    onAdd(task);
    setTask("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={{
            borderRadius: "30px 0 0 30px",
            padding: "12px 20px",
            fontSize: "1rem",
          }}
        />
        <Button
          type="submit"
          variant="primary"
          style={{
            borderRadius: "0 30px 30px 0",
            padding: "12px 25px",
            fontWeight: "600",
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            border: "none",
          }}
        >
          <i className="fas fa-plus"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}

export default TodoForm;

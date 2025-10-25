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
            border: "2px solid #d1d9e6",
            fontSize: "1rem",
            outline: "none",
            transition: "border 0.3s ease",
          }}
          onFocus={(e) => (e.target.style.border = "2px solid #a8c0ff")}
          onBlur={(e) => (e.target.style.border = "2px solid #d1d9e6")}
        />
        <Button
          type="submit"
          variant="primary"
          style={{
            borderRadius: "0 30px 30px 0",
            padding: "12px 25px",
            fontWeight: "600",
            background: "linear-gradient(135deg, #a8c0ff, #3f2b96)",
            border: "none",
          }}
        >
          Add
        </Button>
      </InputGroup>
    </Form>
  );
}

export default TodoForm;

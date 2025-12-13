import { useState } from "react";
import { Form, Button } from "react-bootstrap";

function TodoForm({ addTodo }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(text);
    setText("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="d-flex">
        <Form.Control
          type="text"
          placeholder="Enter a new task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" variant="primary" style={{ marginLeft: "10px" }}>
          Add
        </Button>
      </Form.Group>
    </Form>
  );
}

export default TodoForm;

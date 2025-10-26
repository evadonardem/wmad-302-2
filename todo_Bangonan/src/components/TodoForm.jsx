import { useState } from "react";
import { Button, Card, FloatingLabel, FormControl } from "react-bootstrap";

const TodoForm = ({ onChange = null }) => {
  const [item, setItem] = useState({
    description: "",
    completed: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.description.trim()) return; // prevent empty input
    if (onChange) onChange(item);
    setItem({ description: "", completed: false }); // clear input
  };

  return (
    <Card style={{ backgroundColor: "lightyellow" }} className="p-3">
      <Card.Body>
        <Card.Title>Add a New Task</Card.Title>
        <form onSubmit={handleSubmit}>
          <FloatingLabel controlId="floatingInput" label="Enter task here" className="mb-3">
            <FormControl
              type="text"
              value={item.description}
              onChange={(e) =>
                setItem({ ...item, description: e.target.value })
              }
              placeholder="Type a task..."
            />
          </FloatingLabel>
          <Button variant="primary" type="submit">
            Add Task
          </Button>
        </form>
      </Card.Body>
    </Card>
  );
};

export default TodoForm;

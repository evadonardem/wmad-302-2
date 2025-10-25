import { useState } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const TodoForm = ({ onChange = null }) => {
  const [taskText, setTaskText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [buttonColor, setButtonColor] = useState("warning");

  const handleSubmit = () => {
    const trimmedText = taskText.trim();
    if (onChange && trimmedText !== "") {
      onChange(trimmedText, dueDate);
      setTaskText("");
      setDueDate("");
      setButtonColor("primary");
    }
  };

  return (
    <div className="bg-success p-3 rounded">
      <InputGroup className="mb-3">
        <InputGroup.Text className="bg-light text-dark">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          What mission are we tackling today, boss?
        </InputGroup.Text>
        <Form.Control
          as="textarea"
          aria-label="Task input"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text className="bg-light text-dark">
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
          Due Date
        </InputGroup.Text>
        <Form.Control
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </InputGroup>

      <Button
        variant={buttonColor}
        onClick={handleSubmit}
        disabled={taskText.trim() === ""}
      >
        <FontAwesomeIcon icon={faPlus} className="me-2" />
        Add Task
      </Button>
    </div>
  );
};

export default TodoForm;

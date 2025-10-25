import { useState } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function TodoForm({ addTodo }) {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(task);
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup>
        <FormControl
          placeholder="What do you need to do?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <Button variant="primary" type="submit">
          <FontAwesomeIcon icon={faPlus} /> Add
        </Button>
      </InputGroup>
    </form>
  );
}

export default TodoForm;

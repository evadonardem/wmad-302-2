import { useState } from "react";
import { Card, Container } from "react-bootstrap";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

function App() {
  const [list, setList] = useState([]);

  // Add new task
  const handleAddToo = (item) => {
    setList([...list, item]);
  };

  // Toggle task complete/incomplete
  const handleToggle = (index) => {
    const updated = [...list];
    updated[index].completed = !updated[index].completed;
    setList(updated);
  };

  // Delete task
  const handleDelete = (index) => {
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
  };

  return (
    <Container
      style={{ alignItems: "center", display: "flex", height: "100vh" }}
    >
      <Card style={{ flex: 1, width: "80%" }}>
        <Card.Body>
          <Card.Title>My Tasks for the Day</Card.Title>
          <hr />
          <TodoList
            list={list}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
          <hr />
          <TodoForm onChange={handleAddToo} />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;
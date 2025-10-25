import { Card, Container } from "react-bootstrap";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import { useState } from "react";

// FontAwesome setup
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlus,
  faCalendarAlt,
  faTrash,
  faCheckSquare,
  faSquare,
  faGhost
} from "@fortawesome/free-solid-svg-icons";
library.add(faPlus, faCalendarAlt, faTrash, faCheckSquare, faSquare, faGhost);

function App() {
  const [list, setList] = useState([]);

  const handleAddTask = (task, dueDate) => {
    const newTask = {
      id: list.length + 1,
      task,
      dueDate,
      completed: false
    };
    setList([...list, newTask]);
  };

  const handleToggleTask = (id) => {
    const updatedList = list.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setList(updatedList);
  };

  const handleRemoveTask = (id) => {
    const updatedList = list.filter(item => item.id !== id);
    setList(updatedList);
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
      <Card style={{ width: "80%" }}>
        <Card.Body>
          <Card.Title className="text-center">
            <strong>🔥 Dexter’s Daily Hustle</strong>
          </Card.Title>
          <hr />
          <TodoList
            list={list}
            handleToggleComplete={handleToggleTask}
            handleRemoveTask={handleRemoveTask}
          />
          <hr />
          <TodoForm onChange={handleAddTask} />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;

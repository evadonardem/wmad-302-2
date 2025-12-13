import { useState } from "react";
import { Card, Container } from "react-bootstrap";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    if (text.trim() === "") return;
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <Container
      style={{
        alignItems: "center",
        display: "flex",
        height: "100vh",
      }}
    >
      <Card style={{ flex: 1, width: "80%" }}>
        <Card.Body>
          <Card.Title>My Tasks for the Day</Card.Title>
          <hr />
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
          <hr />
          <TodoForm addTodo={addTodo} />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;

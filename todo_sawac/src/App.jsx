import { Container, Card } from "react-bootstrap";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);

  // Load todos from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("todos"));
    if (stored) setTodos(stored);
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (task) => {
    if (!task.trim()) return;
    setTodos([...todos, { id: Date.now(), text: task, done: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <Container className="py-5" style={{ maxWidth: "500px" }}>
      <Card className="shadow-lg p-3 rounded-4">
        <Card.Body>
          <h3 className="text-center mb-4 fw-bold">My Tasks for Today</h3>
          <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
          <TodoForm addTodo={addTodo} />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;

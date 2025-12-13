import { useState } from "react";
import { Card, Container } from "react-bootstrap";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

function App() {
  const [todos, setTodos] = useState([]);

  // Add a new task
  const handleAddTodo = (task) => {
    if (task.trim() === "") return;
    setTodos([...todos, { text: task, completed: false }]);
  };

  // Delete a task
  const handleDeleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  // Toggle completed
  const handleToggleComplete = (index) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #89f7fe, #66a6ff)",
        fontFamily: "'Poppins', sans-serif",
        padding: "20px",
      }}
    >
      <Card
        className="shadow-lg border-0"
        style={{
          width: "90%",
          maxWidth: "600px",
          borderRadius: "18px",
          background: "linear-gradient(135deg, #ffffff, #f8f9ff)",
          overflow: "hidden",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
        }}
      >
        <Card.Body>
          <Card.Title
            className="text-center mb-4"
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#333",
            }}
          >
            <i className="fas fa-list-check me-2 text-primary"></i>
            My Daily Checklist
          </Card.Title>

          <TodoList
            todos={todos}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleComplete}
          />

          <hr />

          <TodoForm onAdd={handleAddTodo} />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;

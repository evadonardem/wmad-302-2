import { useState } from "react";
import { Card, Container } from "react-bootstrap";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

function App() {
  const [todos, setTodos] = useState([]);

  // Add a new task
  const handleAddTodo = (task) => {
    setTodos([...todos, { text: task, completed: false }]);
  };

  // Delete a task
  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  // Toggle completed
  const handleToggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  return (
    <>
      <Container
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #a8edea, #fed6e3)",
          fontFamily: "'Poppins', sans-serif",
          padding: "20px",
        }}
      >
        <Card
          style={{
            flex: 1,
            width: "80%",
            maxWidth: "600px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
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
              🌤️ My Tasks for the Day
            </Card.Title>

            <hr />

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
    </>
  );
}

export default App;

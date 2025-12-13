import { Card, Container, Button, Form } from "react-bootstrap";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import { useEffect, useState } from "react";

const DEFAULT_CATEGORIES = ["Personal", "School", "Work"];

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("dark") === "true";
  });

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("dark", darkMode);
  }, [darkMode]);

  const addTodo = (todo) => {
    setTodos(prev => [...prev, todo]);
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  const editTodo = (id, updated) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, ...updated } : t
    ));
  };

  const reorderTodos = (newList) => {
    setTodos(newList);
  };

  const filteredTodos = todos.filter(todo => {
    return (
      todo.text.toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory === "All" || todo.category === filterCategory)
    );
  });

  return (
    <Container fluid className={darkMode ? "bg-dark text-light" : "bg-app"}>
      <Card className={`app-card ${darkMode && "bg-black text-light"}`}>
        <Card.Body>

          <div className="d-flex justify-content-between">
            <h4>✅ Todo Pro</h4>
            <Button size="sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "🌞" : "🌙"}
            </Button>
          </div>

          <Form.Control
            placeholder="Search task..."
            className="my-2"
            onChange={e => setSearch(e.target.value)}
          />

          <Form.Select
            className="mb-2"
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {DEFAULT_CATEGORIES.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </Form.Select>

          <TodoList 
            todos={filteredTodos}
            onDelete={deleteTodo}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onReorder={reorderTodos}
            darkMode={darkMode}
          />

          <TodoForm onAdd={addTodo} categories={DEFAULT_CATEGORIES} />

          <div className="text-center mt-2">
            Tasks: {todos.length}
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;

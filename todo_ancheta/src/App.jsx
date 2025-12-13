import { Card, Container } from "react-bootstrap"
import TodoList from "./components/TodoList"
import TodoForm from "./components/TodoForm"
import { useState } from 'react'

function App() {
  // Add state management for the todo list
  const [list, setList] = useState([])

  const handleAddTodo = (itemDescription) => {
    // Generate a unique ID (e.g., using Date.now() or a counter)
    const newTodo = {
      id: Date.now(), // Use a timestamp for a quick unique ID
      text: itemDescription, // Use 'text' to match TodoItem.jsx
      completed: false,
    }
    setList([
      ...list,
      newTodo,
    ])
  }

  // Add handlers for toggle and delete
  const handleToggleTodo = (id) => {
    setList(list.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const handleDeleteTodo = (id) => {
    setList(list.filter(todo => todo.id !== id))
  }

  return (
    <>
      {/* Centering the card and applying a max-width for better appearance */}
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Card style={{ width: "100%", maxWidth: "600px"}}>
          <Card.Body>
            <Card.Title className="text-center mb-4 h2">My Tasks for the Day</Card.Title>
            <hr/>
            <TodoList 
              todos={list} 
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
            <hr/>
            {/* Pass the handler without an argument */}
            <TodoForm onAdd={handleAddTodo} />
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default App
import { Card, Container } from "react-bootstrap"
import TodoList from "./components/TodoList"
import TodoForm from "./components/TodoForm"
import { useState } from "react"

function App() {
  const [list, setList] = useState([]);

  const handleAddTask = (task) =>{
    const newTask = {
      id: list.length + 1,
      task: task,
      completed: false
    };
    setList([...list, newTask]);
  }

  return (
    <>
      <Container style={{ alignItems: "center", display: "flex", height: "100vh" }}>
        <Card style={{ flex: 1, width: "80%"}}>
          <Card.Body>
            <Card.Title>My Tasks for the Day</Card.Title>
            <hr/>
            <TodoList list={list}/>
            <hr/>
            <TodoForm onChange={handleAddTask}/>
          </Card.Body>
        </Card>

      </Container>
    </>
  )
}

export default App

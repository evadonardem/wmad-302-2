import { Card, Container, Navbar, Nav, Badge } from "react-bootstrap"
import TodoList from "./components/TodoList"

function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="#">
            <i className="bi bi-check-circle-fill me-2"></i>
            TaskMaster Pro
          </Navbar.Brand>
          <Nav>
            <Nav.Link href="#">
              <i className="bi bi-bell me-1"></i>
              Notifications
            </Nav.Link>
            <Nav.Link href="#">
              <i className="bi bi-gear me-1"></i>
              Settings
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Card className="shadow-lg border-0" style={{ 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
          <Card.Header className="bg-primary text-white py-3" style={{ border: 'none' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="mb-0">
                  <i className="bi bi-list-task me-2"></i>
                  My Tasks for the Day
                </Card.Title>
                <small className="opacity-75">
                  <i className="bi bi-calendar3 me-1"></i>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </small>
              </div>
              <Badge bg="light" text="dark" className="fs-6 p-2">
                <i className="bi bi-clock-history me-1"></i>
                Stay Focused!
              </Badge>
            </div>
          </Card.Header>
          
          <Card.Body className="p-4">
            <TodoList />
          </Card.Body>
          
          <Card.Footer className="bg-transparent border-0 py-3 text-center">
            <small className="text-muted">
              <i className="bi bi-lightbulb me-1"></i>
              Tip: Click on a task to mark it as complete
            </small>
          </Card.Footer>
        </Card>
      </Container>
    </>
  )
}

export default App
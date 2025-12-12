import { useState } from "react";
import { Form, Button, InputGroup, Row, Col, Card } from "react-bootstrap";

const TodoForm = ({ onAdd }) => {
    const [input, setInput] = useState("");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("General");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onAdd(input.trim(), priority, category);
            setInput("");
        }
    };

    const categories = ["Work", "Personal", "Health", "Learning", "Shopping", "General"];

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body>
                <Card.Title className="mb-4">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Task
                </Card.Title>
                
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={8}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <i className="bi bi-pencil-square"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="What needs to be done today?"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    aria-label="New todo item"
                                    className="py-3"
                                />
                            </InputGroup>
                        </Col>
                        
                        <Col md={4}>
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={!input.trim()}
                                className="w-100 h-100"
                            >
                                <i className="bi bi-plus-lg me-2"></i>
                                Add Task
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="bi bi-flag me-1"></i> Priority
                                </Form.Label>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant={priority === 'high' ? 'danger' : 'outline-danger'}
                                        onClick={() => setPriority('high')}
                                        className="flex-grow-1"
                                    >
                                        High
                                    </Button>
                                    <Button
                                        variant={priority === 'medium' ? 'warning' : 'outline-warning'}
                                        onClick={() => setPriority('medium')}
                                        className="flex-grow-1"
                                    >
                                        Medium
                                    </Button>
                                    <Button
                                        variant={priority === 'low' ? 'info' : 'outline-info'}
                                        onClick={() => setPriority('low')}
                                        className="flex-grow-1"
                                    >
                                        Low
                                    </Button>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="bi bi-tags me-1"></i> Category
                                </Form.Label>
                                <Form.Select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="mt-3">
                        <small className="text-muted">
                            <i className="bi bi-info-circle me-1"></i>
                            Press Enter or click Add Task to create a new task
                        </small>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default TodoForm;
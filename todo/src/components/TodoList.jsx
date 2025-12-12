import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import { useState, useEffect } from "react";
import { Alert, Button, ButtonGroup, Dropdown, DropdownButton, Badge } from "react-bootstrap";

const TodoList = () => {
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [
            { id: 1, text: "Complete React project", completed: false, priority: "high", category: "Work" },
            { id: 2, text: "Buy groceries", completed: true, priority: "medium", category: "Personal" },
            { id: 3, text: "Morning exercise", completed: false, priority: "high", category: "Health" },
            { id: 4, text: "Read a book", completed: false, priority: "low", category: "Learning" },
        ];
    });

    const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
    const [sortBy, setSortBy] = useState('priority'); // 'priority', 'date', 'category'

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const handleToggle = (id) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleDelete = (id) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    };

    const handleAdd = (text, priority = 'medium', category = 'General') => {
        const newTodo = {
            id: Date.now(),
            text,
            completed: false,
            priority,
            category,
            createdAt: new Date().toISOString()
        };
        setTodos(prevTodos => [...prevTodos, newTodo]);
    };

    const handleClearCompleted = () => {
        setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to delete all tasks?")) {
            setTodos([]);
        }
    };

    // Filter todos
    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    // Sort todos
    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (sortBy === 'priority') {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (sortBy === 'category') {
            return a.category.localeCompare(b.category);
        }
        return 0;
    });

    const completedCount = todos.filter(todo => todo.completed).length;
    const totalCount = todos.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const highPriorityCount = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;

    return (
        <>
            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card bg-primary text-white h-100">
                        <div className="card-body">
                            <h6 className="card-title"><i className="bi bi-list-check me-2"></i>Total Tasks</h6>
                            <h3 className="mb-0">{totalCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-success text-white h-100">
                        <div className="card-body">
                            <h6 className="card-title"><i className="bi bi-check-circle me-2"></i>Completed</h6>
                            <h3 className="mb-0">{completedCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-warning text-white h-100">
                        <div className="card-body">
                            <h6 className="card-title"><i className="bi bi-exclamation-triangle me-2"></i>High Priority</h6>
                            <h3 className="mb-0">{highPriorityCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-info text-white h-100">
                        <div className="card-body">
                            <h6 className="card-title"><i className="bi bi-speedometer2 me-2"></i>Progress</h6>
                            <h3 className="mb-0">{Math.round(progressPercentage)}%</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <Alert variant="light" className="shadow-sm">
                    <div className="d-flex justify-content-between mb-2">
                        <span>
                            <i className="bi bi-graph-up me-2"></i>
                            Progress: {completedCount}/{totalCount} tasks completed
                        </span>
                        <Badge bg={progressPercentage === 100 ? 'success' : 'primary'}>
                            {Math.round(progressPercentage)}%
                        </Badge>
                    </div>
                    <div className="progress" style={{ height: '12px', borderRadius: '6px' }}>
                        <div 
                            className={`progress-bar ${progressPercentage === 100 ? 'bg-success' : ''}`}
                            role="progressbar" 
                            style={{ 
                                width: `${progressPercentage}%`,
                                borderRadius: '6px',
                                transition: 'width 0.5s ease'
                            }}
                        ></div>
                    </div>
                </Alert>
            </div>

            {/* Controls */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <ButtonGroup>
                    <Button 
                        variant={filter === 'all' ? 'primary' : 'outline-primary'}
                        onClick={() => setFilter('all')}
                    >
                        <i className="bi bi-list-ul me-1"></i>All ({totalCount})
                    </Button>
                    <Button 
                        variant={filter === 'active' ? 'warning' : 'outline-warning'}
                        onClick={() => setFilter('active')}
                    >
                        <i className="bi bi-clock me-1"></i>Active ({totalCount - completedCount})
                    </Button>
                    <Button 
                        variant={filter === 'completed' ? 'success' : 'outline-success'}
                        onClick={() => setFilter('completed')}
                    >
                        <i className="bi bi-check-circle me-1"></i>Completed ({completedCount})
                    </Button>
                </ButtonGroup>

                <DropdownButton
                    variant="outline-secondary"
                    title={<><i className="bi bi-sort-down me-1"></i>Sort By</>}
                >
                    <Dropdown.Item onClick={() => setSortBy('priority')}>
                        <i className="bi bi-flag me-2"></i>Priority
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('category')}>
                        <i className="bi bi-tags me-2"></i>Category
                    </Dropdown.Item>
                </DropdownButton>
            </div>

            {/* Todo List */}
            {sortedTodos.length === 0 ? (
                <Alert variant="light" className="text-center p-5 shadow-sm">
                    <i className="bi bi-inbox display-1 text-muted mb-3"></i>
                    <h4>No tasks found</h4>
                    <p className="text-muted">
                        {filter === 'all' 
                            ? "Start by adding a new task below!" 
                            : `No ${filter} tasks. Try a different filter.`}
                    </p>
                </Alert>
            ) : (
                <div className="todo-list">
                    {sortedTodos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex justify-content-between mt-4">
                <Button 
                    variant="outline-danger" 
                    onClick={handleClearCompleted}
                    disabled={completedCount === 0}
                >
                    <i className="bi bi-trash me-1"></i>Clear Completed
                </Button>
                
                <Button 
                    variant="danger" 
                    onClick={handleClearAll}
                    disabled={totalCount === 0}
                >
                    <i className="bi bi-trash3 me-1"></i>Clear All Tasks
                </Button>
            </div>

            {/* Add Todo Form */}
            <div className="mt-4 pt-4 border-top">
                <TodoForm onAdd={handleAdd} />
            </div>
        </>
    );
};

export default TodoList;
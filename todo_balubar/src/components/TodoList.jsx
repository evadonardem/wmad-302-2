import { Button, Form, Badge } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";

export default function TodoList({ todos, onDelete, onToggle, onEdit, onReorder, darkMode }) {
  const [editId, setEditId] = useState(null);
  const [text, setText] = useState("");

  const handleDrag = (result) => {
    if (!result.destination) return;
    const items = [...todos];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    onReorder(items);
  };

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {todos.map((todo, index) => (
              <Draggable draggableId={String(todo.id)} index={index} key={todo.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`todo-item ${darkMode && "dark-item"}`}
                  >
                    <Form.Check checked={todo.done} onChange={() => onToggle(todo.id)} />

                    {editId === todo.id ? (
                      <Form.Control
                        value={text}
                        onChange={e => setText(e.target.value)}
                      />
                    ) : (
                      <span className={todo.done ? "done" : ""}>{todo.text}</span>
                    )}

                    <small>{todo.due}</small>

                    <Badge bg="info">{todo.category}</Badge>
                    <Badge bg={todo.priority === "High" ? "danger" : "secondary"}>
                      {todo.priority}
                    </Badge>

                    {editId === todo.id ? (
                      <Button size="sm" onClick={() => {
                        onEdit(todo.id, { text });
                        setEditId(null);
                      }}>Save</Button>
                    ) : (
                      <Button size="sm" onClick={() => {
                        setText(todo.text);
                        setEditId(todo.id);
                      }}>Edit</Button>
                    )}

                    <Button size="sm" variant="danger" onClick={() => onDelete(todo.id)}>X</Button>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
import { Button, Form, Badge } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";

export default function TodoList({ todos, onDelete, onToggle, onEdit, onReorder, darkMode }) {
  const [editId, setEditId] = useState(null);
  const [text, setText] = useState("");

  const handleDrag = (result) => {
    if (!result.destination) return;
    const items = [...todos];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    onReorder(items);
  };

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {todos.map((todo, index) => (
              <Draggable draggableId={String(todo.id)} index={index} key={todo.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`todo-item ${darkMode && "dark-item"}`}
                  >
                    <Form.Check checked={todo.done} onChange={() => onToggle(todo.id)} />

                    {editId === todo.id ? (
                      <Form.Control
                        value={text}
                        onChange={e => setText(e.target.value)}
                      />
                    ) : (
                      <span className={todo.done ? "done" : ""}>{todo.text}</span>
                    )}

                    <small>{todo.due}</small>

                    <Badge bg="info">{todo.category}</Badge>
                    <Badge bg={todo.priority === "High" ? "danger" : "secondary"}>
                      {todo.priority}
                    </Badge>

                    {editId === todo.id ? (
                      <Button size="sm" onClick={() => {
                        onEdit(todo.id, { text });
                        setEditId(null);
                      }}>Save</Button>
                    ) : (
                      <Button size="sm" onClick={() => {
                        setText(todo.text);
                        setEditId(todo.id);
                      }}>Edit</Button>
                    )}

                    <Button size="sm" variant="danger" onClick={() => onDelete(todo.id)}>X</Button>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

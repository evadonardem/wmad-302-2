import { Button, Form } from "react-bootstrap";
import { useState } from "react";

export default function TodoForm({ onAdd, categories }) {
  const [text, setText] = useState("");
  const [due, setDue] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState("Medium");

  const submit = (e) => {
    e.preventDefault();
    if (!text) return;

    onAdd({
      id: Date.now(),
      text,
      done: false,
      due,
      category,
      priority
    });

    setText("");
    setDue("");
  };

  return (
    <Form onSubmit={submit} className="mt-3">
      <Form.Control 
        placeholder="Task name" 
        onChange={e => setText(e.target.value)} 
        value={text}
      />

      <Form.Control
        type="date"
        className="mt-2"
        onChange={e => setDue(e.target.value)}
        value={due}
      />

      <Form.Select className="mt-2" onChange={e => setCategory(e.target.value)}>
        {categories.map(cat => (
          <option key={cat}>{cat}</option>
        ))}
      </Form.Select>

      <Form.Select className="mt-2" onChange={e => setPriority(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </Form.Select>

      <Button className="w-100 mt-2" type="submit">Add Task</Button>
    </Form>
  );
}

import TodoItem from "./TodoItem";

function TodoList({ todos, onToggle, onDelete }) {
  return (
    <div>
      {todos.length === 0 ? (
        <p className="text-center text-muted">No tasks yet. Add one below!</p>
      ) : (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}

export default TodoList;

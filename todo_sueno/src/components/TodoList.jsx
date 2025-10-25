import TodoItem from "./TodoItem";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGhost } from "@fortawesome/free-solid-svg-icons";

const TodoList = ({ list = [], handleToggleComplete, handleRemoveTask }) => {
  if (list.length === 0) {
    return (
      <Alert variant="danger" className="text-center">
        <FontAwesomeIcon icon={faGhost} className="me-2" />
        Your task list is emptier than a fridge after midnight. Let’s fill it up! 🍕
      </Alert>
    );
  }

  return (
    <div>
      {list.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          onToggle={handleToggleComplete}
          onRemove={handleRemoveTask}
        />
      ))}
    </div>
  );
};

export default TodoList;

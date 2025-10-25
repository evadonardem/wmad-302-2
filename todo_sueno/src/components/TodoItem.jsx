import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheckSquare,
  faSquare,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";

const TodoItem = ({ item, onToggle, onRemove }) => {
  return (
    <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
      <div className="d-flex flex-column flex-grow-1">
        <div className="d-flex align-items-center">
          <Button
            variant="outline-secondary"
            onClick={() => onToggle(item.id)}
            className="me-2"
          >
            <FontAwesomeIcon icon={item.completed ? faCheckSquare : faSquare} />
          </Button>
          <span
            style={{
              textDecoration: item.completed ? "line-through" : "none",
              color: item.completed ? "#6c757d" : "#212529"
            }}
          >
            {item.task}
          </span>
        </div>
        {item.dueDate && (
          <small className="text-muted ms-5">
            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
            Due: {item.dueDate}
          </small>
        )}
      </div>
      <Button
        variant="danger"
        size="sm"
        onClick={() => onRemove(item.id)}
      >
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </div>
  );
};

export default TodoItem;

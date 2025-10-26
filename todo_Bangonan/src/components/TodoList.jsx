import { Button, FormCheck } from "react-bootstrap";

const TodoList = ({ list = [], onToggle = null, onDelete = null }) => {
  return (
    <>
      <h4>Your Tasks</h4>
      {list.length === 0 ? (
        <p>No tasks yet!</p>
      ) : (
        list.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <FormCheck
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggle && onToggle(index)}
                style={{ marginRight: "10px" }}
              />
              <span
                style={{
                  textDecoration: item.completed ? "line-through" : "none",
                  color: item.completed ? "green" : "black",
                }}
              >
                {item.description}
              </span>
            </div>

            {item.completed && (
              <span style={{ color: "green", fontWeight: "bold" }}>
                ✔ Task Done!
              </span>
            )}

            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete && onDelete(index)}
            >
              Delete
            </Button>
          </div>
        ))
      )}
    </>
  );
};

export default TodoList;

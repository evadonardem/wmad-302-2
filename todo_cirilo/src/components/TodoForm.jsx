import { useState } from "react";
import { Card } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


const TodoForm = ({onChange = null}) => {
    const [taskText, setTaskText] = useState("");
    const handleTextChange = (e) => {
        setTaskText(e.target.value);
        }; 
    const handleSubmit = () => {
        const trimmedText = taskText.trim();

        if (onChange && trimmedText !== "") {
            // Call the parent's function, passing the new task text
            onChange(trimmedText); 

            // Clear the input field by resetting the state
            setTaskText("");
        }
    };


    return (
        <>
        <div style={{maxWidth: '100%', margin: '20px auto', alignItems: 'center', backgroundColor: '#7ab8f5ff', padding: '10px', borderRadius: '5px'}}>
           <InputGroup className="mb-3">
                <InputGroup.Text style={{backgroundColor: "ivory"}}>What're we doin' today champ?</InputGroup.Text>
                
                <Form.Control 
                    as="textarea" 
                    aria-label="Task input" 
                    // Controlled Component: Value is bound to state
                    value={taskText} 
                    // Controlled Component: Changes update state
                    onChange={handleTextChange} 
                />
            </InputGroup>
           <button 
                style={{ marginTop: "10px" }} 
                type="button" 
                className="btn btn-primary"
                onClick={handleSubmit} // Use the clean submit handler
                // Optional: Disable button if input is empty
                disabled={taskText.trim() === ""} 
            >
                Add Task
            </button>
        </div>
        </>
    );
};

export default TodoForm;
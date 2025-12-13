import { useState } from 'react';
import { Button, Card, FloatingLabel, FormControl } from 'react-bootstrap';

// Rename prop from 'onChange' to 'onAdd' for clarity
const TodoForm = ({ onAdd = () => {}}) => {   

    // State to hold the current input text (description)
    const [itemDescription, setItemDescription] = useState ('');
                                  
    
    // Handler for the Add Task button click
    const handleAddTask = () => {
        // Only add if the description is not empty
        if (itemDescription.trim() !== "") {
            // Call the prop function, passing the description text
            onAdd(itemDescription.trim()); 
            // Reset the input state
            setItemDescription("");
        }
    };

    // Handler for Enter key press in the input field
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    }
    
    return (
        <>
            {/* Updated card styling for better contrast/look */}
            <Card className="mt-3" style={{ backgroundColor: "#bbc7d3ff", border: "1px solid #dee2e6" }}>
               <Card.Body>
                    <Card.Title className="h5">
                        Add a New Task
                    </Card.Title>
                    <Card.Text className="text-muted small mb-3">
                        e.g., for personal development, health, or career.
                    </Card.Text>
                    
                    <FloatingLabel label="Todo" className="mb-3">
                        <FormControl 
                            placeholder="Enter task here"
                            value={itemDescription} // Control the input value
                            onChange={(e) => {
                                // Update state on every keystroke
                                setItemDescription(e.target.value);
                            }}
                            onKeyPress={handleKeyPress} // Allows adding with Enter key
                        /> 
                    </FloatingLabel>
                </Card.Body>
                
                {/* Ensure button is part of the card structure or styled to fit */}
                <Button 
                    onClick={handleAddTask}
                    variant="primary" // Use a standard Bootstrap variant
                    className="w-100 py-2" // Full width button
                    disabled={itemDescription.trim() === ""} // Disable if input is empty
                >
                    Add Task
                </Button>

            </Card>    
        </>
    );
};

export default TodoForm;
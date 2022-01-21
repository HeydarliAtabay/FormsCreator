import {React, useState} from 'react'
import {ListGroup,Card,Button, Modal, Form} from 'react-bootstrap'
import { useHistory } from "react-router-dom";

function FormItem(props){
    const{form, onSelect, loggedIn}=props
  const history=useHistory()
   
    return(
        <>
        <div className="survCards">
          {(!loggedIn && form.published===1) &&
                 <Card  > 
           
                 <Card.Body>
                 <Card.Title>{form.title}</Card.Title>
                 
               
               {(form.published !==1 && loggedIn) && 
               <Button
                onClick={(event) => {
                  onSelect(form.id)
                  history.push("/questions")
                }}
                className="btn btn-primary"
               >
                 Modify the Form
               </Button>
             }
              {!loggedIn &&
              <Button
              onClick={(event) => {
                onSelect(form.id)
                history.push("/questions")
              }}
              className="btn btn-primary"
             >
               Start Answering
             </Button>
              } 
     {(form.num!==0 && loggedIn && form.published===1) &&
       <Button
       onClick={(event) => {
         onSelect(form.id)
         history.push("/answers")
       }}
               className="btn btn-success"
            >
              Check Responses
            </Button>
     }
                
             {loggedIn && <h5>number of responses for this form is : {form.num} </h5>  } 
             {(form.published===1 && loggedIn) &&  <h6 >Published</h6>}   
             {(form.published===0 && loggedIn) &&  <h6 >Not Published</h6>}   
             </Card.Body>
     </Card> 
          }

{loggedIn  &&
                 <Card  > 
           
                 <Card.Body>
                 <Card.Title>{form.title}</Card.Title>
                 
               
               {(form.published !==1 && loggedIn) && 
               <Button
                onClick={(event) => {
                  onSelect(form.id)
                  history.push("/questions")
                }}
                className="btn btn-primary"
               >
                 Modify the Form
               </Button>
             }
              {!loggedIn &&
              <Button
              onClick={(event) => {
                onSelect(form.id)
                history.push("/questions")
              }}
              className="btn btn-primary"
             >
               Start Answering
             </Button>
              } 
     {(form.num!==0 && loggedIn && form.published===1) &&
       <Button
       onClick={(event) => {
         onSelect(form.id)
         history.push("/answers")
       }}
               className="btn btn-success"
            >
              Check Responses
            </Button>
     }
                
             {loggedIn && <h5>number of responses for this form is : {form.num} </h5>  } 
             {(form.published===1 && loggedIn) &&  <h6 >Published</h6>}   
             {(form.published===0 && loggedIn) &&  <h6 >Not Published</h6>}   
             </Card.Body>
     </Card> 
          }
  
        </div>
        </>
    )
}

function ModalFormTitle(props) {
  const { onClose, onSave } = props;
  const [title, setTitle] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onSave(title);
  };
  return (
    <div className="cont">
      <Modal show onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add new Form</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="form-description">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Enter the Title of the form"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
                required
                autoFocus
              />
              <Form.Control.Feedback type="invalid">
                Please provide a title for the form .
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add a Form
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

function FormsList(props){
    const {forms, onSelect, add, loggedIn}=props

    const MODAL = { CLOSED: -2, ADD: -1 };
    const [selectedTask, setSelectedTask] = useState(MODAL.CLOSED);

    const handleClose = () => {
        setSelectedTask(MODAL.CLOSED);
      }
      const handleSave = (form) => {
        addForm(form)
        setSelectedTask(MODAL.CLOSED); 
      } 
      
      function addForm (form)  {
       add(form)
      }
    return(
        <>
       {loggedIn &&  <div className="addbtn"><Button variant="primary" size="lg"  onClick={() => setSelectedTask(MODAL.ADD)}>Add new Form</Button>
                {(selectedTask !== MODAL.CLOSED) && <ModalFormTitle onClose={handleClose} onSave={handleSave}></ModalFormTitle>} </div> }
       
          
           
        {/* <div className="addbtn"><Button variant="success" size="lg">Add a Survey</Button></div> */}
        <div className="cont">
       <>
      {loggedIn ? <h3>Please, Select the form for modifying or checking the responses</h3>:
      <h3>Please, Select the form for answering questions</h3>
      } 
         <ListGroup as="ul" variant="flush">
         {
             forms.map((f,index)=>{
                 return(
                     <ListGroup.Item as ="li" key={index} >
                         <FormItem form={f} loggedIn={loggedIn} onSelect={()=>onSelect(f.id)} />
                         </ListGroup.Item>                    )
             })
         }
         </ListGroup>
         </>
    
        </div>
      </>  
    )
}

export default FormsList
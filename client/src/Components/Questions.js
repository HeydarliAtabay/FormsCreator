import {React, useState, useEffect} from 'react'
import {ListGroup,Table, Form, Row, Col, Modal, Button} from 'react-bootstrap'
import {Trash} from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";
import API from '../API';


function QuestionItem(props){
    const{question, onDelete, checkError,loggedIn, actualerr, updateAnswers,questionIndex,dirtyAnswers}=props
    const[selectedChoices, setSelectedChoices]=useState(0)
    const[error,setError]=useState(question.min===0 ? 0:1)
    const[answers, setAnswers]=useState("")
    
    let columns = question.columns;
    let rows = question.rows;
    const columnArr = columns.split(";");
    const rowsArr=rows.split(";");

    /// useEffect for checking constraints
    useEffect(() => {
      if(selectedChoices<question.min || selectedChoices>question.max){
        setError(1)
        if(error!==1)checkError(actualerr+1)
      }
      else if(selectedChoices>=question.min && selectedChoices<=question.max){
        setError(0)
        if(error!==0)checkError(actualerr-1)
      }
     
      }, [selectedChoices,question.min, question.max,checkError,error,actualerr])
      
      
    /// UseEffect for uodating answers  
      useEffect(() => {
      if(selectedChoices!==0){
        let newA=dirtyAnswers
      newA[questionIndex]=answers
      updateAnswers(newA)
      }
      
       
        }, [answers,questionIndex,dirtyAnswers,updateAnswers,selectedChoices])
    return(
<>
<h4>{question.text}</h4>
<Table>
<div className="deletecont">
        <Col>
        {loggedIn && 
        <>
        <Button variant="link" className="shadow-none"  onClick={onDelete} >
        <Trash size={32} color="red" />
      </Button>
      </>
        }
            
          </Col> 
        </div>
    <thead>
        <tr>
            <th>#</th>
            {
                columnArr.map((column)=>{
                    return(
                        <th>
                           {column}
                        </th>
                    ) })
            }
        </tr>
    </thead>
    <tbody>
        {
            rowsArr.map((row,rindex)=>{
                return(
                    <tr>
                        {row}
                        {
                            columnArr.map((c,cindex)=>{
                                return(
                                <td>
                                  {!loggedIn ? 
                                  
                                  <Form.Check 
                                    type="checkbox"
                                    id={rindex+""+cindex}
                                    onChange={(ev)=>{
                                      console.log(ev.target.id)
                                     if(ev.target.checked){
                                       // When answer is selected
                                      setSelectedChoices(selectedChoices+1)
                                      if(answers===""){
                                        let updatedAnswers=ev.target.id+";"
                                        setAnswers(updatedAnswers)
                                      }
                                      if(answers!==""){
                                        let updatedAnswers1=answers+ev.target.id+";"
                                        setAnswers(updatedAnswers1)
                                      }
                                      console.log(answers)
                                     } 
                                     else{
                                       // When answer deselected
                                      setSelectedChoices(selectedChoices-1)
                                      
                                      let decreasedAnswer=answers
                                      let decAnsArr= decreasedAnswer.split(";")
                                      console.log("old: ",decAnsArr)
                                      for(let i=0;i<decAnsArr.length;i++){
                                        if(decAnsArr[i]===ev.target.id){
                                          decAnsArr.splice(i,1)
                                        }
                                      }
                                      let newAnswers=decAnsArr.join(";")
                                      setAnswers(newAnswers)
                                     }
                                    }}
                                    />
                                  :

                                  <Form.Check 
                                    type="checkbox"
                                    id={row+" "+c}
                                    disabled
                                    />
                                  
                                  }
                                    
                                </td>
                                ) })
                        }
                    </tr>
                ) } )
        }
         
    </tbody>
   
</Table>
{loggedIn && 
  <Row>
  <Col sm={6}>
  <h5>{`Minimum: ${question.min}`}</h5>
  </Col>
  <Col sm={6}>
  <h5>{`Maximum: ${question.max}`}</h5>
  </Col>
</Row>
}
{!loggedIn &&
<>
  <Row>
<Col sm={6}>
  <h5>{`Selected choices ${selectedChoices}`}</h5>
  </Col>
  <Col sm={3}>
  <h5>{`Minimum: ${question.min}`}</h5>
  </Col>
  <Col sm={3}>
  <h5>{`Maximum: ${question.max}`}</h5>
  </Col>
</Row>
<Row>
{(selectedChoices>=question.min && selectedChoices<=question.max)&& <Col sm={12}><h6 className="successText">{`You can submit your answer `}</h6></Col>}
{(selectedChoices<question.min) && <Col sm={12}><h6 className="warningText">{`You can select at least ${question.min} choices `}</h6></Col> }  
 {(selectedChoices>question.max) && <Col sm={12}> <h6 className="warningText">{`You can select maximum ${question.max} choices `}</h6> </Col>}  
</Row>
</>
}

</>
    )
}


function ModalFormQuestion(props) {
    const { onClose, onSave, form } = props;
  
    const [text, setText] = useState("");
    const [columnNum, setColumnNum]=useState(1)
    const [rowNum, setRowNum] = useState(1)
    const [columnArr, setColumnArr]=useState("")
    const [columns,setColumns]=useState("")
    const [rowsArr, setRowsArr]=useState("")
    const [rows,setRows]=useState("")
    const [min, setMin]=useState()
    const [max, setMax]=useState()

    const handleSubmit = (event) => {
      // stop event default and propagation
      event.preventDefault();
      event.stopPropagation();
  
      const newQuestion = Object.assign({}, {
       text:text,
       columns:columns,
       rows:rows,
       form_id:form,
       min: min,
       max:max
      });
      onSave(newQuestion);
    };

    let colArr=""
    console.log(colArr)
    return (
      <div className="cont">
        <Modal show onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add new Question</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group controlId="form-description">
                <Form.Label>Text of the question</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  placeholder="Enter the text for the question"
                  value={text}
                  onChange={(ev) => setText(ev.target.value)}
                  required
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a title for the form .
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
              <Form.Label>Please provide each column</Form.Label>
              {[...Array(columnNum)].map((c, index)=>{
                            return(
                              <>
                <Row>
                 <Col sm={8}>
                  <Form.Control
                   type="text"
                   name="columnNames"
                   placeholder="enter text for each column"
                   onChange = {(ev)=>{setColumnArr(ev.target.value)}}
                   >
                   </Form.Control>
                   </Col>
                  <Col sm={2}>
                  <Button variant="success" 
                   onClick={(event) => {
                    if(columnNum<10 && columnArr!==""){
                     if(columns!=="") {
                      let col=columns+";"+columnArr
                      setColumnArr("")
                      setColumnNum(columnNum+1)
                      setColumns(col)
                     }
                     else{
                      let col1=columns+columnArr
                      setColumnArr("")
                      setColumnNum(columnNum+1)
                      setColumns(col1)
                     }
                      
                    }
                     
                   }}
                  >+ </Button>
                    </Col> 
                    <Col sm={2}>
                  <Button variant="danger" 
                   onClick={(event) => {
                     setColumnArr("")
                     if(columnNum>1 && columnArr==="")setColumnNum(columnNum-1)
                   }}
                  >- </Button>
                    </Col> 
                
               </Row>  
                              </>
                            )
                            })}
              </Form.Group>
              <Form.Group>
              <Form.Label>Please provide each row</Form.Label>
              {[...Array(rowNum)].map((c, index)=>{
                            return(
                              <>
                <Row>
                 <Col sm={8}>
                  <Form.Control
                   type="text"
                   name="columnNames"
                   placeholder="enter text for each column"
                   onChange = {(ev)=>{setRowsArr(ev.target.value)}}
                   >
                   </Form.Control>
                   </Col>
                  <Col sm={2}>
                  <Button variant="success" 
                   onClick={(event) => {
                    if(rowNum<10 &&rowsArr!==""){
                      if(rows!==""){
                        let row=rows+";"+rowsArr
                        setRowsArr("")
                        setRowNum(rowNum+1)
                        setRows(row)
                      }
                      else{
                        let row1=rows+rowsArr
                        setRowsArr("")
                        setRowNum(rowNum+1)
                        setRows(row1)
                      }
                      
                    }
                     
                   }}
                  >+ </Button>
                    </Col> 
                    <Col sm={2}>
                  <Button variant="danger" 
                   onClick={(event) => {
                     setRowsArr("")
                     if(rowNum>1 && rowsArr==="")setRowNum(rowNum-1)
                   }}
                  >- </Button>
                    </Col> 
                
               </Row>  
                              </>
                            )
                            })}
              </Form.Group>
              <Form.Group controlId="form-description">
                <Form.Label>Select minimum and maximum number of selections</Form.Label>
                <Row>
                    <Col sm={6}>
                    <Form.Control
                  type="number"
                  name="description"
                  placeholder="Minimum"
                  value={min}
                  onChange={(ev) => setMin(ev.target.value)}
                  required
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a title for the form .
                </Form.Control.Feedback>
                    </Col>
                <Col sm={6}>
                <Form.Control
                  type="number"
                  name="description"
                  placeholder="Maximum"
                  maxLength={10}
                  value={max}
                  onChange={(ev) => setMax(ev.target.value)}
                  required
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a title for the form .
                </Form.Control.Feedback>
                </Col>
               
                </Row>
                
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                Add a Question
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    );
  }
  


function Questions(props){
    const {questions,formId,onDelete, add, publish, loggedIn,numOfErrors}=props
    const history=useHistory()
    const MODAL = { CLOSED: -2, ADD: -1 };
    const [selectedTask, setSelectedTask] = useState(MODAL.CLOSED);
    const [name, setName] =useState("")
    const[answers, setAnswers]=useState([])
    const [validation, setValidation]=useState(numOfErrors)

    const handleClose = () => {
        setSelectedTask(MODAL.CLOSED);
      }

      const handleSaveQuestions = (question) => {
        addQuestions(question)
        setSelectedTask(MODAL.CLOSED); 
      } 

      function addQuestions (question)  {
        add(question)
      }

      const addAnswers= async(answer)=>{
        const update= await API.addAnswer(answer)
        console.log(update)
      }

      const increaseNum= async(form)=>{
        const update1= await API.increaseNumber(form)
        console.log(update1)
      }


      const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation(); 

        try{
          increaseNum(formId)
        }
        catch{

        }
        let randomCode=Math.floor(Math.random(100) * 1000)
        questions.map((question,index)=>{
          const newAnswer = Object.assign({}, {
            name:name,
            form_id:formId,
            question_id:question.question_id,
            answers:answers[index]!==undefined ?answers[index]:" ; ",
            code: randomCode,
           });

           try{
            setTimeout(()=>{
              addAnswers(newAnswer)// calling a function of adding new submission
              setTimeout(()=>history.push('/forms'),1500)  // waiting 1 second for redirecting user to the main page
            },500)
           
           }
           catch{

           }
         

        })
        
      }

        return(
         <>
         <div className="cont">
         <div className="addbtn">{loggedIn && <Button variant="success" size="lg"  onClick={() => setSelectedTask(MODAL.ADD)}>Add new Question</Button> }
                {(selectedTask !== MODAL.CLOSED) && <ModalFormQuestion form={formId} onSave={handleSaveQuestions} onClose={handleClose} ></ModalFormQuestion>} </div>
          
         <Form onSubmit={handleSubmit} > 
       {loggedIn ?
       <h3>You can add/delete questions and publish the form </h3>
       :
       <h3>Please, Write your name and start answering questions of the survey</h3>
       }
        {!loggedIn && 
        <Form.Group controlId="validationUsername">
        <Row>
          <Col sm={4}>
            <h3>Your name:</h3>
          </Col>
          <Col sm={8}>
          <Form.Control hasValidation size="lg" type="text" placeholder="Write your name"   value={name}
              onChange={(ev) => setName(ev.target.value)}
              required/>
                <Form.Text className="text-muted"> You don't have to write your exact name, any username is accepted</Form.Text>
                 
          </Col>
          
        </Row>
        </Form.Group>
        } 

      <Form.Group>
         
 <ListGroup as="ul" variant="flush" key={questions.id}>
          {questions.map((q,index) => {
            return (
              <div key={index}>
              
                <ListGroup.Item as="li" key={index}>
                  <QuestionItem
                  question={q}
                  onDelete={() => onDelete(q.question_id)}
                   checkError={setValidation}
                   actualerr={validation} 
                   loggedIn={loggedIn}
                   dirtyAnswers={answers}
                   updateAnswers={setAnswers}
                   questionIndex={index}
                  />
                </ListGroup.Item>
              </div>
            );
          })}
        </ListGroup>
        </Form.Group>
        {(!loggedIn  && validation===0) &&
        <>
        <h4 className="successText"> There is no any errors, you can submit your answers</h4>
        <Button  variant="success" type="submit" size="lg">
        Submit the answers
      </Button>
      </>
         }

        {(!loggedIn && validation!==0) && <h4 className="warningText"> Now you can not submit your answers! You have to follow constraints</h4>} 
         
          
         {
           (loggedIn && questions.length!==0) &&
          <Button
        size="lg"
        variant="primary"
           onClick={() => {
            publish(formId)
            history.push("/forms")
           } }
         className="btn btn-primary"
        >
          Publish this Form
        </Button>
        }
        {(loggedIn && questions.length===0) && 
         <h4 className="warningText">You can not publish Form without questions. Please add at least one question</h4>
        }
          </Form>
        </div>
        
        </>
    )
}


export default Questions
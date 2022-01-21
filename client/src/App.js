import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {React, useState, useEffect} from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import{Container,Row} from 'react-bootstrap'
import API from "./API";

import Navigation from './Components/Navigation'
import FormsList from './Components/FormsList'
import Questions from './Components/Questions'
import LoginComponent from './Components/LoginComponent'
import AdminDetails from './Components/AdminDetails';
import Answers from './Components/Answers'





function App(props) {
const [loading, setLoading]=useState(true)//this for checking the loading at mount
const [dirty, setDirty] =useState(true)
const[formList, setFormList]= useState([])
const[questionList, setQuestionList]=useState([])
const[answerList, setAnswerList]=useState([])
const[numberOfErrors, setNumberOfErrors]=useState(0)
const[selectedForm, setSelectedForm]=useState(1)
const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
const [message, setMessage] = useState('');
const [userId, setUserId]=useState(1)

useEffect(()=> {
  const checkAuth = async() => {
    try {
      await API.getUserInfo();
      setLoggedIn(true);
    } catch(err) {
      console.error(err.error);
    }
  };
  checkAuth();
}, []);

useEffect(() => {
  if(dirty && !loggedIn){

    API.getallForms().then(newForm=>{
      setFormList(newForm)
      setDirty(false)
      setLoading(false)
     })
    }
    if(loggedIn){
      API.getFormsOfUser(userId).then(newForm=>{
        setFormList(newForm)
        setDirty(false)
        setLoading(false)
       })
    }
     
  }, [dirty,loading,loggedIn,userId])

   
  useEffect(()=>{
    if(dirty){
      API.getallQuestions(selectedForm).then(newQuestion=>{
        setQuestionList(newQuestion)
        setDirty(false)
        setLoading(false)
       })
       API.getNumOfPossibleErrors(selectedForm).then(newNumber=>{
        setNumberOfErrors(newNumber[0].possibleErrors)
        setDirty(false)
        setLoading(false)
       })
      
    }
  },[dirty, loading, selectedForm])

  useEffect(()=>{
    if(dirty && loggedIn){
      API.getQuestAndAnsw(selectedForm).then(newAnswer=>{
        setAnswerList(newAnswer)
        setDirty(false)
        setLoading(false)
       })
      
    }
  },[dirty, loading, selectedForm,loggedIn])

  useEffect(() => {
    if(dirty && loggedIn){
  
      API.getFormsOfUser(userId).then(newForm=>{
        setFormList(newForm)
        setDirty(false)
        setLoading(false)
       })
      }
    }, [dirty,loading, userId, loggedIn])


  const handleselectForm = (id) =>
  {
    setSelectedForm(id)
    setDirty(true)
   
  }

  function addQuestion (questionId)  {
    API.addQuestion(questionId).then((err)=>{setDirty(true)})
  }

  function addForm (form)  {
    API.addForm(form).then((err)=>{setDirty(true)})
  }

  function deleteQuestion (question) {
    API.deleteQuestion(question)
    .then(() => {
      setDirty(true);
    }).catch(err => (err) );
  }

  function publishForm(formId){
    API.publishForm(formId)
    .then(()=>{
      setDirty(true)
    }).catch(err=>(err));
  }

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUserId(user)
      setMessage({msg: `Welcome, ${user}!`, type: 'success'});
    } catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setFormList([])
    setQuestionList([])
    setMessage('')
  }

  return (
    <Router>
       {loggedIn? <Navigation logout={doLogOut} link={"/"} info={"Log out "} />: <Navigation logout={doLogOut} link="/login"info={"Log in "} />}
      {(loggedIn && message) &&<AdminDetails greetings={message.msg}/>}
      <Container fluid>
        <Switch>
          
          <Route path="/forms">
          <FormsList forms={formList} onSelect={handleselectForm} add={addForm} loggedIn={loggedIn} />
          </Route>

          <Route path="/questions">
          <Questions numOfErrors={numberOfErrors} questions={questionList} formId={selectedForm} onDelete={deleteQuestion} add={addQuestion} publish={publishForm} loggedIn={loggedIn} />
          </Route>
          <Route path="/answers">
          <Answers answers={answerList} />
          </Route>
          <Route path="/login">
          <Row className="vh-100 below-nav">
          {loggedIn ? <Redirect to="/forms" /> : <LoginComponent login={doLogIn} serverError={message.msg}/>}
          </Row>
        </Route>
          <Redirect to="/forms"/>
        </Switch>
      </Container>
    </Router>
   
  );
}

export default App;

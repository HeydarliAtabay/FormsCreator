'use strict';

const express = require('express');
const app = new express();
const PORT = 3001;
const morgan = require('morgan');

const formsDao = require('./Dao/forms-dao');
const questionsDao = require('./Dao/questions-dao');
const userDao= require('./Dao/user-dao');

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session= require('express-session')

app.use(morgan('dev'))
app.use(express.json())

app.get('/',(req, res)=>{
    res.send(`Hi from the server, which is running on  http://localhost:${PORT}/`)
})

// for user authentication

passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
        
      return done(null, user);
    }).catch(err=>{
        done(err)
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// checking whether the user is authenticated or not
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'not authenticated'});
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'Ondan ona ondan ona, cay verun limonnan ona',
  resave: false,
  saveUninitialized: false 
}));

// tell passport to use session cookies
app.use(passport.initialize())
app.use(passport.session())

app.get('/api/forms', (req,res)=>{
  formsDao.listAllForms()
      .then((forms)=>{res.json(forms)})
      .catch((error)=>{res.status(500).json(error)} )
})

/// for user forms

app.get('/api/forms/user', isLoggedIn, async (req, res) => {
  try {
    const forms = await formsDao.listUserForms(req.user.id);
    res.json(forms);
  } catch(err) {
    res.status(500).json("Getting Forms from server was unsuccesful   "+ error) ;
  }
});

/// for creating a form



app.post('/api/forms', isLoggedIn, (req,res) => {
  const form = req.body;
  if(!form){
      res.status(400).end();
  } else {
      formsDao.createForm(form, req.user.id)
          .then((id) => res.status(201).json({"id" : id}))
          .catch((err) => res.status(500).json(error),
      );
  }
});

app.put('/api/forms/update/published/:formId',  async(req,res) => {
  const formId = req.params.formId;
try {
  let task = await formsDao.updatePublished(formId);
  res.json(`The number of responders for the form with: ${formId} was increased`);
} catch (error) {
  res
    .status(500)
    .json(
      `Error while updating the status of the survey with id: ${id}   ` +
        error
    );
}
});

app.put('/api/forms/update/number/:formId',  async(req,res) => {
  const formId = req.params.formId;
try {
  let task = await formsDao.updateNumberOfResponders(formId);
  res.json(`The number of responders for the form with: ${formId} was increased`);
} catch (error) {
  res
    .status(500)
    .json(
      `Error while updating the status of the survey with id: ${id}   ` +
        error
    );
}
});



app.get('/api/questions/form/:formId', (req,res)=>{
  const formId=req.params.formId
  questionsDao.listAllQuestions(formId)
      .then((questions)=>{res.json(questions)})
      .catch((error)=>{res.status(500).json(error)} )
})

app.post("/api/questions", (req, res) => {
  const question = req.body;
  if (!question) {
    res.status(400).end();
  } else {
    questionsDao
      .createQuestion(question)
      .then((id) => res.status(201).json({ id: id }))
      .catch((err) => res.status(500).json(error));
  }
});

// get possible number of errors
app.get('/api/questions/errors/:formId', (req,res)=>{
  const formId=req.params.formId
  questionsDao.numOfPossibleErrors(formId)
      .then((questions)=>{res.json(questions)})
      .catch((error)=>{res.status(500).json(error)} )
})

app.delete("/api/questions/delete/:questionId", (req, res) => {
  const questionId = req.params.questionId;
  questionsDao
    .deleteQuestion(questionId)
    .then((id) =>
      res
        .status(204)
        .json(
          `Selected question with id:${questionId} was deleted`
        )
    )
    .catch((err) =>
      res
        .status(500)
        .json(
          `Error while deleting the question with id:${req.params.questionId}  ` + err
        )
    );
});




/// for Answers

app.get('/api/answers/form/:formId', (req,res)=>{
  const formId=req.params.formId
  questionsDao.listQuestionAndAnswer(formId)
      .then((questions)=>{res.json(questions)})
      .catch((error)=>{res.status(500).json(error)} )
})

app.post("/api/answers", (req, res) => {
  const answer = req.body;
  if (!answer) {
    res.status(400).end();
  } else {
    questionsDao
      .createAnswer(answer)
      .then((id) => res.status(201).json({ id: id }))
      .catch((err) => res.status(500).json(error));
  }
});















/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
  })(req, res, next);
});

// ALTERNATIVE: if we are not interested in sending error messages...
/*
app.post('/api/sessions', passport.authenticate('local'), (req,res) => {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.json(req.user);
});
*/

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
});



// activate the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
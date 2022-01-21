const url='http://localhost:3000'

/*APIs FOR FORMS */

//Getting all forms
async function getallForms(){

    const response=await fetch(`http://localhost:3000/api/forms`);
    if(response.ok){
      const responseBody=await response.json();
      return responseBody;
    }
     else{
         try {
           const err=await response.json();
           throw err.message;}
            catch(err){throw err;}
         }
     }



     async function getFormsOfUser(userId) {
      let url1 = "/api/forms/user";
      const response = await fetch(url + url1);
      if(response.ok){
        const responseBody=await response.json();
        return responseBody;
      }
       else{
           try {
             const err=await response.json();
             throw err.message;}
              catch(err){throw err;}
           }
       }

// api for adding the form 
function addForm(form) {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3000/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify({code: exam.coursecode, score: exam.score, date: exam.date}),
        body : JSON.stringify({title:form, num:0, published:0, user:1
        })
        }).then((response) => {
          if (response.ok) {
            resolve(null);
          } else {
            // analyze the cause of error
            response.json()
              .then((message) => { reject(message); }) // error message in the response body
              .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
          }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }   
  
  
  function publishForm(formId){
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3000/api/forms/update/published/'  + formId , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
      },
        body : JSON.stringify({})
   
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((obj) => { reject(obj); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }

  function increaseNumber(formId){
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3000/api/forms/update/number/'  + formId , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
      },
        body : JSON.stringify({})
   
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((obj) => { reject(obj); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }



  
  

/*APIs FOR QUESTIONS   */   

// Getting all questions
async function getallQuestions(formId){

  const response=await fetch(`http://localhost:3000/api/questions/form/`+formId);
  if(response.ok){
    const responseBody=await response.json();
    return responseBody;
  }
   else{
       try {
         const err=await response.json();
         throw err.message;}
          catch(err){throw err;}
       }
   }  

// number of possible errors

// Getting all questions
async function getNumOfPossibleErrors(formId){

  const response=await fetch(`http://localhost:3000/api/questions/errors/`+formId);
  if(response.ok){
    const responseBody=await response.json();
    return responseBody;
  }
   else{
       try {
         const err=await response.json();
         throw err.message;}
          catch(err){throw err;}
       }
   } 

   // api for adding the questions 
function addQuestion(question) {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //body: JSON.stringify({code: exam.coursecode, score: exam.score, date: exam.date}),
      body : JSON.stringify({ text:question.text, columns:question.columns, rows:question.rows,
        form_id:question.form_id, min:question.min, max:question.max
      })
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

// api/serv/delete
   
function deleteQuestion(questionId) {
  // call: DELETE /api/exams/:coursecode
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/api/questions/delete/' + questionId, {
      method: 'DELETE',
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}




/*APIs FOR ANSWERS   */   

// Getting all questions
async function getQuestAndAnsw(formId){

  const response=await fetch(`http://localhost:3000/api/answers/form/`+formId);
  if(response.ok){
    const responseBody=await response.json();
    return responseBody;
  }
   else{
       try {
         const err=await response.json();
         throw err.message;}
          catch(err){throw err;}
       }
   } 
// add answer

function addAnswer(answer) {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/api/answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({ name:answer.name, form_id:answer.form_id, question_id:answer.question_id, 
        answers: answer.answers,code:answer.code
      })
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}




// User APIs
  // Login

  async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user.name;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }
  
  // logout
  async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
  }
  

  // getting user info 
  async function getUserInfo() {
    const response = await fetch(url + '/api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }



     const API = { 
         getallForms, addForm, publishForm, getFormsOfUser,increaseNumber,
         getallQuestions, addQuestion, deleteQuestion, getNumOfPossibleErrors,
         logIn, logOut, getUserInfo,
         getQuestAndAnsw, addAnswer
        };
export default API;
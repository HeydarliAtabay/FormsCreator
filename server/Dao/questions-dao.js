'use strict';

// open the database
const db = require('../db');



//get all questions
exports.listAllQuestions = (formId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM question WHERE form_id=?  ';
      db.all(sql, [formId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const questions = rows.map((question) => ({ question_id: question.question_id, text: question.text, columns: question.columns,
     rows: question.rows, form_id:formId, max:question.max, min:question.min }));
        resolve(questions);
      });
    });
  };

  //get all questions with answers
exports.listQuestionAndAnswer = (formId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM question as q INNER JOIN answers as a ON q.question_id=a.question_id WHERE q.form_id=?  ';
    db.all(sql, [formId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const questions = rows.map((question) => ({ question_id: question.question_id, text: question.text, columns: question.columns,
   rows: question.rows, form_id:formId, max:question.max, min:question.min, name:question.name, answers:question.answers, code:question.code }));
      resolve(questions);
    });
  });
};

  

 /// Adding question for the form //////

 exports.createQuestion=(question)=>{
  return new Promise((resolve, reject)=>{
    const sql = 'INSERT INTO question(text,columns,rows,form_id,min,max) VALUES(?,?,?,?,?,?)'
    db.run(sql, [question.text,question.columns,question.rows,question.form_id,question.min,question.max], function(err){
      if(err){
        reject(err);
        return;
      }
      console.log(this.lastID);
      resolve(this.lastID)
    });
  });
};

///// Deleting questions
exports.deleteQuestion = function(questionId) {
  return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM question WHERE question_id=?';
      db.run(sql, [questionId], (err) => {
          if(err)
              reject(err);
          else 
              resolve(null);
      })
  });
}


/// Adding answer of question //////

exports.createAnswer=(answer)=>{
  return new Promise((resolve, reject)=>{
    const sql = 'INSERT INTO answers(name,form_id,question_id,answers,code) VALUES(?,?,?,?,?)'
    db.run(sql, [answer.name, answer.form_id, answer.question_id, answer.answers,answer.code], function(err){
      if(err){
        reject(err);
        return;
      }
      console.log(this.lastID);
      resolve(this.lastID)
    });
  });
};


/// Count number of possible errors

exports.numOfPossibleErrors = (formId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) as possibleErrors FROM question  WHERE form_id=? AND min>=1   ';
    db.all(sql, [formId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const count=rows
      resolve(count);
    });
  });
};

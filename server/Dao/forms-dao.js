'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

// open the database
const db = require('../db');



//get all forms
exports.listAllForms = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM forms ';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const forms = rows.map((form) => ({ id: form.id, title: form.title, num: form.num,
      published: form.published, user:form.user  }));
        resolve(forms);
      });
    });
  };

   // list forms for user
   exports.listUserForms = (userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM forms WHERE user=?';
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const forms = rows.map((form) => ({ id: form.id, title: form.title, num: form.num,
          published: form.published, user:form.user  }));
            resolve(forms);
      });
    });
  };

  exports.createForm=(form,userId)=>{
    return new Promise((resolve, reject)=>{
      const sql = 'INSERT INTO forms(title, num, published, user) VALUES(?,?,?,?)'
      
  
      db.run(sql, [form.title,0,0,userId], function(err){
        if(err){
          reject(err);
          return;
        }
        console.log(this.lastID);
        resolve(this.lastID)
      });
    });
  };

  exports.updatePublished = (formId) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE forms SET published=1 WHERE id = ? ';
      db.run(sql, [formId], function (err) {
        if (err) {
          console.log(err)
          reject(err);
          return;
        }
        resolve(this.lastID); // changed from resolve(exports.getTask(this.lastID) because of error "not found" (wrong lastID)
      });
    });
  };

  exports.updateNumberOfResponders = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE forms SET num=num+1 WHERE id = ? ';
      db.run(sql, [id], function (err) {
        if (err) {
          console.log(err)
          reject(err);
          return;
        }
        resolve(this.lastID); // changed from resolve(exports.getTask(this.lastID) because of error "not found" (wrong lastID)
      });
    });
  };
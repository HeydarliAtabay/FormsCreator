import {React} from 'react'
import {ListGroup,Table, Form} from 'react-bootstrap'


function AnswersItem(props){
    const{answer}=props
    
    let columns = answer.columns;
    let rows = answer.rows;
    let checkedA= answer.answers;

    const checkedAnswers = checkedA.split(";");
    const columnArr = columns.split(";");
    const rowsArr=rows.split(";");
    
    let columnsIds=new Array(columnArr.length)
    let rowsIds=new Array(rowsArr.length)
    for(let i=0;i<columnArr.length;i++){
        columnsIds[i]=i+1
    }
    for(let i=0;i<rowsArr.length;i++){
        rowsIds[i]=i+1
    }

    return(
<>
<h5>{answer.text}</h5>
<Table>
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
                                let elem=rindex+""+cindex
                                let checked=0
                                for(let i=0;i<checkedAnswers.length;i++){
                                    if(checkedAnswers[i]===elem){
                                        checked=1
                                    }
                                }
                                return(
                                <td>
                                  <Form.Check type="checkbox"id={rindex+""+cindex}
                                    onChange={(ev)=>{
                                        console.log(ev.target.id)
                                      
                                      }}
                                    checked={checked}
                                  />  
                                </td>
                                ) })  }
                    </tr>
                ) } )
        }
    </tbody>
</Table>
</>
    )
}


function Answers(props){
    const {answers }=props
        return(
         <>
         <div className="cont">
         
         <Form >
        <h2 className="successText">Scroll Down for checking answers</h2>
      <Form.Group>
 
      <ListGroup as="ul" variant="flush" key={answers.id}>
          {answers.map((a,index) => {
            return (
              <div key={index}>
              {(index===0) && <h3>{`Answers of ${answers[index].name}`}</h3> }
              {(index>0 && answers[index].code!==answers[index-1].code) && <h3>{`Answers of ${answers[index].name}`}</h3>}
                <ListGroup.Item as="li" key={index}>
                  <AnswersItem
                  answer={a}
                  />
                </ListGroup.Item>
              </div>
            );
          })}
        </ListGroup>
        </Form.Group>
          </Form>
        </div>
        
        </>
    )
}


export default Answers
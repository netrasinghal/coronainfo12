const express = require('express')
var mysql = require('mysql')

const app=express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/',(req,res) =>{
	res.status(200).send('Server is working')
})

function connectDB()
{
    var con=mysql.createConnection({
		host: 'localhost',
		port: '3306',
		user: 'root',
		password: 'password',
		database: 'corona_data'
    })
    return con
}

app.post('/chatbot',(req,res)=>{
      var connection = connectDB()
    const state=req.body.queryResult.parameters.state

    connection.connect((err)=>{
      if (err)
      {
          return res.json({
              fulfillmentText: "There is some problem right now in processing. Please try after sometime.",
              source: 'chatbot'
          })
      }
      console.log("Connected!")

    var sql = "select * from corona_tb where State = '" + state + "'"
    connection.query(sql, function(err,result) {
console.log(err);
      if (result.length > 0)
      {
         var msg="Okay! So the total number of cases for "+ result[0].State + "are "+ result[0].Cases + ". Active cases are "+ result[0].Active+". Recovered cases are "+ result[0].Recovered+". Total deaths are "+ result[0].Deaths
            return res.json({
                fulfillmenttext: msg,
                source: 'chatbot'
            })
        }
        else
        {
            return res.json({
                fulfillmentText: "No state found",
                source: 'chatbot'
            })
        }
      })
    });
})
app.listen(3000, () => { console.log('Server running on port 3000!') })

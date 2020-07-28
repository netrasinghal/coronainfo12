const express = require('express')
const mysql = require('mysql')

require('dotenv').config()

const app=express()

app.use(express.json())

app.post('/connectdb',(req,res)=>{
    const state=req.queryResult.perameter.state
    var msg=''
    
    const connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'password',
        database:'corona_data'
    })
    
    connection.query('select * from corona_tb', (error,results,fields)=>{
        resolve(results)
    })
    results.map(user=>{
        if(state===user.State){
            msg='Okay! So the toal number of cases for ${user.state} are ${user.Cases}. Active cases are ${user.Active}. Recovered cases are ${user.Recovered}. Total deaths are ${user.Deaths}'
            return res.json({
                fulfillmenttext: msg,
                source: 'connectdb'
            })
        }
        else
        {
            msg='Invalid Email ID!'
            return res.json({
                fulfillmenttext: msg,
                source: 'connectdb'
            })
        }
    });
    connection.end()
})


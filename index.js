const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const mysql = require('mysql');

exports.FirstBot = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });

function connectToDB(){
    const connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'password',
        database:'corona_data'
    });
    return new Promise((resolve,reject)=>{
        connection.connect();
        resolve(connection);
    });
}

function queryDB(connection){
    return new Promise((resolve,reject)=>{
        connection.query('select * from corona_tb', (error,results,fields)=>{
            resolve(results);
        });
    });
}

function handleReadFromMySQL(agent){
    const state = agent.parameters.state;
    return connectToDB()
    .then(connection=>{
        return queryDB(connection)
        .then(result=>{
            console.log(result);
            result.map(user=>{
                if(state===user.State){
                    agent.add('Okay! So the toal number of cases for ${user.state} are ${user.Cases}. Active cases are ${user.Active}. Recovered cases are ${user.Recovered}. Total deaths are ${user.Deaths}');
                }
            });
            connection.end();
        });
    });
}

let intentMap = new Map();
intentMap.set('connectdb', handleReadFromMySQL);
agent.handleRequest(intentMap);
});

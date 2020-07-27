'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require('axios');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function getSpreadsheetData(){
    return axios.get('https://sheetdb.io/api/v1/39oraf7bripew');
  }

  function welcome(agent) {
    const state = agent.parameters.state;
    return getSpreadsheetData().then(res => {
        res.data.map(datareq => {
            if(datareq.State === state )
            agent.add(`Okay! So the toal number of cases for $(state) are $(datareq.Cases). Active cases are $(datareq.Active). Recovered cases are $(datareq.Recovered). Total deaths are $(datareq.Deaths)`);
        });
    });
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent - state', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});

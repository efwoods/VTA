/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

'use strict';

require('dotenv').config({
  silent: true
});

const express = require('express'); // app server
const bodyParser = require('body-parser'); // parser for post requests
const numeral = require('numeral');
const fs = require('fs'); // file system for loading JSON

const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const assistant = new AssistantV1({ version: '2018-02-16' });
const discovery = new DiscoveryV1({ version: '2018-03-05' });
const nlu = new NaturalLanguageUnderstandingV1({ version: '2018-03-16' });

const WatsonDiscoverySetup = require('./lib/watson-discovery-setup');
const WatsonAssistantSetup = require('./lib/watson-assistant-setup');
const utils = require('./lib/utils.js');

const DEFAULT_NAME = 'watson-quantum-chatbot';
const DISCOVERY_DOCS = [
  './data/discovery/docs/qc-textbook-chapter1.docx'
];


const app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// setupError will be set to an error message if we cannot recover from service setup or init error.
let setupError = '';

let discoveryParams; // discoveryParams will be set after Discovery is validated and setup.
const discoverySetup = new WatsonDiscoverySetup(discovery);
const discoverySetupParams = { default_name: DEFAULT_NAME, documents: DISCOVERY_DOCS };
discoverySetup.setupDiscovery(discoverySetupParams, (err, data) => {
  if (err) {
    handleSetupError(err);
  } else {
    console.log('Discovery is ready!');
    discoveryParams = data;
  }
});

let workspaceID; // workspaceID will be set when the workspace is created or validated.
const assistantSetup = new WatsonAssistantSetup(assistant);
const workspaceJson = JSON.parse(fs.readFileSync('data/conversation/workspaces/quantum.json'));
const assistantSetupParams = { default_name: DEFAULT_NAME, workspace_json: workspaceJson };
assistantSetup.setupAssistantWorkspace(assistantSetupParams, (err, data) => {
  if (err) {
    handleSetupError(err);
  } else {
    console.log('Watson Assistant is ready!');
    workspaceID = data;
  }
});

// Endpoint to be called from the client side
app.post('/api/message', function(req, res) {
  if (setupError) {
    return res.json({ output: { text: 'The app failed to initialize properly. Setup and restart needed.' + setupError } });
  }

  if (!workspaceID) {
    return res.json({
      output: {
        text: 'Assistant initialization in progress. Please try again.'
      }
    });
  }
  console.log('app.post called.....');

  const payload = {
    workspace_id: workspaceID,
    input: {}
  };

  // common regex patterns
  const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  // const regadhaar = /^\d{12}$/;
  // const regmobile = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
  if (req.body) {
    if (req.body.input) {
      let inputstring = req.body.input.text;
      console.log('input string ', inputstring);
      const words = inputstring.split(' ');
      console.log('words ', words);
      inputstring = '';
      for (let i = 0; i < words.length; i++) {
        if (regpan.test(words[i]) === true) {
          // const value = words[i];
          words[i] = '1111111111';
        }
        inputstring += words[i] + ' ';
      }
      // words.join(' ');
      inputstring = inputstring.trim();
      console.log('After inputstring ', inputstring);
      // payload.input = req.body.input;
      payload.input.text = inputstring;
    }
    if (req.body.context) {
      // The client must maintain context/state
      payload.context = req.body.context;
    }
  }
  callAssistant(payload);
  /**
   * Send the input to the Assistant service.
   * @param payload
   */
  function callAssistant(payload) {
    console.log('callAssistant called.....');
    const queryInput = JSON.stringify(payload.input);
    console.log('assistant.input :: ', JSON.stringify(payload.input));
    // const context_input = JSON.stringify(payload.context);
  //return;
    assistant.message(payload, function(err, data) {
      if (err) {
        return res.status(err.code || 500).json(err);
      } else {
        console.log('assistant.message :: ', JSON.stringify(data));
        // lookup actions
        utils.checkForLookupRequests(data, workspaceID, discovery, discoveryParams, function(err, data) {
          if (err) {
            return res.status(err.code || 500).json(err);
          } else {
            return res.json(data);
          }
        });
      }
    });
  }
});

/**
 * Handle setup errors by logging and appending to the global error text.
 * @param {String} reason - The error message for the setup error.
 */
function handleSetupError(reason) {
  setupError += ' ' + reason;
  console.error('The app failed to initialize properly. Setup and restart needed.' + setupError);
  // We could allow our chatbot to run. It would just report the above error.
  // Or we can add the following 2 lines to abort on a setup error allowing Bluemix to restart it.
  console.error('\nAborting due to setup error!');
  process.exit(1);
}

module.exports = app;


const CREATE_INTENTS  = 'create_intents';
const CREATE_ENTITIES = 'create_entities';
const LIST_INTENTS = 'list_intents';
const LIST_ENTITIES = 'list_entities';
const DISCOVERY_ACTION = 'rnr'; // Replaced RnR w/ Discovery but Assistant action is still 'rnr'.

/**
 * Looks for actions requested by Assistant service and provides the requested data.
 */
function checkForLookupRequests(data, workspaceID, discovery, discoveryParams, callback) {
    console.log('checkForLookupRequests');
  
    if (data.context && data.context.action && data.context.action.lookup && data.context.action.lookup != 'complete') {
      const payload = {
        workspace_id: workspaceID,
        context: data.context,
        input: data.input
      };
      
     if (data.context.action.lookup === LIST_INTENTS) { // <<<<<<< work in progress
        console.log('************** List Intents *************** InputText : ' + payload.input.text + ' ' + data.context.action.lookup);
        console.log(data);
        assistant.listIntents(payload, function(err, intent_data) {
                console.log(data);
                console.log(intent_data);
                if (err) {
                console.error(err);
                } else {
      //                      console.log(JSON.stringify(data, null, 2));
                        
                        //          discoveryResponse = bestPassage.passage_text; 
      //                      if (data.output) {
                                let i;
                                for(i =0; i < intent_data.intents.length; i++){
                                        data.output.text.push(JSON.stringify(intent_data.intents[i].intent));
                                        data.output.text.push(JSON.stringify(intent_data.intents[i].description));
                        console.log(data);
                                }
                }
                        // Clear the context's action since the lookup and append was completed.
                    data.context.action = {};
                        callback(null, data);
                // Clear the context's action since the lookup was completed.
                        payload.context.action = {};
                        
        });
      } else if (data.context.action.lookup === LIST_ENTITIES) {
        console.log('************** List Intents *************** InputText : ' + payload.input.text + ' ' + data.context.action.lookup);
        console.log(data);
        assistant.listEntities(payload, function(err, entity_data) {
                console.log(data);
                console.log(entity_data);
                if (err) {
                console.error(err);
                } else {
    //                      console.log(JSON.stringify(data, null, 2));
                        
                        //          discoveryResponse = bestPassage.passage_text; 
    //                      if (data.output) {
                                let i;
                                for(i =0; i < entity_data.entities.length; i++){
                                        data.output.text.push(JSON.stringify(entity_data.entities[i].intent));
                                        data.output.text.push(JSON.stringify(entity_data.entities[i].description));
                        console.log(data);
                                }
                }
                        // Clear the context's action since the lookup and append was completed.
                    data.context.action = {};
                        callback(null, data);
                // Clear the context's action since the lookup was completed.
                        payload.context.action = {};
                        
        });
      } else if (data.context.action.lookup === CREATE_INTENTS) {
        console.log('hello')
        console.log('************** Create Entity *************** InputText : ' + payload.input.text + ' ' + data.context.action.lookup);
        console.log(data);
        var params = {
                workspace_id: workspaceID,
                entity: payload.input.text,
                values: [
                {
                value: payload.input.text
                }
                ]
        };
        assistant.createEntity(params, function(err, response) {
          if (err) {
                console.error(err);
          } else {
                console.log(JSON.stringify(response,null, 2));
          }
        });
      } else if (data.context.action.lookup === CREATE_ENTITIES) {
        console.log('hello')
        console.log('************** Create Entity *************** InputText : ' + payload.input.text + ' ' + data.context.action.lookup);
        console.log(data);
        var params = {
                workspace_id: workspaceID,
                entity: payload.input.text,
                values: [
                {
                value: payload.input.text
                }
                ]
        };
        conversation.createEntity(params, function(err, response) {
          if (err) {
                console.error(err);
          } else {
                console.log(JSON.stringify(response,null, 2));
          }
        });
  } else if (data.context.action.lookup === DISCOVERY_ACTION) {
        console.log('************** Discovery *************** InputText : ' + payload.input.text + ' ' + data.context.action.lookup); // + data.context.action.lookup < ------------- new
        let discoveryResponse = '';
        if (!discoveryParams) {
          console.log('Discovery is not ready for query.');
          discoveryResponse = 'Sorry, currently I do not have a response. Discovery initialization is in progress. Please try again later.';
          if (data.output.text) {
            data.output.text.push(discoveryResponse);
          }
          // Clear the context's action since the lookup and append was attempted.
          data.context.action = {};
          callback(null, data);
          // Clear the context's action since the lookup was attempted.
          payload.context.action = {};
        } else {
          const queryParams = {
            natural_language_query: payload.input.text,
            passages: true
          };
          Object.assign(queryParams, discoveryParams);
          discovery.query(queryParams, (err, searchResponse) => {
            discoveryResponse = 'Sorry, currently I do not have a response. Our Customer representative will get in touch with you shortly.';
            if (err) {
              console.error('Error searching for documents: ' + err);
            } else if (searchResponse.passages.length > 0) {
              const bestPassage = searchResponse.passages[0]; // THIS WILL GRAB THE ZEROETH PASSAGE
              console.log('Passage score: ', bestPassage.passage_score);
              console.log('Passage text: ', bestPassage.passage_text);
  
              // Trim the passage to try to get just the answer part of it.
              const lines = bestPassage.passage_text.split('\n');
              let bestLine;
              let questionFound = false;
              for (let i = 0, size = lines.length; i < size; i++) {
                const line = lines[i].trim();
                if (!line) {
                  continue; // skip empty/blank lines
                }
                if (line.includes('?') || line.includes('<h1')) {
                  // To get the answer we needed to know the Q/A format of the doc.
                  // Skip questions which either have a '?' or are a header '<h1'...
                  questionFound = true;
                  continue;
                }
                bestLine = line; // Best so far, but can be tail of earlier answer.
                if (questionFound && bestLine) {                                                                                  // THIS MEANS THE CODE IS SEARCHING FOR A SINGLE ANSWER AFTER A QUESTION. THE DOCUMENTS NEED TO BE IN Q&A FORMAT
                  // We found the first non-blank answer after the end of a question. Use it.
                  break;
                }
              }
              discoveryResponse =
                bestLine || 'Sorry I currently do not have an appropriate response for your query. Our customer care executive will call you in 24 hours.';
  
            }
  
            //     discoveryResponse = bestPassage.passage_text; 
            console.log('before the push');
            console.log(JSON.stringify(data, null, 2));
            if (data.output.text) {
              data.output.text.push(discoveryResponse);    // <<<< THIS SHOWS THE DISCOVERY RESPONSE ON THE FRONT END
              console.log(JSON.stringify(data, null, 2));
            }
              // Clear the context's action since the lookup and append was completed.
            data.context.action = {};
            callback(null, data);
  
            // Clear the context's action since the lookup was completed.
            payload.context.action = {};
          });
        }            
      } else {
          callback(null, data);
          return;
      }
    } else {
      callback(null, data);
      return;
    }
  }
  
  module.exports = {
    checkForLookupRequests: checkForLookupRequests
  };
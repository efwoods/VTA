var debugFlag = process.argv.indexOf('debug') > -1;
var nodehun = require('/home/admin/ACCT2020-chatbot/node_modules/nodehun/build/' + (debugFlag ? 'Debug' : 'Release') + '/nodehun');
var fs = require('fs');

var dict = new nodehun(fs.readFileSync('/home/admin/ACCT2020-chatbot/node_modules/nodehun/examples/dictionaries/en_US.aff'),fs.readFileSync('/home/admin/ACCT2020-chatbot/node_modules/nodehun/examples/dictionaries/en_US.dic'));
// var words = ['original', 'roach', 'erasee', 'come', 'consol', 'argumnt', 'gage',
//	     'libary', 'lisence', 'principal', 'realy', 'license', 'suprise', 'writting'];

function doCall(word, callback) {
    dict.spellSuggestions(word, function(err, correct, suggestions, origWord) {
		if (err) throw err;
//		if (correct)
//		console.log(origWord + ' is spelled correctly!');
//		else
//		console.log(origWord + ' not recognized. Suggestions: ' + suggestions);
		val = {
			err: err,
			correct: correct,
			origWord: origWord,
			suggestions: suggestions
		}
		return callback(val);
	});
}

function addMember(array, index, callback){
	doCall(array[index], function(val){
//		console.log(val);
//		console.log(index);
//		console.log(array[index]);
//		console.log(val.origWord);
		array[val.origWord] = val;
//		console.log(array[val.origWord]);
		index = index + 1;
		return callback(array, index);
	});
}
	
function Loop(array, index, callback) {
	addMember(array, index, function(array2, index2){
//		console.log(index);
//		console.log(index2);
		if(index2 === array2.length) {
			return callback(array2);
		}
		else{
			Loop(array2, index2, callback);
		}
	});
}

function analyze(array, index, callback){
	Loop(array, index, function(complete_array){
		console.log('!!!!!!!!!!!!!!!!!' + complete_array);
		return callback(complete_array);
/*		
		for(i = 0; i < complete_array.length; i++) {
			
			console.log(complete_array);
			
			
		}
*/		
	});
}
/*
analyze(words, 0, function(complete_array){
//	for(i = 0; i < complete_array.length; i++) {
			console.log(complete_array);		
//	}
});
*/
module.exports = {
	analyze
}	

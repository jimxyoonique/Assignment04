var express = require("express"), 
	http = require("http"),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	app = express();

// set up a static file directory to use for default routing // also see the note below about Windows 
app.use(express.static(__dirname + "/client"));
app.use(bodyParser.urlencoded({'extended': true}));
app.use(bodyParser.json());

http.createServer(app).listen(3000);

console.log("Listen to port 3000");

var uri =  'mongodb://jyoon:helloavery@ds139267.mlab.com:39267/cpsc473'
mongoose.connect(uri);

// Create schema for questions
var QuestionSchema = mongoose.Schema({
	'question': String, 
	'answerID': String
});

var Question = mongoose.model('Question', QuestionSchema);

var count = 4;

// Retrieves a question from the database
app.get('/question', function(req, res) {
	'use strict';

	var randomNum = Math.floor((Math.random() * 3) +1);

	Question.findOne({answerID: randomNum}, function(err, q) {
		if (err) console.log(err);

		res.json(q);
	});
});

// User creates a question and goes to the database
app.post('/question', function(req, res) {
	'use strict';

	var createQuestion = new Question();
	createQuestion.question = req.body.question;
	createQuestion.answerID = count; 
	count += 1; 

	createQuestion.save(function(err) {
		if (err) 
			return console.log(err);
		else {
			res.send({message: 'Question has been submitted'});
		}
	});
});


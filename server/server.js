var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    // res.send(todos);
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/123245
 // id disponible en el objeto request
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  // valid id using isValis
  if (!ObjectID.isValid(id)) {
    // 404 - send back empty send
    return res.status(404).send();
  }

  // findById
  Todo.findById(id).then((todo) => {
    // success
    if (!todo) {
      // if no todo - 404 with empty body
      return res.status(404).send();
    }
      // if todo - send it back
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};

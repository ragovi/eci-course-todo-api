require('./config/config');

const _ = require ('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT;

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


app.get('/users/me', authenticate, (req, res) =>{
  res.send(req.user);
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

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
        return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });

});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  // usamos lodash para coger sólo las properties que queremos actualizar
  //si el usuario manda otra properties, no las vamos a actualizar en DDBB
  // como completedAt o _id
  var body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime(); // timestamp number Jan 1st, 1970
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
})


  app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body); // sino han metido el email, se pondrá aqui

    user.save().then((user) => {
      return user.generateAuthToken();
      // res.send({user});
    }).then((token) => {
      // me encadeno a la promise devuelta en user model
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    });
  });

  // POST /users/login {email, password}
  // coger el email y password del body
  // comprobar el password, recuerda que lo tenemos hasheado en DDBB
  // send 200 with email and password
  app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']); // siempre es una buena practica
    var {email, password} = body;

    User.findByCredentials(email, password).then((user) => {
      // res.send(user);
      // return para mantener la cadena de promise viva, asi que si se produce un error ira al catch
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send();
    });
  });


  app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
      // res.send(todos);
      res.send({todos});
    }, (e) => {
      res.status(400).send(e);
    });
  });


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};

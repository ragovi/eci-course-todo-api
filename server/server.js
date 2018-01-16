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

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
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
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  // valid id using isValis
  if (!ObjectID.isValid(id)) {
    // 404 - send back empty send
    return res.status(404).send();
  }

  // findById
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
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

app.delete('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  } catch (e) {
    res.status(400).send();
  }

});

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
})


  app.post('/users', async (req, res) => {
    try {
      const body = _.pick(req.body, ['email', 'password']);
      const user = new User(body); // sino han metido el email, se pondrá aqui
      await user.save();
      const token = await user.generateAuthToken();

      res.header('x-auth', token).send(user);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  // POST /users/login {email, password}
  // coger el email y password del body
  // comprobar el password, recuerda que lo tenemos hasheado en DDBB
  // send 200 with email and password
  app.post('/users/login', async (req, res) => {
    try {
      const body = _.pick(req.body, ['email', 'password']); // siempre es una buena practica
      var {email, password} = body;
      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken();

      res.header('x-auth', token).send(user);
    } catch (e) {
      res.status(400).send();
    }
  });


  app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then((todos) => {
      // res.send(todos);
      res.send({todos});
    }, (e) => {
      res.status(400).send(e);
    });
  });

// la ruta es privada, requiere que estes autenticado
// y en el middleware ponemos la token en la request, recuerda
app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};

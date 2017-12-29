const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');


const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  // uno con auth tokens
  _id: userOneId,
  email: 'raul@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  // otro sin auth tokens
  _id: userTwoId,
  email: 'tom@example.com',
  password: 'userTwoPass'
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 123
}];

const populateTodos = ((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
});

const populateUsers = ((done) => {
  User.remove({}).then(() => {
    // con save si pasamos por el middleware, en UserSchema.pre middleware
    var userOne = new User(users[0]).save(); // esto devuelve una Promise
    var userTwo = new User(users[1]).save(); // esto tambien devuelve una Promise
    // en vez de hacer el then aqui, hago un return, asi puedo enganchar el then mas abajo
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
});

module.exports = {todos, populateTodos, users, populateUsers};

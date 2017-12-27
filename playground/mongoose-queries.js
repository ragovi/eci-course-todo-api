const {ObjectID} = require('mongodb');

const {mongoose} = require ('./../server/db/mongoose');
const {Todo} = require ('./../server/models/todo');
const {User} = require ('./../server/models/user');

// var id ='5a43c827e7187a42545a16d911';
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// var id ='6a43c827e7187a42545a16d9';

// Todo.find({
//   _id: id //convert string to objectid, lo hace mongoose
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({ // es exactamente igual
//   _id: id //convert string to objectid, lo hace mongoose
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo by Id', todo);
// }).catch((e) => console.log(e));

var id = '5a4390506f8411411c4bac4e';

User.findById(id).then((user) => {
  if (!user) {
    return console.log('Unable to find user');
  }

  console.log(JSON.stringify(user, undefined, 2));
}, (err) => {
  console.log(err);
});

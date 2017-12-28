const {ObjectID} = require('mongodb');

const {mongoose} = require ('./../server/db/mongoose');
const {Todo} = require ('./../server/models/todo');
const {User} = require ('./../server/models/user');

// Todo.remove().then((result) => {
//   console.log(result);
// });

// obtenemos el doc borrado
Todo.findOneAndRemove({_id: '5a442fa612efa4f3d09180be'}).then((todo) => {

})

// igual pero devuelve el doc
// Todo.findByIdAndRemove('5a442fa612efa4f3d09180be').then((todo) => {
//   console.log(todo);
// });

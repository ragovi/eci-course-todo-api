// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);
// var user = {name:'Raúl', age: 38};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  var db = client.db('TodoApp');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5a42cd60a2161c3d1c0ed69c')
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').find({name: 'Raúl'}).toArray().then((docs) => {
    console.log('Users with name Raúl');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  // client.close();
});

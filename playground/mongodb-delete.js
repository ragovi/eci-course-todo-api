const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  var db = client.db('TodoApp');

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  //deleteOne

  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=>{
  //   console.log(result);
  // });

  //findOneAndDelete

  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  // challenge
  // db.collection('Users').deleteMany({name: 'Raúl'}).then((result) => {
  //   console.log('#deleteMany', result);
  // });

  db.collection('Users').deleteMany({name: 'Raúl'});

  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5a42d0e65ecd4403a008a9c2')
  }).then((result) => {
    console.log('#findOneAndDelete:', result);
  });

  // client.close();
});

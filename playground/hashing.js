const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// primer argumento es un numero de rounds para generar el salt. Cuanto más alto mas tarda
// bcrypt es un algoritmo lento, lo que es bueno para prevenor ataques por fuerza brute
// hay quien usa 120 rounds
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   })
// });

var hashedPassword = '$2a$10$BRky1heQXLdr9NQ6tnQVxO3MmLEIY4sYh41eNW8DQRUDvl/1ZHbSa';

bcrypt.compare('123!', hashedPassword, (err, res) => {
  console.log(res);
});

// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);


// 256 es el numero de bits que tendrá el hash

// var message = 'I am user number 3';
// var hash = SHA256(message).toString(); // el resultado es un onjeto
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4 //usuario numero 4, supongamos
// };
//
// // creamos un token hash, asi al enviar al cliente, este no lo puede manipular cuando lo mande de vuelta
// var token = {
//   data,
//   // salt the hash, añadir algo al hash que es único
//   // el cliente podría cambiar el id, y volver a hashear, y funcionaría el truco si acierta con
//   // el algoritmo, por eso añadimo un Salt
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// // token.hash.id = 5; //cambiamos el usuario
// // pero no tenemos el salt!!!
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   // no ha sido manipulado
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust!!!');
// }

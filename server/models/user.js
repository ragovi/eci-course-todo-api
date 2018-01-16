const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      // en vez de pasar una arrow function, simplificamos porque solo hay una linea
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
      isAsync: false
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  }]
}, {
  usePushEach: true
});

UserSchema.methods.toJSON = function () {
  var user = this;
  // user.toObject coje el objeto user mongoose y convertirlo en un regular object
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// instance methods
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  // vamos a usar $pull operator en mogo, que permite borrar elementos de un array
  var user = this;

  // return para encadenarnos a la promise
  return user.update({
    $pull: {
      tokens: {
        // token: token
        token
      }
    }
  });
};

// model method: statics es como method, pero para model methos, son globales al modelo
UserSchema.statics.findByToken = function (token) {
  var User = this; // model as this binding
  var decoded;

  // try catch porque el jwt.verify puede lanzar errores por umltiples motivos
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  };

  // succesful decode
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  // devolvemos con un return para poder engarcharnos en server, tal y como hemos defindo
  return User.findOne({email}).then((user) =>{
    if (!user) {
      // esperamos siempre una promise, asi que devolvemos reject, lo que disparara el catch
      // en serverjs
      console.log('no user found');
      return Promise.reject();
    }

    // tenemos que comparar el hash devuelto, por lo que tenemos que
    // llamar a bcrypt
    // bcrypt solo funciona con callbacks, pero como queremos trabajar con promises
    // devuelvo una promise como wrapper
    return new Promise((resolve, reject) => {
      // use bcrypt cmpare password and user.password
      // si no coinciden reject, so coinciden devuelvo el usuario con la promise resolved
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};



UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});


var User = mongoose.model('User', UserSchema);

module.exports = {User};

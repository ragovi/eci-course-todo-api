var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  // hacemos un require del fichero json, y
  // automaticamente tendremos parseado el json como
  // un oijeto javascript

  var config = require ('./config.json');
  // bracket notation
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}

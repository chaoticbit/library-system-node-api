const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'library-api'
    },
    db_host: 'localhost',
    db_user: 'root',
    db_password: 'michbharii',
    db_name: 'library_system',
    db_port: 3306,
    api_key: 'library.v1',
    token_secret: 'this is matrix',
    port: process.env.PORT || 3000,
    poolConfig: {
        pool: true,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: 'info.soapbox.team@gmail.com',
            pass: 'michbharii'
        }
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'library-api'
    },
    port: process.env.PORT || 3000,
  },

  production: {
    root: rootPath,
    app: {
      name: 'library-api'
    },
    port: process.env.PORT || 3000,
  }
};

module.exports = config[env];

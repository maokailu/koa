const Client = require("mysql-pro");
const client = new Client({     
    mysql: {
          user: 'root',
          password: '123456',
          database: 'air',
          host: 'localhost',
    }
}); 

module.exports = client;
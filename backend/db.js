const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'expense_manager'
});

connection.connect((err) => {
  if (err) {
    console.log('Erreur de connexion à la base de données');
  } else {
    console.log('Connexion MySQL réussie');
  }
});

module.exports = connection;
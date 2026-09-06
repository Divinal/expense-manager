const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = require('./db');

app.use(cors());
app.use(bodyParser.json());

// Ajouter une transaction
app.post('/transactions', (req, res) => {
  const { title, amount, type, category } = req.body;

  const sql = `
    INSERT INTO transactions(title, amount, type, category)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [title, amount, type, category], (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({
        message: 'Transaction ajoutée avec succès'
      });
    }
  });
});

// Récupérer toutes les transactions
app.get('/transactions', (req, res) => {
  db.query('SELECT * FROM transactions ORDER BY created_at DESC', (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

// Supprimer une transaction
app.delete('/transactions/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM transactions WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({
        message: 'Transaction supprimée'
      });
    }
  });
});
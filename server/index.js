const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
const port = process.env.PORT||3000;


// PostgreSQL connection setup
const pool = new Pool({
    connectionString: process.env.DBConfigLink,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(bodyParser.json());

app.use(cors());

// Get all items
app.get('/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items ORDER BY createTime DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add a new item
app.post('/items', async (req, res) => {
  const { finished, description, createTime } = req.body;
  try {
    await pool.query('INSERT INTO items (finished, description, createTime) VALUES ($1, $2, $3)', [finished, description, createTime]);
    res.status(201).send('Item added');
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an item
app.put('/items/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { finished, description } = req.body;
  try {
    await pool.query('UPDATE items SET finished = $1, description = $2 WHERE id = $4', [finished, description, id]);
    res.send('Item updated');
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete an item
app.delete('/items/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    res.send('Item deleted');
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

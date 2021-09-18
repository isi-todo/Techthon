var express = require('express');
var router = express.Router();

const mysql = require('mysql2/promise');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'TECHTHON'
};

/* PUT */
router.put('/', async (req, res, next) => {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    await conn.beginTransaction();

    const [rows1] = await conn.execute('DROP TABLE IF EXISTS stock', []);
    const [rows2] = await conn.execute('DROP TABLE IF EXISTS purchase', []);
    const [rows3] = await conn.execute('DROP TABLE IF EXISTS purchase_item', []);
    const [rows4] = await conn.execute('CREATE TABLE stock (id INT NOT NULL PRIMARY KEY, name VARCHAR(255) NOT NULL, price INT NOT NULL DEFAULT 0, on_sale BOOLEAN NOT NULL DEFAULT false, count INT NOT NULL DEFAULT 0)', []);
    const [rows5] = await conn.execute('INSERT INTO stock (id, name, price, on_sale, count) values (?, ?, ?, ?, ?)', [1, 'pen', 100, true, 100]);

    await conn.commit();
    console.log('init completed');

    res.json({
      status_code: 200,
      method: 'PUT'
    });
  } catch (e) {
    await conn.rollback();
    console.log(e);
  } finally {
    conn.end();
  }
});

module.exports = router;
var express = require('express');
var router = express.Router();

const mysql = require('mysql2/promise');
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'TECHTHON'
};

/* PUT */
router.put('/', async (req, res, next) => {
  let conn = await mysql.createConnection(dbConfig);
  try {
    await conn.beginTransaction();

    const [rows1] = await conn.execute('DROP TABLE IF EXISTS purchase_item', []);
    const [rows2] = await conn.execute('DROP TABLE IF EXISTS stock', []);
    const [rows3] = await conn.execute('DROP TABLE IF EXISTS purchase', []);
    const [rows4] = await conn.execute('CREATE TABLE stock (id INT NOT NULL PRIMARY KEY, name VARCHAR(255) NOT NULL, price INT NOT NULL DEFAULT 0, on_sale BOOLEAN NOT NULL DEFAULT false, count INT NOT NULL DEFAULT 0)', []);
    const [rows5] = await conn.execute('INSERT INTO stock (id, name, price, on_sale, count) values (?, ?, ?, ?, ?)', [1, 'pen', 100, true, 100]);
    const [rows6] = await conn.execute('CREATE TABLE purchase (id INT NOT NULL PRIMARY KEY, bought_at DATETIME NOT NULL, staff_name VARCHAR(255) NOT NULL)', []);
    const [rows7] = await conn.execute('CREATE TABLE purchase_item (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, purchase_id INT NOT NULL, stock_id INT NOT NULL, price INT NOT NULL, bought_count INT NOT NULL, INDEX (purchase_id), INDEX (stock_id), FOREIGN KEY (purchase_id) REFERENCES purchase (id), FOREIGN KEY (stock_id) REFERENCES stock (id))', []);

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
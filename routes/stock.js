var express = require('express');
var router = express.Router();

const mysql = require('mysql2/promise');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'TECHTHON'
};

/* 商品在庫登録 */
router.post('/create/single', async (req, res, next) => {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    await conn.beginTransaction();

    const [rows1, fields1] = await conn.query('INSERT INTO stock set ?', req.body);

    await conn.commit();
    console.log('insert completed');

    res.json({
      status_code: 201,
      method: 'POST'
    });
  } catch (e) {
    await conn.rollback();
    console.log(e)
    res.json({
      status_code: 400,
      method: 'POST'
    })
  } finally {
    conn.end();
  }
});

/* 商品在庫詳細 */
router.get('/detail/:id?', async (req, res, next) => {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);

    const [rows1, fields1] = await conn.execute('select id, name, price, on_sale, count from stock where id = ?', [req.params.id]);

    console.log('select completed');

    if (rows1.length > 0) {
      res.json({
        status_code: 200,
        method: 'GET',
        item: rows1[0]
      });
    } else {
      res.json({
        status_code: 404,
        method: 'GET'
      });  
    }
  } catch (e) {
    console.log(e)
    res.json({
      status_code: 400,
      method: 'GET'
    });  
  } finally {
    conn.end();
  }
});


module.exports = router;
var express = require('express');
var router = express.Router();

const mysql = require('mysql2/promise');
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'TECHTHON'
};

/* 商品購入履歴 詳細取得 */
router.get('/detail/:id?', async (req, res, next) => {
  let conn = await mysql.createConnection(dbConfig);
  try {

    const [rows1, fields1] = await conn.execute('select id, bought_at, staff_name from purchase where id = ?', [req.params.id]);
    const [rows2, fields2] = await conn.execute('select a.stock_id, b.name, a.price, a.bought_count from purchase_item a, stock b where a.stock_id = b.id and a.purchase_id = ? order by a.stock_id', [req.params.id])

    console.log('select completed');

    if (rows1.length > 0) {
      var purchase = rows1[0];
      purchase.items = rows2;
      res.json({
        status_code: 200,
        method: 'GET',
        purchase: purchase
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


/* 商品購入 */
router.post('/create', async (req, res, next) => {
  let conn = await mysql.createConnection(dbConfig);
  try {
    await conn.beginTransaction();

    
    //購入履歴テーブル登録
    const [rows1, fields1] = await conn.query('INSERT INTO purchase (id,bought_at,staff_name) values (?,?,?)', [req.body.id, req.body.bought_at, req.body.staff_name]);

    for(let item of req.body.items) {
      //商品在庫テーブル更新
      const [rows2, fields2] = await conn.query('UPDATE stock SET count = (SELECT count FROM (SELECT count FROM stock WHERE id = ?) TMP) - ? WHERE id = ?', [item.stock_id, item.bought_count, item.stock_id]);
      //購入履歴内訳テーブル登録
      const [rows3, fields3] = await conn.query('INSERT INTO purchase_item (purchase_id,stock_id,price,bought_count) values (?,?,(SELECT price from stock where id = ?), ?)', [req.body.id, item.stock_id, item.stock_id, item.bought_count]);
    }

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

module.exports = router;
var express = require('express');
var router = express.Router();

const mysql = require('mysql2/promise');
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'TECHTHON'
};

/* 商品在庫登録 */
router.post('/create/single', async (req, res, next) => {
  let conn = await mysql.createConnection(dbConfig);
  try {
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
  let conn = await mysql.createConnection(dbConfig);
  try {

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

/* 商品在庫一覧 */
router.get('/list', async (req, res, next) => {
  let conn = await mysql.createConnection(dbConfig);
  try {
    let sql = 'select id, name, price, on_sale, count from stock';
    let condition = '';
    let sort = ' order by id asc';
    let param = [];

    // 最小値
    if (req.query.min_count) {
      condition ? condition += ' and ' : condition += ' where ';
      condition += 'count >= ?';
      param.push(Number(req.query.min_count));
    }

    // 最大値
    if (req.query.max_count) {
      condition ? condition += ' and ' : condition += ' where ';
      condition += 'count <= ?';
      param.push(Number(req.query.max_count));
    }

    // 販売中
    if (req.query.on_sale) {
      condition ? condition += ' and ' : condition += ' where ';
      condition += 'on_sale = ?';
      param.push(req.query.on_sale == 'true' ? true : false);
    }

    const [rows1, fields1] = await conn.execute(sql + condition + sort, param);

    console.log('select completed');

    res.json({
      status_code: 200,
      method: 'GET',
      items: rows1
    });

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

/* 商品在庫更新 */
router.put('/update/:id', async (req, res, next) => {
  let conn = await mysql.createConnection(dbConfig);
  try {
    await conn.beginTransaction();

    const [rows1, fields1] = await conn.query('update stock set ? where id = ?', [req.body, req.params.id]);

    await conn.commit();
    console.log('update completed');

    if(rows1.affectedRows > 0) {
      res.json({
        status_code: 200,
        method: 'PUT'
      });
    } else {
      res.json({
        status_code: 404,
        method: 'PUT'
      });
    }
  } catch (e) {
    await conn.rollback();
    console.log(e)
    res.json({
      status_code: 400,
      method: 'PUT'
    })
  } finally {
    conn.end();
  }
});

/* 商品在庫削除 */
router.delete('/delete/:id', async (req, res, next) => {
  let conn = await mysql.createConnection(dbConfig);
  try {
    await conn.beginTransaction();

    const [rows1, fields1] = await conn.query('delete from stock where id = ?', req.params.id);

    await conn.commit();
    console.log('delete completed');

    if(rows1.affectedRows > 0) {
      res.json({
        status_code: 200,
        method: 'DELETE'
      });
    } else {
      res.json({
        status_code: 404,
        method: 'DELETE'
      });
    }
  } catch (e) {
    await conn.rollback();
    console.log(e)
    res.json({
      status_code: 400,
      method: 'DELETE'
    })
  } finally {
    conn.end();
  }
});

module.exports = router;
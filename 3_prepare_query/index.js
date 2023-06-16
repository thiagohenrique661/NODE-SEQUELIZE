const express = require('express');
const exphbs = require('express-handlebars');
const pool = require('./db/conn');
const app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(
    express.urlencoded({
      extended: true,
    }),
    )

app.use(express.json());

app.get('/', (req, res) =>{
    res.render('home');
});

app.post('/product/insertproduct', (req,res) => {
    const title = req.body.title;
    const amount = req.body.amount;
    const insert = `INSERT INTO product (??, ??) VALUES (?,?)`
    const data = ['title', 'amount', title, amount]
    pool.query(insert,data, function(err){

        if (err) {
            console.log(err);  
            return;
        }
        res.redirect('/');
    })

});

app.get('/product', (req,res) =>{
    const select = "SELECT * FROM product";

    pool.query(select, function(err,data){
        if(err) {
            console.log(err);
            return;
        }  
        const product = data;
        console.log(product);
        res.render('product', {product});
    });
});

app.get('/product/:id', (req,res) =>{
    const id = req.params.id
    const select_where = `SELECT * FROM product WHERE ?? = ?`;
    const data = ['id', id];
    pool.query(select_where, data, function(err,data){
        if(err){
            console.log(err);
            return;
        }
        const product_where= data[0];
        console.log(data[0]);

        res.render('product_where', {product_where});
    });
});

app.get('/product/edit/:id', function(req,res){
    const id = req.params.id;
    const select_where = `SELECT * FROM product WHERE ?? = ?`;
    const data = ['id', id];

    pool.query(select_where, data, function(err,data) {
        if(err){
            console.log(err);
            return;
        }
        const product_where= data[0];
        console.log(data[0]);
        res.render('editproduct', {product_where});
    });

});

app.post('/product/updateproduct', (req,res) =>{

    const id = req.body.id;
    const title = req.body.title;
    const amount = req.body.amount;

    const sql = `UPDATE product SET ?? = ?, ?? = ? WHERE ?? = ?`;
    const data = ['title', title, 'amount', amount, 'id', id];

    pool.query(sql, data, function(err) {
        if (err) {
            console.log(err);
            return;    
        }

        res.redirect(`/product`)
    });



});

app.post('/product/remove/:id', function (req, res) {
    const id = req.params.id
  
    const query = `DELETE FROM product WHERE ?? = ?`
    const data = ['id', id];

    pool.query(query,data, function (err) {
      if (err) {
        console.log(err)
      }
  
      res.redirect(`/product`)
    })
  })

  app.listen(3000);
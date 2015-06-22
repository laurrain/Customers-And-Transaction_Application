//'use strict';
var express = require("express"),
   exphbs = require("express-handlebars"),

    mysql = require('mysql'), 
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser'),
    customer = require('./routes/customers'),
     parseurl = require('parseurl'),
     //morgan = require('morgan'),
     cookieParser = require('cookie-parser'),
     session = require('express-session'),
     
      app = express();
      dbOptions = {
      host: 'localhost',
      user: 'root',
      password: '42926238',
      port: 3306,
      database: 'mysql'
};

app.engine("handlebars", exphbs({defaultLayout:"main"}))
app.set("view engine", "handlebars")

app.use("/static", express.static("views"))
app.use("/static", express.static("."))

app.use(myConnection(mysql, dbOptions, 'single'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
  store = require("memory-store");
  //assert = require("assert")

app.set('trust proxy', 1) // trust first proxy 
app.use(session({
  secret: 'lau lo',
  resave: true,
  saveUninitialized: false,
  cookie : {maxAge : 5*60000}
}))

app.get("/", customer.checkUser, function(req, res){  

  res.render("home", {administrator : administrator})
})

app.get('/login',function(req, res){
  res.render('login', {layout:false})
})

app.post("/login", customer.userAuth)

app.get("/logout", function(req, res, next){
  if (req.session.user){
    delete req.session.user;
    res.redirect("/login")
  }
  // the user is not logged in redirect him to the login page-

  res.redirect('/login');
}, function(req, res){
  
  res.redirect("/login");

})

app.get('/signup', function(req,res){
  res.render("signup", {data:customer, layout: false})
})

app.post('/signup', customer.signup);




app.get('/customer',customer.checkUser, customer.show_customer);

app.get('/customer/edit/:id', customer.get);
app.post('/customer/update/:id', customer.update);
app.get('/customer/sort', customer.sort);
app.get('/customer/sort',customer.sort_transaction);
app.get('/customer/delete/:id',customer.delete);


//app.post('/CustTran/update_CustTran/:id', customer.update_CustTran);

app.get('/add', customer.checkUser, function(req,res){
  res.render("add", {data:customer})
})
app.post('/customer/add_customer', customer.checkUser, customer.add_customer);

app.get('/add_CustTran', customer.checkUser, function(req,res){
  res.render("add_CustTran", {data:customer})
})
app.get('/CustTran/add_CustTran/:id', customer.get_CustTran);
app.post('/CustTran/add_CustTran/:id', customer.add_CustTran);

app.get('/add_BulkTran',customer.checkUser, function(req,res){
  res.render("add_BulkTran", {data:customer})
})
app.get('/CustTran/add_BulkTran', customer.checkUser, customer.get_BulkTran);
app.post('/CustTran/add_BulkTran', customer.checkUser, customer.add_CustTran);

app.get('/customer/view/:id', customer.get_View)

app.get('/custTran',customer.checkUser, function (req, res, next) {
  req.getConnection(function(err, connection){
    if (err) 
      return next(err);
        connection.query('SELECT * from CustTran', [], function(err, results) {
          if (err) return next(err);
        res.render( 'custTran', {
          CustTran : results
        });
        
      });

  });
});

app.get('/transaction', customer.checkUser, function (req, res, next) {
  req.getConnection(function(err, connection){
    if (err) 
      return next(err);
        connection.query('SELECT * from customer', [], function(err, results) {
          if (err) return next(err);
        res.render( 'transaction', {
          customer : results
        });
        
      });

  });
});

app.get('/bulk', customer.checkUser, function(req,res){
  res.render("bulk")
})

app.get('/customer/sort/:sort_field', customer.checkUser, customer.sort_transaction);

app.get('/customer/sort/:sort_field', customer.checkUser, customer.sort_view );

app.get('/enquiries', customer.checkUser, function (req, res, next) {
  req.getConnection(function(err, connection){
    if (err) 
      return next(err);
        connection.query('SELECT * from customer', [], function(err, results) {
          if (err) return next(err);
        res.render( 'enquiries', {
          customer : results
        });
        
      });

  });
});

app.get('/users', customer.getUserData);

app.get("/*",function(req, res){
res.render("home")
})

var port = process.env.PORT || 5000;

var server = app.listen(port, function(){

  console.log("server is running on " + server.address().address + ":" +server.address().port)

})
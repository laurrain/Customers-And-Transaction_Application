//'use strict';
var express = require("express"),
   exphbs = require("express-handlebars"),

    mysql = require('mysql'), 
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser'),
    customersMethods = require('./routes/customersMethods'),
    userMethods = require('./routes/userMethods'),
    enquiriesMethods = require('./routes/enquiriesMethods'),
    bulkTransactionMethods = require('./routes/bulkTransactionMethods'),
    transactionMethods = require('./routes/transactionMethods')
    parseurl = require('parseurl'),
    session = require('express-session');
    
var app = express(),
    dbOptions = {
      host: 'localhost',
      user: 'root',
      password: '42926238',
      port: 3306,
      database: 'mysql'
    };

app.engine("handlebars", exphbs({defaultLayout:"main"}))
app.set("view engine", "handlebars")
app.use(express.static('public'));
app.use(myConnection(mysql, dbOptions, 'single'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.set('trust proxy', 1) // trust first proxy 
app.use(session({
  secret: 'lau lo',
  resave: true,
  saveUninitialized: false,
  cookie : {maxAge : 30*60000}
}))

app.get("/", userMethods.checkUser, function(req, res){  

  res.render("home", {administrator : administrator})
})
app.get('/login',function(req, res){
  res.render('login')
})
app.post("/login", userMethods.authUser)

app.get("/logout", function(req, res, next){

  if (req.session.user){
    delete req.session.user;
    res.redirect("/login")
  }else {
    // the user is not logged in redirect him to the login page-
    res.redirect("/login")
  }
});

app.get('/signup', function(req,res){
  res.render("signup")
});

app.post('/signup', userMethods.signup);
app.get("/admin_panel", userMethods.checkUser, userMethods.adminPanel)
app.post("/admin_panel/:username", userMethods.checkUser, userMethods.promoteUser)


app.get('/customer',userMethods.checkUser, customersMethods.show);
app.get('/customer/edit/:id', customersMethods.get);
app.post('/customer/update/:id', customersMethods.update);
app.get('/sort', userMethods.checkUser, customersMethods.sort);
app.get('/customer/delete/:id',customersMethods.delete);
app.get('/customers_add', userMethods.checkUser, function(req,res){
  res.render("customers_add", {data:customersMethods})
})
app.post('/customer/customers_add', userMethods.checkUser, customersMethods.add);
app.get('/customers_add', userMethods.checkUser, function(req,res){
  res.render("customers_add", {data:customersMethods})
})
app.get('/customer/customersList/:Name', customersMethods.getSearchCustomers);
app.get('/customer/search/:searchValue', customersMethods.getSearchCustomers);



app.get('/sort', userMethods.checkUser, transactionMethods.sort);
app.get('/CustTran/customer_Transaction_add/:id', transactionMethods.get);
app.post('/CustTran/customer_Transaction_add/:id', transactionMethods.add);

app.get('/add', userMethods.checkUser, function(req,res){
  res.render("add", {data:customer})
})
app.get('/CustTran/add', userMethods.checkUser, bulkTransactionMethods.get);
app.post('/CustTran/add', userMethods.checkUser, bulkTransactionMethods.add);

app.get('/customer/view/:id', enquiriesMethods.get)

app.get('/custTran', userMethods.checkUser, function (req, res, next) {
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

app.get('/customer_Transaction', userMethods.checkUser, function (req, res, next) {
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

app.get('/bulk', userMethods.checkUser, function(req,res){
  res.render("bulk")
})

app.get('/customer/sort/:sort_field', userMethods.checkUser, transactionMethods.sort);

app.get('/customer/sort/:sort_field', userMethods.checkUser, enquiriesMethods.sort);

app.get('/customer_Enquiries', userMethods.checkUser, function (req, res, next) {
  req.getConnection(function(err, connection){
    if (err) 
      return next(err);
        connection.query('SELECT * from customer', [], function(err, results) {
          if (err) return next(err);
        res.render( 'customer_Enquiries', {
          customer : results
        });
        
      });

  });
});

app.get('/users', userMethods.getUserData);

app.get("/*", userMethods.checkUser,function(req, res){
  res.redirect("/login");
})

var port = process.env.PORT || 5000;

var server = app.listen(port, function(){

  console.log("server is running on " + server.address().address + ":" +server.address().port)

})
//'use strict';
var express = require("express")
var exphbs = require("express-handlebars")

   var mysql = require('mysql'), 
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser'),
     //passport = require('passport'),
     //flash = require('connect-flash'),

     //morgan = require('morgan'),
     //cookieParser = require('cookie-parser'),
     session = require('express-session'),
     
      app = express();
   dbOptions = {
      host: 'localhost',
      user: 'root',
      password: '42926238',
      port: 3306,
      database: 'mysql'
};

    //var configDB = require('./config/database.js');
 // required for passport
//app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session
 
  parseurl = require('parseurl');

app.engine("handlebars", exphbs({defaultLayout:"main"}))
app.set("view engine", "handlebars")

app.use("/static", express.static("views"))
app.use("/static", express.static("."))

app.use(myConnection(mysql, dbOptions, 'single'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// require('./config/passport')(passport); // pass passport for configuration

// set up our express application
//app.use(morgan('dev')); // log every request to the console
//app.use(cookieParser()); // read cookies (needed for auth)

// routes ======================================================================
//require('./app/customers.js')(app, passport); // load our routes and pass in our app and fully configured pas

 customer = require('./routes/customers'),
  store = require("memory-store");
  assert = require("assert")

app.set('trust proxy', 1) // trust first proxy 
app.use(session({
  secret: 'lau lo',
  resave: true,
  saveUninitialized: true,
  cookie : {maxAge : 60000}
}))

store.set[{username:"attilaz", password:"123wa"},{username: "wilfred", password: "123w"}, {username:"andre",password:"123p"}]
//assert.equal(store.get[{username:"attilaz", password:"123wa"},{username: "wilfred", password: "123w"}, {username:"andre",password:"123p"}]
//store.delete("foo")
store.get[{username:"attilaz", password:"123wa"},{username: "wilfred", password: "123w"}, {username:"andre",password:"123p"}]

 
var checkUser = function(req, res, next){
    if(req.session.user){
    return next();
  }else{
  
    res.redirect('login');
  }
}

app.get('/customer',checkUser, customer.show_customer);

app.get('/customer/edit/:id', checkUser, customer.get);
app.post('/customer/update/:id', customer.update);
app.get('/customer/sort', checkUser, customer.sort);
app.get('/customer/sort',checkUser, customer.sort_transaction);
app.get('/customer/delete/:id',checkUser, customer.delete);


//app.post('/CustTran/update_CustTran/:id', customer.update_CustTran);

app.get('/add', checkUser, function(req,res){
  res.render("add", {data:customer})
})
app.post('/customer/add_customer', customer.add_customer);

app.get('/add_CustTran', checkUser, function(req,res){
  res.render("add_CustTran", {data:customer})
})
app.get('/CustTran/add_CustTran/:id',checkUser, customer.get_CustTran);
app.post('/CustTran/add_CustTran/:id', customer.add_CustTran);

app.get('/add_BulkTran',checkUser, function(req,res){
  res.render("add_BulkTran", {data:customer})
})
app.get('/CustTran/add_BulkTran', customer.get_BulkTran);
app.post('/CustTran/add_BulkTran', customer.add_CustTran);


//app.get('/view', function(req,res){
  //res.render("view",{data: customer})
//})
app.get('/customer/view/:id', checkUser, customer.get_View)
//app.post('/customer/display/:id', customer.display);



app.get('/custTran',function (req, res, next) {
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

app.get('/transaction', checkUser, function (req, res, next) {
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

app.get('/bulk', checkUser,function(req,res){
  res.render("bulk")
})

app.get('/customer/sort/:sort_field', checkUser, customer.sort_transaction);

app.get('/customer/sort/:sort_field', checkUser, customer.sort_view );

app.get('/enquiries', checkUser, function (req, res, next) {
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


app.get('/login', function(req, res){
  res.render('login')
})


app.post('/login', function(req,res,next){
   var user = JSON.parse(JSON.stringify(req.body)),
   username = req.session.user = user.username;
   password = req.session.user = user.password;
   
   store.get[{username:"attilaz", password:"123wa"},{username: "wilfred", password: "123w"}, {username:"andre",password:"123p"}]
   store.set[{username:"attilaz", password:"123wa"},{username: "wilfred", password: "123w"}, {username:"andre",password:"123p"}]
  if(req.session.store === store.set[{username:"attilaz", password:"123wa"},{username: "wilfred", password: "123w"}, {username:"andre",password:"123p"}]){
    //var user = req.session.username;
    req.session.store = username;
    req.session.store = password;
    
    //res.end('done');
    res.redirect('/');

  }
  else{
    res.redirect('/login')
  }

});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

app.get('/signup', function(req,res){
  res.render("signup", {data:customer})
})

app.post('/UserData/signup', customer.signup);


app.get("/", function(req, res){
  res.render("home")
})

var server = app.listen(3000, function(){
  console.log("server is running on " + server.address().address + ":" +server.address().port)

})
var express = require("express")
var exphbs = require("express-handlebars")

    mysql = require('mysql'), 
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser'),
    customer = require('./routes/customers'),
    
    //transaction = require('./routes/customers');
    
 app = express();

var dbOptions = {
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

/**var cancel = function(req, res,next){
      req.getConnection(function(err){
                    console.log("Error Adding : %s ",err );
              res.redirect('/customer');
        });
  };

}**/

//setup middleware
app.use(myConnection(mysql, dbOptions, 'single'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/customer', customer.show_customer);

app.get('/customer/edit/:id', customer.get);
app.post('/customer/update/:id', customer.update);
app.get('/customer/sort', customer.sort);
app.get('/customer/delete/:id', customer.delete);

app.get('/CustTran/add_CustTran/:id', customer.get_CustTran);
//app.post('/CustTran/update_CustTran/:id', customer.update_CustTran);

app.get('/add', function(req,res){
  res.render("add", {data:customer})
})
app.post('/customer/add_customer', customer.add_customer);

app.get('/add_CustTran', function(req,res){
  res.render("add_CustTran", {data:customer})
})
app.post('/CustTran/add_CustTran/:id', customer.add_CustTran);


app.get('/view', function(req,res){
  res.render("view",{data: customer})
})
app.post('/customer/display', customer.display);


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

//app.get('/add_CustTran', function(req,res){
  //res.render("add_CustTran",{data: customer})
//})


app.get('/transaction',function (req, res, next) {
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

app.get('/enquiries',function (req, res, next) {
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


app.get("/", function(req, res){
  res.render("home")
})



var server = app.listen(3000, function(){
  console.log("server is running on " + server.address().address + ":" +server.address().port)

})
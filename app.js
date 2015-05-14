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

//app.get('customer/add', customer.get_customer);
//app.post('customer/cancel', customer.cancel);
app.post('/customer/add_customer', customer.add_customer);
app.get('/customer/edit/:id', customer.get);
app.post('/customer/update/:id', customer.update);
app.get('/customer/sort', customer.sort);
app.get('/customer/delete/:id', customer.delete);



app.get("/", function(req, res){
  res.render("home")
})



var server = app.listen(3000, function(){

  console.log("server is running on " + server.address().address + ":" +server.address().port)

})
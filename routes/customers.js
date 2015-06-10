
/***
 * A very basic CRUD example using MySQL
 */	

//todo - fix the error handling

exports.show_customer = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT * from customer', [], function(err, results) {
        	if (err) return next(err);
    		res.render( 'home', {
    			customer : results
    		});
    		
      });
	});
};

/**exports.display = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		var data = JSON.parse(JSON.stringify(req.body));
		connection.query('SELECT ALL Name, Balance, Date, Reference, Amount, DC from customer inner join CustTran on Number=customer.id where Name ="?"', [data], function(err, results) {
        	if (err) return next(err);
    		res.render( 'view', {
    			customer : results
    		});
    		
      });
	});
};**/

exports.show_CustTran = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT * from CustTran ', [], function(err, results) {
        	if (err) return next(err);
    		res.render( 'custTran', {
    			customer : results
    		});
    		
      });
	});
};



exports.add_customer = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err){ 
			return next(err);
		}
		
		var input = JSON.parse(JSON.stringify(req.body));
		var data = {
            		Account : input.Account,
            		Name : input.Name,
        	};
        	
		connection.query('insert into customer set ?', data, function(err, results) {
        	if (err)
                console.log("Error inserting : %s ", err );
         
          		res.redirect('/customer');
      	});
	
	});
};

exports.add_CustTran = function (req, res, next) {
  var id = req.params.id;
	req.getConnection(function(err, connection){
		if (err){ 
			return next(err);
		}
		
		var input = JSON.parse(JSON.stringify(req.body));
		var data = {
                Date : input.Date,
                Reference : input.Reference,
                Amount: input.Amount,
                DC: input.DC
              };
        	
		connection.query('INSERT INTO CustTran SET ? ', [data], function(err, results) {
        	if (err)
                console.log("Error inserting : %s ", err);
    connection.query('UPDATE customer set customer.Balance=(select Amount from CustTran where CustTran.Number = customer.id )+? where id=?', [data.DC,id], function(err, rows){
          if (err){
                    console.log("Error Updating : %s ",err );
          }
         
          		res.redirect('/CustTran');
      	});
	    });
	});
};
//, {data:rows}

exports.add_BulkTran = function (req, res, next) {
  var id = req.params.id;
  req.getConnection(function(err, connection){
    if (err){ 
      return next(err);
    }
    
    var input = JSON.parse(JSON.stringify(req.body));
    var data = {
                Date : input.Date,
                Reference : input.Reference,
                Amount: input.Amount,
                DC: input.DC
              };
          
    connection.query('INSERT INTO CustTran SET ? ', [data], function(err, results) {
          if (err)
                console.log("Error inserting : %s ", err);
    connection.query('UPDATE customer INNER JOIN CustTran ON customer.Balance = CustTran.Amount WHERE Balance = ?', [data.Balance,data.Amount], function(err, rows){
          if (err){
           
                    console.log("Error Updating : %s ",err );
          }
    connection.query('UPDATE customer set customer.Balance=(select Amount from CustTran where CustTran.Number = customer.id )+? where id=?', [data.DC,id], function(err, rows){
          if (err){
                    console.log("Error Updating : %s ",err );
          }
         
              res.redirect('/CustTran');
        });
         
              res.redirect('/CustTran');
        });
      });
  });

};
exports.sort = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT ALL Account,Name,Balance FROM customer ORDER BY Name ASC ', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'home', {
    			customer : results
    		});
      });
	});
};

exports.sort_transaction = function (req, res, next) {
  var sortField = req.params.sort_field;

  console.log(sortField)

  req.getConnection(function(err, connection){
    if (err) 
      return next(err);
    connection.query('SELECT Account,Name,Balance FROM customer ORDER BY ??', [sortField], function(err,results) {
          
          console.log(results);

          if (err) {
            console.log(err+'err');
            return next(err);
          }
        res.render( 'transaction',{
         customer: results
        });
      });
  });
};

exports.sort_view = function (req, res, next) {
  var sortField = req.params.sort_field;

  console.log(sortField)

  req.getConnection(function(err, connection){
    if (err) 
      return next(err);
    connection.query('SELECT Account,Name,Balance FROM customer ORDER BY ??', [sortField], function(err,results) {
          
          console.log(results);

          if (err) {
            console.log(err+'err');
            return next(err);
          }
        res.render( 'enquiries',{
         customer: results
        });
      });
  });
};


exports.get = function(req, res, next){
	var id = req.params.id;
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM customer WHERE id = ?', [id], function(err,rows){
			if(err){
    				console.log("Error Selecting : %s ",err );
			}
			res.render('edit',{page_title:" edit Customers - Node.js", data : rows[0]});      
		}); 
	});
};


exports.get_CustTran = function(req, res, next){
	var id = req.params.id;
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM  customer WHERE id = ?', [id], function(err,rows){
			if(err){
    				console.log("Error Selecting : %s ",err );
			}
			res.render('add_CustTran',{page_title:" add_CustTran Customers - Node.js", data : rows[0]});      
		}); 
	});
};

exports.get_BulkTran = function(req, res, next){
  var id = req.params.id;
  req.getConnection(function(err, connection){
    connection.query('SELECT * FROM  CustTran ', [], function(err,results){
      if(err){
            console.log("Error Selecting : %s ",err );
      }
      res.render('add_BulkTran',{page_title:" add_BulkTran Customers - Node.js", data : results});      
    }); 
  });
};

exports.get_View = function(req, res, next){
  var id = req.params.id;
  req.getConnection(function(err, connection){
    connection.query('SELECT ALL Name, Balance, Date, Reference, Amount, DC from customer inner join CustTran on Number=customer.id where id =??', [id], function(err,rows){
      if(err){
            console.log("Error Selecting : %s ",err );
      }
      res.render('view',{page_title:" view Customers - Node.js", data : rows[0]});      
    }); 
  });
};

exports.getUserData = function(req, res, next){
  //var id = req.params.user_id;
  //var data = JSON.parse(JSON.stringify(req.body));
  //var input = JSON.parse(JSON.stringify(req.body));
  //var data={
    //username: input.username,
    //password: input.password
  //}
  req.getConnection(function(err, connection){
    connection.query('SELECT  username, password from UserData' , [], function(err,results){
      if(err){
            console.log("Error Selecting : %s ",err );
      }
      res.render('users',{data : results});      
    }); 
  });
};

exports.signup = function (req, res, next) {
  var id = req.params.user_id;
  req.getConnection(function(err, connection){
    if (err){ 
      return next(err);
    }
    
    var input = JSON.parse(JSON.stringify(req.body));
    var data = {
                name : input.name,
                username : input.username,
                password: input.password
              };
          
    connection.query('INSERT INTO UserData SET ? ', [data], function(err, results) {
          if (err)
                console.log("Error inserting : %s ", err);
         
              res.redirect('/users');
        });
      });
};

exports.update = function(req, res, next){

	var data = JSON.parse(JSON.stringify(req.body));
    	var id = req.params.id;
    	req.getConnection(function(err, connection){
    		connection.query('UPDATE customer SET ? WHERE id = ?', [data, id], function(err, rows){
    			if (err){
              			console.log("Error Updating : %s ",err );
    			}
          		res.redirect('/customer');
    		});
    });
};

/**exports.update_CustTran = function(req, res, next){

	var data = JSON.parse(JSON.stringify(req.body));
    	var id = req.params.id;
    	req.getConnection(function(err, connection){
    		connection.query('UPDATE CustTran SET ? WHERE id = ?', [data, id], function(err, rows){
    			if (err){
              			console.log("Error Updating : %s ",err );
    			}
          		res.redirect('/CustTran');
    		});

    		connection.query('UPDATE customer SET ? WHERE id = ?', [data, id], function(err, rows){
    			if (err){
              			console.log("Error Updating : %s ",err );
    			}
          		res.redirect('/CustTran');
    		});
    		
    });
};**/

exports.delete = function(req, res, next){
	var id = req.params.id;
	req.getConnection(function(err, connection){
		connection.query('DELETE customer, CustTran FROM customer INNER JOIN CustTran ON customer.Balance = CustTran.Amount WHERE customer.Balance=0.00 AND CustTran.Amount=0.00', [id], function(err,rows){
			if(err){
    				console.log("Error Selecting : %s ",err );
			}
			res.redirect('/customer');
		});
	});
};

/**module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}**/


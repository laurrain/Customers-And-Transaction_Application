
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
    connection.query('UPDATE customer INNER JOIN CustTran ON customer.Balance = CustTran.Amount WHERE Balance = ?', [data.Balance,data.Amount], function(err, rows){
          if (err){
                    console.log("Error Updating : %s ",err );
          }
         
          		res.redirect('/CustTran');
      	});
	    });
	});
//});
};
//, {data:rows}
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

exports.get_View = function(req, res, next){
  var id = req.params.id;
  req.getConnection(function(err, connection){
    connection.query('SELECT ALL Name, Balance, Date, Reference, Amount, DC from customer inner join CustTran on Number=customer.id where id =?', [id], function(err,rows){
      if(err){
            console.log("Error Selecting : %s ",err );
      }
      res.render('view',{page_title:" view Customers - Node.js", data : rows[0]});      
    }); 
  });
};

//'SELECT * FROM  customer WHERE id = ?'

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


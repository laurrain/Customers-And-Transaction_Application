
exports.show = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT * from customer', [], function(err, results) {
        	if (err) return next(err);
    		res.render( 'customer', {
    			customer : results
    		});
    		
      });
	});
};


exports.add = function (req, res, next) {
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

exports.sort = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT ALL Account,Name,Balance FROM customer ORDER BY Name ASC ', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'customer', {
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

exports.getSearchCustomers = function(req, res, next){
    req.getConnection(function(err, connection){
        if(err)
            return next(err);

        var searchValue = req.params.searchValue;
        
        var processResults = function(err, results){
                if (err) return next(err);
                                console.log(results);

                res.render('customersList', {
                    username: req.session.user,
                    customer : results,
                    layout : false
                });
            };

        if(searchValue === "all"){
            connection.query("SELECT Account, Name, Balance FROM customer", processResults )
        }
        else{
            searchValue = "%" + searchValue + "%";
            connection.query("SELECT Account, Name, Balance from customer WHERE Name LIKE ?", [searchValue], processResults);
        }
    });
};
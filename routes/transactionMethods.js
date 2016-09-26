exports.show = function (req, res, next) {
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

exports.add = function (req, res, next) {
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

exports.sort = function (req, res, next) {
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


exports.get = function(req, res, next){
    var id = req.params.id;
    req.getConnection(function(err, connection){
        connection.query('SELECT * FROM  customer WHERE id = ?', [id], function(err,rows){
            if(err){
                    console.log("Error Selecting : %s ",err );
            }
            res.render('customer_Transaction_add',{page_title:" customer_Transaction_add - Node.js", data : rows[0]});      
        }); 
    });
};
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
        res.render( 'enquiries',{
         customer: results
        });
      });
  });
};

exports.get = function(req, res, next){
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
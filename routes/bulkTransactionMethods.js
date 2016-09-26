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
    connection.query('UPDATE customer INNER JOIN CustTran ON customer.Balance = CustTran.Amount WHERE Balance = ?', [data.Balance,data.Amount], function(err, rows){
          if (err){
           
                    console.log("Error Updating : %s ",err );
          }
    connection.query('UPDATE customer set customer.Balance=(select Amount from CustTran where CustTran.Number = customer.id )+? where id=?', [data.DC,id], function(err, rows){
          if (err){
                    console.log("Error Updating : %s ",err );
          }
         
              res.render('/bulk');
        });
         
              res.redirect('/CustTran');
        });
      });
  });

};

exports.get = function(req, res, next){
  var id = req.params.id;
  req.getConnection(function(err, connection){
    connection.query('SELECT * FROM  CustTran ', [], function(err,results){
      if(err){
            console.log("Error Selecting : %s ",err );
      }
      res.render('BulkTransaction_add',{page_title:" add_BulkTran Customers - Node.js", data : results});      
    }); 
  });
};
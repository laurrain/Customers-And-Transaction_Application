past_pages = [],
administrator = false,
last_page = "",
counter = 0;
var bcrypt = require('bcrypt');

exports.promoteUser = function(req, res, next){

    var input = JSON.parse(JSON.stringify(req.body))

    req.getConnection(function(err, connection){
        if (err)
            return next(err);

        connection.query("UPDATE UserData SET ? WHERE username=?", [input, input.username], function(err, results){
            if(err)
                console.log(err)

            res.redirect("/admin_panel")
        })
    })
}

exports.adminPanel = function(req, res, next){

    req.getConnection(function(err, connection){
        if(err)
            return next(err);

        connection.query("SELECT username, admin, locked FROM UserData WHERE NOT username = ?", req.session.user, function(err, data){
            if(err)
                console.log("[!] Error requesting adminPanel data from database:\n\t%s", err);


            res.render("admin_panel",
                {data : data,
                administrator : administrator
            })
        })
    })
}

exports.signup = function(req, res, next){
    req.getConnection(function(err, connection){
        if (err){ 
            return next(err);
        }
        
        var input = JSON.parse(JSON.stringify(req.body));
        var data = {
                    username : input.username,
                    password: input.password
            };

        if(input.username == undefined || input.password == undefined){

            return res.render("signup", {
                message : "Password or username can't be empty!",
                layout : false
            })

        }
        else if (input.password_confirm == input.password){
            connection.query('SELECT * FROM UserData WHERE username = ?', input.username, function(err, results1) {
                    if (err)
                            console.log("[!] Error inserting : %s ",err );

                if (results1.length == 0){
                  console.log(results1)
                        bcrypt.hash(input.password,10, function(err, hash){
                            data.password = hash
                            connection.query('INSERT INTO UserData SET ?', data, function(err, results) {
                                if (err)
                                    console.log("[!] Error inserting : %s ",err );
                            })
                        })
                    
                    req.session.user = input.username;
                    administrator = false;
                    res.redirect('/');
                }
                else{
                    res.render("signup", {
                                            message : "Username alredy exists!",
                                            layout : false
                                            })
                }
            });
        }
        else{
            res.render("signup", {
                message : "Passwords don't match!",
                layout : false
            })
        }
    });
}
exports.authUser = function(req, res, next){
    req.getConnection(function(err, connection){
        if (err) 
            return next(err);
    past_pages = [];

    var userData = JSON.parse(JSON.stringify(req.body)),
      user = userData.username,
      password = userData.password;
        connection.query('SELECT * FROM UserData WHERE username = ?', user, function(err, results) {
            if (err) return next(err);

            if(results.length > 0){
                bcrypt.compare(password, results[0].password,  function(err, reply){
                  console.log(reply)
                    if(err)
                        console.log("[!] There was an error with bcrypt.compare() ", err);
                    if(reply && !results[0].locked){

                        counter = 0
                        req.session.user = results[0].username
                        administrator = results[0].admin

                        return res.redirect("/");
                    }
                    else{

                        counter++;
                        var msg = '';
                        if(counter == 3 || results[0].locked){
                            connection.query('UPDATE UserData SET locked = ? WHERE username = ?', [true,user], function(err, results) {
                                if (err) return next(err);
                            
                                msg = "Your account has been blocked!";
                                return res.render("login", {
                                    message : msg,
                                    layout : false
                                });
                            });
                        }else{

                            return res.render("login", {
                                message : msg+"Username or password incorrect!",
                                layout : false
                            });
                        }
                    }
                });
            }
            else{
                counter = 0
                return res.render("login", {
                    message : "Username doesn't exist!",
                    layout : false
                });
            }
        });
    });
}

exports.checkUser = function(req, res, next){
  if (req.session.user){
      return next();
  }else{
    // the user is not logged in redirect him to the login page-
    res.redirect('/login');
  }
};

exports.getUserData = function(req, res, next){
  req.getConnection(function(err, connection){
    connection.query('SELECT  username, password from UserData' , [], function(err,results){
      if(err){
            console.log("Error Selecting : %s ",err );
      }
      res.render('users',{data : results});      
    }); 
  });
};
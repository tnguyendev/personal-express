module.exports = function(app, passport, express, path, fs, multer, db) {

  const upload = multer({
    dest: "/path/to/temporary/directory/to/store/uploads/files"
  });

  const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };

    app.get('/', function(req, res) {
      express.static(path.join(__dirname, "./public"))
        res.render('index.ejs');
    });

    app.get("/image.png", (req, res) => {
      res.sendFile(path.join(__dirname, "./uploads/image.png"));
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post(
      "/upload",
      upload.single("file"), 
      (req, res) => {
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "./uploads/image.png");
          fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);
            res
              .status(200)
              .contentType("text/plain")
              .redirect("/profile");
          });
      }
    );

    app.delete('/deleteImg', (req, res) => {
      db.collection('./uploads/image.png').deleteMany({ }, (err, result) => {
          if (err) return res.send(500, err)
          res.send('Message deleted!')
      })
  })

        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', 
            failureRedirect : '/login', 
            failureFlash : true 
        }));

        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', 
            failureRedirect : '/signup', 
            failureFlash : true 
        }));

    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

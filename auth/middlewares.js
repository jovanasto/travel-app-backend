const jwt = require('jsonwebtoken');


function checkTokenSetUser(req, res, next) {
  const authHeader = req.get('authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    console.log("Checking auth header",authHeader);
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        if (error) {
          console.log(error);
        }  
        console.log("Checking token", JSON.stringify(user));
        req.user = user;
        next();
      });
    } else {
      console.log("Checking token first else");
      next();
    }
  } else {
    console.log("Checking token second else");
    next();
  }
}

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    const error = new Error('🚫 Un-Authorized 🚫');
    res.status(401);
    next(error);
  }
}

module.exports = {
  checkTokenSetUser,
  isLoggedIn
};

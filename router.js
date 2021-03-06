const express    = require('express');        // call express
const router = express.Router();
const path    = require("path");
const request = require('request');


router.get('/login',function(req,res){
  res.sendFile(path.join(__dirname+'/html/login.html'));
});

router.post('/login',function(req,res){

  const reqOptions = {
    url: 'http://10.241.99.41:8080/login',
    headers: {
      username:req.body.username,
      password:req.body.password
    }
  };

  request(reqOptions,function(err,response,body){
    if(err) {
      res.send(err);
      return;
    }
    if (response.headers.login === 'ok' && response.headers['set-cookie']) {
      response.headers['set-cookie'].forEach(function(cookie){
        const cookieName = cookie.split('=')[0];
        const cookieValue = cookie.split('=')[1].split(';')[0];
        res.cookie(cookieName,cookieValue);
      });
      res.redirect('/otp');
    }
    else {
      res.cookie('error_msg','Bad credentials');
      res.sendFile(path.join(__dirname+'/html/login.html'));
    }
  });
});

router.get('/otp',function(req,res){
  res.sendFile(path.join(__dirname+'/html/otp.html'));
});

router.post('/otp',function(req,res){
  if (req.cookies.MRHSession) {
    const reqOptions = {
      url: 'http://10.241.99.41:8080/otp',
      headers: {
        otp: req.body.otp,
        cookie: 'MRHSession=' + req.cookies.MRHSession
      }
    };

    request(reqOptions, function (err, response, body) {
      if(err) {
        res.send(err);
        return;
      }
      console.log(response.headers);
      switch (response.headers.otp) {
        case 'ok':
          res.redirect('/internal');
          break;
        case 'bad':
          res.cookie('error_msg','Bad OTP');
          res.sendFile(path.join(__dirname+'/html/otp.html'));
          break;
        default:
          res.clearCookie('LastMRH_Session');
          res.clearCookie('MRHSession');
          res.redirect('/login');
      }
    });
  }
  else {
    res.redirect('/login');
  }
});

router.get('/internal',function(req,res){
  res.sendFile(path.join(__dirname+'/html/internal.html'));
});

router.get('/logout',function(req,res){
  res.clearCookie('LastMRH_Session');
  res.clearCookie('MRHSession');
  res.redirect('/login');
});



module.exports = router;
const express = require('express');
const {register , login , getMe , forgotPassword , resetPassword ,updateDetails , updatePassword} = require('../controller/auth');
const User = require('../models/user');
const router = express.Router();
const {protect} = require('../middleware/auth')
// const { protect } = require('../middleware/auth');

   router.post('/register', register);
   router.post('/forgotPassword', forgotPassword);
   router.post('/login', login);
   router.put('/updatedetails',  updateDetails);
   router.put('/resetpassword/:resettoken', resetPassword);
   router.put('/updatepassword',  updatePassword);
   router.get('/getme' ,protect, getMe);
// router.post("/register", function (req, res) {
//      console.log('req body', req.body)
//     try {
//       let user = User.create(req.body);
//       res.status(201).json({
//         success: true,
//         data: user,
//       });
//       // res.status(200).json({success:true, msg:'post data'})
//     } catch (err) {
//       console.log("err");
//       res.status(400).json({ success: false });
//     } 
//   });   
module.exports = router;

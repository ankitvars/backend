const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
//ROUTE 1: Create a User using POST method "/api/signup". No login required.
router.post(
  '/signup',
  // providing validation for different field so that user will send a valid value
  [
    body('email', 'Enter a valid Email').isEmail(),
    body('name', 'Invalid Name').isLength({ min: 5 }),
    body('phone', 'Invalid Phone').isLength(10),
  ],
  async (req, res) => {
    // If there are errors then returning the bad request and the errors that are occuring
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Check whether the user with this email already exists in database(mongodb collection)
    try {
      // finding if user email is already present in collection wait for check using await
      // let user = await User.findOne({ phone:req.body.phone });
      // console.log(user);
      // if user with same email exists sending the message with status code 400 i.e. Bad request response
      // if (user) {
      //   return res.status(400).json({ error: "User already exists!" });
      // }

      // Create a new user with name email and phone after extracting from request body
      let user = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      });

      console.log('User Created Successfully', user);
      const success = true;

      res.status(200).json({ success });
    } catch (error) {
      // catching errors
      console.error(error.message);
      res.status(500).send('Some error occured');
    }
  }
);

// ROUTE 2 : Authenticate a user using POST method "/api/auth/login". No Login required.
router.post(
  '/login',
  // providing validation for different field so that user will send a valid value of email during login time
  [body('phone', 'Enter a valid Phone').isMobilePhone()],
  async (req, res) => {
    // If there are errors then returning the bad request and the errors that are occuring
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { phone } = req.body;
    try {
      const success = true;
      const status = 200;
      const message = 'verify the otp next';
      // sending user token from server
      res.status(200).json({ success, phone, status });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Some error occured');
    }
  }
);

router.post(
  '/otp-verify',
  // providing validation for different field so that user will send a valid value of email during login time
  [
    body('phone', 'Enter a valid Phone').isMobilePhone(),
    body('otp', 'Enter correct otp').isNumeric(),
  ],
  async (req, res) => {
    // If there are errors then returning the bad request and the errors that are occuring
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { phone, otp } = req.body;
    try {
      const user = await User.findOne({ phone, otp });
      // TO DO : condition will be changed to match otp is correct or not or user have already signed up
       if (!user) {
         return res.status(400).send({ error: 'Credentials not matched' });
       }
      const success = true;
      const status = 200;
      const message = 'Otp verified successfully';
      // sending user token from server
      res.status(200).json({ success, phone, status });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Some error occured');
    }
  }
);

module.exports = router;

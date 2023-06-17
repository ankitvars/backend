const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
// Route1 ; register
router.post(
  '/signup',
  [
    body('email', 'Enter a valid Email').isEmail(),
    body('name', 'Invalid Name').isLength({ min: 5 }),
    body('phone', 'Invalid Phone').isLength(10),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      
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

// ROUTE 2 : login
router.post(
  '/login',
  [body('phone', 'Enter a valid Phone').isMobilePhone()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { phone } = req.body;

    try {
      const userExists = await User.findOne({ phone });
      if (!userExists) {
        return res
          .status(400)
          .json({ message: 'Your phone number does not exist' });
      }
      const success = true;
      const status = 200;
      // sending user token from server
      res.status(200).json({ phone, status, message: 'verify the otp next' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Some error occured');
    }
  }
);
//Route3: Otp verify
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

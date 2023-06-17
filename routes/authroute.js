const express = require("express");
const router = express.Router(); 

//ROUTE 1: Create a User using POST method "/api/signup". No login required.
router.post(
  "/signup",
  // providing validation for different field so that user will send a valid value
  [
    body("email", "Enter a valid Email").isEmail(),
    body("name", "Invalid Name").isLength({ min: 5 }),
    body("phone","Invalid Phone").isLength(10)
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
      let user = await User.findOne({ phone:req.body.phone });
      // console.log(user);
      // if user with same email exists sending the message with status code 400 i.e. Bad request response
      if (user) {
        return res.status(400).json({ error: "User already exists!" });
      }

      // Create a new user with name email and phone after extracting from request body
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      });

      console.log("User Created Successfully",user);

    } catch (error) {
      // catching errors
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

const db= require("./Model/index")
const bcrypt = require('bcrypt');
const userModel = require('./Model/userModel');
const express = require('express')

const app = express()

app.use(express.json())

app.use(express.urlencoded({extended:true}));

var admin = require("firebase-admin");

var serviceAccount = require("./authentication-app-99d56-firebase-adminsdk-b5akd-78bcb2f432.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://authentication-app-99d56-default-rtdb.firebaseio.com"
});


app.post('/signup', async (req, res) => {
    try {
      const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password,
      };
  
      // Create a user in Firebase Authentication
      const userData = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        emailVerified: false,
        disabled: false,
      });
  
      // Use bcrypt for hashing the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  
      // Create a user in MySQL
      const newUser = await User.create({
        firstName: user.firstname,
        lastName: user.lastname,
        age: user.age,
        email: user.email,
        password: hashedPassword,
      });
  
      // Combine the data for both Firebase and MySQL into a single response object
      const response = {
        message: 'Registration successful',
        userData: userData,
        newUser: newUser,
      };
  
      // Send the response
      res.json(response);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });
  
      


      // for login 
app.post('/login', async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    // Check if email and password are provided
    if (!user.email || !user.password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const userRecord = await admin.auth().getUserByEmail(user.email);
        await admin.auth().signInWithEmailAndPassword(user.email, user.password);
        res.json({ message: "Login successful", user: userRecord });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(401).json({ error: "Authentication failed" });
    }
});



// OTP generation through twillio 


const accountSid = "AC5adc0d4282cd76e8e481de20812eaf44";
const authToken = "c5b516ff9a123236bd5d8c09a66882b8";
const client = require("twilio")(accountSid, authToken);

app.get("/otp", async (req, res) => {
    try {
      const response = await client.messages.create({
        body: `${Math.floor(Math.random() * 900000) + 100000}`,
        from: "+18155970969",
        to: "+91" + req.query.number,
      });
      
      // Check if the message was sent successfully
      if (response.sid) {
        res.status(200).json({ message: "Message sent successfully" });
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });
  




const PORT = process.env.PORT || 8080;



const server = app.listen(PORT, () => {
    console.log(`Server is up and running on PORT ${PORT}.`);
  });
  
  // After starting the server, sync the Sequelize models with the database
  db.sequelize.sync().then(() => {
    console.log('Database synchronization successful.');
  }).catch((error) => {
    console.error('Error syncing database:', error);
  });







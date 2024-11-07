const express = require('express');
const mysql = require( 'mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//intialize express
const app = express();
app.use(cors());
app.use(bodyParser.json());

//connect to my sql 
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Sniper505!',
    database:'insurance_data_dummy',
});

//check the connection
db.connect((err) =>{
    if (err) throw err;
    console.log("You have connected to SQL database")
});

// LOGIN PAGE CODE IS BELOW THIS LINE -----------------------------------------------------------------------
//hard coded credentials for now 
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '$2a$10$dtC5K6A.vQltH3pT9GP5ve9p5g//Rhcz/IX5e3vsAC5Yf4hZN4V8W', // "password123"
};

//login endpoint

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (username !== ADMIN_CREDENTIALS.username) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    const isPasswordValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    // Generate JWT
    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    res.status(200).json({ token });
});


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }
  
    try {
      const decoded = jwt.verify(token, 'secret_key'); // Verify token
      req.user = decoded; // Attach user info to the request object
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
//LOGIN CODE ENDS HERE --------------------------------------------------------------------------------------

//submit auto form into sql logic
app.post('/submit-auto', (req,res)=>{
    const{
        name,
        email,
        phone,
        vehicleMake,
        vehicleModel,
        vin,
        licenseNumber,
        insuranceCompany,
        coverage,
    }=req.body;

    const query = 'INSERT INTO auto_insurance (name, email, phone, vehicle_make, vehicle_model, vin, license_number, insurance_company, coverage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(
        query, [name, email, phone, vehicleMake, vehicleModel, vin, licenseNumber, insuranceCompany, coverage],
        (err,result) => {
            if(err) {
                console.error("Error inserting data:",err);
                res.status(500).json({ error: 'Database error' });
            }else{
              res.status(200).json({ message: 'Form submitted successfully' });  
            }
        }
    ) 
} )

//submit home form into sql logic
app.post('/submit-home', (req,res)=>{
    const{
        name,
        email,
        phone,
        propertyAddress,
        homeType,
        homeValue,
        coverageAmount
    }=req.body;

    const query = 'INSERT INTO home_insurance (name, email, phone, home_type, home_value, coverage_amount) VALUES (?,?,?,?,?,?)';
    db.query(
        query, [name,email,phone, propertyAddress, homeType, homeValue, coverageAmount],
        (err,result) => {
            if(err) {
                console.error("Error inserting data:",err);
                res.status(500).json({ error: 'Database error' });
            }else{
              res.status(200).json({ message: 'Form submitted successfully' });  
            }
        }
    )
})

//submit life form into sql logic
app.post('/submit-life', (req,res)=>{
    const{
        name,
        email,
        phone,
        coverageType,
        coverageAmount,
        beneficiary,
    }=req.body;

    const query = 'INSERT INTO life_insurance (name, email, phone, type_of_coverage, coverage_amount, beneficiary_name) VALUES (?,?,?,?,?,?)';
    db.query(
        query, [name, email, phone, coverageType, coverageAmount, beneficiary,],
        (err,result) => {
            if(err) {
                console.error("Error inserting data:",err);
                res.status(500).json({ error: 'Database error' });
            }else{
              res.status(200).json({ message: 'Form submitted successfully' });  
            }
        }
    )
})

//submit business form into sql logic
app.post('/submit-business', (req,res)=>{
    const{
        name,
        email,
        phone,
        businessName,
        businessType,
        coverageAmount,
    }=req.body;

    const query = 'INSERT INTO business_insurance (name, email, phone, business_name, business_type, coverage_amount) VALUES (?,?,?,?,?,?)';
    db.query(
        query, [name, email, phone, businessName, businessType, coverageAmount],
        (err,result) => {
            if(err) {
                console.error("Error inserting data:",err);
                res.status(500).json({ error: 'Database error' });
            }else{
              res.status(200).json({ message: 'Form submitted successfully' });  
            }
        }
    )
})


//logic to get data from auto database
// Route to retrieve all auto insurance form submissions
app.get('/admin/auto-data', verifyToken,(req, res) => {
    const query = 'SELECT * FROM auto_insurance';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json(results); // Send the data as JSON
    });
});

app.get('/admin/home-data', verifyToken,(req, res) => {
    const query = 'SELECT * FROM home_insurance';
    db.query(query, (err, results) => {
        if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results); // Send the data as JSON
    });
});

app.get('/admin/business-data', verifyToken, (req, res) => {
    const query = 'SELECT * FROM business_insurance';
    db.query(query, (err, results) => {
        if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results); // Send the data as JSON
    });
});

app.get('/admin/auto-data', verifyToken, (req, res) => {
    const query = 'SELECT * FROM auto_insurance';
    db.query(query, (err, results) => {
        if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
  });
});

//start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
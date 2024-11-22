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
    password:'Sniper505',
    database:'insurance_data_dummy',
});

//check the connection
db.connect((err) =>{
    if (err) throw err;
    console.log("You have connected to SQL database")
});

// LOGIN PAGE CODE IS BELOW THIS LINE -----------------------------------------------------------------------

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom headers like Authorization
  }));
  

//login endpoint

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const query = 'SELECT * FROM employees WHERE username = ?';
    db.query(query, [username], async (err, results) => {
      if (err) {
        console.error('Error fetching employee:', err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const employee = results[0];
  
      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT
      const token = jwt.sign({ id: employee.id, username: employee.username }, 'secret_key', { expiresIn: '1h' });
      res.status(200).json({ token });
    });
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

    const query = 'INSERT INTO home_insurance (name, email, phone, address, home_type, home_value, coverage_amount) VALUES (?,?,?,?,?,?,?)';
    db.query(
        query, [name,email,phone, propertyAddress, homeType, homeValue, coverageAmount],
        (err,result) => {
            if(err) {
                console.error("Error inserting data:",err);
                console.log("HERE!!!!",homeValue)
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

//logic to delete a user
app.delete('/admin/delete-client', verifyToken, (req, res) => {
  const { clientId, tableName } = req.body;

  if (!clientId || !tableName) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `DELETE FROM ${tableName} WHERE id = ?`;

  db.query(query, [clientId], (err, result) => {
      if (err) {
          console.error('Error deleting client:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Client not found' });
      }

      res.status(200).json({ message: 'Client successfully deleted' });
  });
});




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

app.get('/admin/life-data', verifyToken, (req, res) => {
    const query = 'SELECT * FROM life_insurance';
    db.query(query, (err, results) => {
        if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
  });
});


app.post('/assign-client', verifyToken, (req, res) => {
    const { clientId, tableName } = req.body; // tableName can be auto_insurance, home_insurance, etc.
    const employeeName = req.user.username; // Extracted from the token
  
    if (!clientId || !tableName || !employeeName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const query = `UPDATE ${tableName} SET assigned_to = ? WHERE id = ?`;
    db.query(query, [employeeName, clientId], (err, result) => {
      if (err) {
        console.error('Error updating client:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Client successfully assigned', employeeName });
    });
  });
  
  app.post('/unassign-client', verifyToken, (req, res) => {
    const { clientId, tableName } = req.body;
  
    if (!clientId || !tableName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const query = `UPDATE ${tableName} SET assigned_to = NULL WHERE id = ?`;
    db.query(query, [clientId], (err, result) => {
      if (err) {
        console.error('Error updating client:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Client successfully unassigned' });
    });
  });

  app.get('/admin/flagged-clients', verifyToken, (req, res) => {
    const employeeName = req.user.username; // Extract the employee name from the token

    const queries = [
        "SELECT * FROM auto_insurance WHERE assigned_to = ?",
        "SELECT * FROM home_insurance WHERE assigned_to = ?",
        "SELECT * FROM business_insurance WHERE assigned_to = ?",
        "SELECT * FROM life_insurance WHERE assigned_to = ?",
    ];

    const promises = queries.map((query) =>
        new Promise((resolve, reject) => {
            db.query(query, [employeeName], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        })
    );

    Promise.all(promises)
        .then((results) => {
            const allFlaggedClients = [].concat(...results); // Combine all results into one array
            res.status(200).json(allFlaggedClients);
        })
        .catch((err) => {
            console.error('Error fetching flagged clients:', err);
            res.status(500).json({ error: 'Database error' });
        });
});



  
//start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const mysql = require( 'mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {
  sanitizeBody,
  validateAuto,
  validateHome,
  validateLife,
  validateBusiness,
  validateQuote,
  validateLogin,
} = require('./middleware/validation');

//intialize express
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(sanitizeBody);

//connect to my sql 
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'insurance_data_dummy',
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

app.post('/login', validateLogin, (req, res) => {
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
      const token = jwt.sign(
        { id: employee.id, username: employee.username },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token });
    });
  });


const getOrCreateCustomerId = (name, email, phone, callback) => {
    const findCustomerQuery = 'SELECT id FROM customers WHERE name = ? AND email = ? AND phone = ?';
    const insertCustomerQuery = 'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)';
  
    db.query(findCustomerQuery, [name, email, phone], (err, results) => {
      if (err) return callback(err);
  
      if (results.length > 0) {
        // Customer already exists
        callback(null, results[0].id);
      } else {
        // Create a new customer
        db.query(insertCustomerQuery, [name, email, phone], (err, results) => {
          if (err) return callback(err);
          callback(null, results.insertId); // Return the new customer's ID
        });
      }
    });
  };
  


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key'); // Verify token
      req.user = decoded; // Attach user info to the request object
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
//LOGIN CODE ENDS HERE --------------------------------------------------------------------------------------

//submit auto form into sql logic
app.post('/submit-auto', validateAuto, (req, res) => {
  const {
    name,
    email,
    phone,
    vehicleMake,
    vehicleModel,
    vin,
    licenseNumber,
    insuranceCompany,
    coverage,
  } = req.body;

  getOrCreateCustomerId(name, email, phone, (err, customerId) => {
    if (err) {
      console.error('Error fetching or creating customer ID:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const query = `
      INSERT INTO auto_insurance 
      (customer_id, vehicle_make, vehicle_model, vin, license_number, insurance_company, coverage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [customerId, vehicleMake, vehicleModel, vin, licenseNumber, insuranceCompany, coverage],
      (err) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Form submitted successfully' });
      }
    );
  });
});



//submit home form into sql logic
app.post('/submit-home', validateHome, (req, res) => {
  const {
    name,
    email,
    phone,
    propertyAddress,
    homeType,
    propertyValue,
    coverageAmount,
  } = req.body;

  const insuranceType = 'home'; // Set the correct insurance type

  getOrCreateCustomerId(name, email, phone, (err, customerId) => {
    if (err) {
      console.error('Error fetching or creating customer ID:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const updateCustomerQuery = `
      UPDATE customers
      SET insurance_type = ?
      WHERE id = ?
    `;

    db.query(updateCustomerQuery, [insuranceType, customerId], (err) => {
      if (err) {
        console.error('Error updating customer insurance type:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const insertHomeQuery = `
        INSERT INTO home_insurance 
        (customer_id, property_address, home_type, property_value, coverage_amount)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(
        insertHomeQuery,
        [customerId, propertyAddress, homeType, propertyValue, coverageAmount],
        (err) => {
          if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          res.status(200).json({ message: 'Form submitted successfully' });
        }
      );
    });
  });
});



// Submit life form into SQL logic
app.post('/submit-life', validateLife, (req, res) => {
  const {
    name,
    email,
    phone,
    coverageType,
    coverageAmount,
    beneficiary,
  } = req.body;

  const insuranceType = 'life'; // Set the insurance type

  getOrCreateCustomerId(name, email, phone, (err, customerId) => {
    if (err) {
      console.error('Error fetching or creating customer ID:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const updateCustomerQuery = `
      UPDATE customers
      SET insurance_type = ?
      WHERE id = ?
    `;

    db.query(updateCustomerQuery, [insuranceType, customerId], (err) => {
      if (err) {
        console.error('Error updating customer insurance type:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const insertLifeQuery = `
        INSERT INTO life_insurance 
        (customer_id, type_of_coverage, coverage_amount, beneficiary_name)
        VALUES (?, ?, ?, ?)
      `;
      db.query(
        insertLifeQuery,
        [customerId, coverageType, coverageAmount, beneficiary],
        (err) => {
          if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          res.status(200).json({ message: 'Form submitted successfully' });
        }
      );
    });
  });
});


//submit business form into sql logic
app.post('/submit-business', validateBusiness, (req, res) => {
  const {
    name,
    email,
    phone,
    businessName,
    businessType,
    coverageAmount,
  } = req.body;

  const insuranceType = 'business'; // Set the insurance type

  getOrCreateCustomerId(name, email, phone, (err, customerId) => {
    if (err) {
      console.error('Error fetching or creating customer ID:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const updateCustomerQuery = `
      UPDATE customers
      SET insurance_type = ?
      WHERE id = ?
    `;

    db.query(updateCustomerQuery, [insuranceType, customerId], (err) => {
      if (err) {
        console.error('Error updating customer insurance type:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const insertBusinessQuery = `
        INSERT INTO business_insurance 
        (customer_id, business_name, business_type, coverage_amount)
        VALUES (?, ?, ?, ?)
      `;
      db.query(
        insertBusinessQuery,
        [customerId, businessName, businessType, coverageAmount],
        (err) => {
          if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          res.status(200).json({ message: 'Form submitted successfully' });
        }
      );
    });
  });
});


// updated deletion logic, no longer from req body
// DELETE Client API
app.delete('/admin/delete-client', verifyToken, (req, res) => {
  const { uniqueId } = req.body;

  if (!uniqueId) {
    return res.status(400).json({ error: 'Missing required unique ID' });
  }

  const deleteCustomerQuery = `
    DELETE FROM customers WHERE id = ?;
  `;

  db.query(deleteCustomerQuery, [uniqueId], (err, result) => {
    if (err) {
      console.error('Error deleting client:', err);
      return res.status(500).json({ error: 'Database error while deleting client' });
    }
    res.status(200).json({ message: 'Client successfully deleted' });
  });
});





//logic to get data from auto database
// Route to retrieve all auto insurance form submissions
// Updated endpoint for viewing auto insurance data
app.get('/admin/auto-data', verifyToken, (req, res) => {
  const query = `
    SELECT 
      customers.id AS unique_id,  -- The ID from customers table
      customers.name, 
      customers.email, 
      customers.phone, 
      auto_insurance.vehicle_make, 
      auto_insurance.vehicle_model, 
      auto_insurance.vin, 
      auto_insurance.license_number, 
      auto_insurance.insurance_company, 
      auto_insurance.coverage, 
      customers.assigned_to
    FROM 
      auto_insurance
    JOIN 
      customers ON auto_insurance.customer_id = customers.id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching auto insurance data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});



app.get('/admin/home-data', verifyToken, (req, res) => {
  const query = `
    SELECT 
      customers.id AS unique_id,  -- The ID from customers table
      customers.name,
      customers.email,
      customers.phone,
      home_insurance.property_address,
      home_insurance.home_type,
      home_insurance.property_value,
      home_insurance.coverage_amount,
      customers.assigned_to
    FROM 
      home_insurance
    JOIN 
      customers ON home_insurance.customer_id = customers.id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching home insurance data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});



app.get('/admin/business-data', verifyToken, (req, res) => {
  const query = `
    SELECT 
      customers.id AS unique_id,  -- The ID from customers table
      customers.name,
      customers.email,
      customers.phone,
      business_insurance.business_name,
      business_insurance.business_type,
      business_insurance.coverage_amount,
      customers.assigned_to
    FROM 
      business_insurance
    JOIN 
      customers ON business_insurance.customer_id = customers.id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching business insurance data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});



app.get('/admin/life-data', verifyToken, (req, res) => {
  const query = `
    SELECT 
      customers.id AS unique_id,  -- The ID from customers table
      customers.name,
      customers.email,
      customers.phone,
      life_insurance.type_of_coverage AS coverage_type,
      life_insurance.coverage_amount,
      life_insurance.beneficiary_name AS beneficiary,
      customers.assigned_to
    FROM 
      life_insurance
    JOIN 
      customers ON life_insurance.customer_id = customers.id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching life insurance data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});




app.post('/assign-client', verifyToken, (req, res) => {
  const { clientId } = req.body; // Client ID to assign
  const employeeName = req.user.username; // Extract from token

  if (!clientId || !employeeName) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `UPDATE customers SET assigned_to = ? WHERE id = ?`;
  db.query(query, [employeeName, clientId], (err) => {
      if (err) {
          console.error('Error assigning client:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Client successfully assigned', employeeName });
  });
});

  
app.post('/unassign-client', verifyToken, (req, res) => {
  const { clientId } = req.body;

  if (!clientId) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `UPDATE customers SET assigned_to = NULL WHERE id = ?`;
  db.query(query, [clientId], (err) => {
      if (err) {
          console.error('Error unassigning client:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Client successfully unassigned' });
  });
});



app.get('/admin/flagged-clients', verifyToken, (req, res) => {
  const query = `
      SELECT id, name, email, phone, insurance_type, assigned_to 
      FROM customers
      WHERE assigned_to IS NOT NULL
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching flagged clients:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json(results);
  });
});


app.post('/quotes', verifyToken, validateQuote, (req, res) => {
  const {
      customerId,
      insuranceType,
      monthlyPremium,
      annualPremium,
      deductible,
      liabilityCoverageLimits,
      compAndCollisionCoverageLimits,
      optionalCoverageCosts,
      feesAndTaxes,
  } = req.body;

  if (!customerId || !insuranceType) {
      return res.status(400).json({ error: 'Customer ID and insurance type are required' });
  }

  const query = `
      INSERT INTO quotes (
          customer_id, insurance_type, monthly_premium, annual_premium, deductible, 
          liability_coverage_limits, comp_and_collision_coverage_limits, optional_coverage_costs, fees_and_taxes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
      query,
      [
          customerId,
          insuranceType,
          monthlyPremium,
          annualPremium,
          deductible,
          liabilityCoverageLimits,
          compAndCollisionCoverageLimits,
          optionalCoverageCosts,
          feesAndTaxes,
      ],
      (err, result) => {
          if (err) {
              console.error('Error adding quote:', err);
              return res.status(500).json({ error: 'Database error' });
          }
          res.status(201).json({ message: 'Quote added successfully' });
      }
  );
});


app.get('/quotes/:customerId', verifyToken, (req, res) => {
  const { customerId } = req.params;

  const query = 'SELECT * FROM quotes WHERE customer_id = ?';
  db.query(query, [customerId], (err, results) => {
      if (err) {
          console.error('Error fetching quotes:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json(results);
  });
});




  
//start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
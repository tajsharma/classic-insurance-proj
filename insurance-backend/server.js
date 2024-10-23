const express = require('express');
const mysql = require( 'mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

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




//start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
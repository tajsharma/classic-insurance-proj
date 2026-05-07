# Classic Insurance Data Management System

Full-stack web application built for a car insurance agency to digitize client intake, policy data management, and internal workflow. Replaces manual paper-based data collection with a structured digital pipeline that captures, validates, stores, and reports on insurance policy data across four lines of business.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, REST API
- **Database:** MySQL 8.0+ (normalized relational schema)
- **Authentication:** JWT tokens, bcrypt password hashing
- **Automation:** Python 3 (pandas, SQLAlchemy, mysql-connector-python)
- **Version Control:** Git / GitHub

## Features

### Customer-Facing Forms
Four dedicated intake forms capture insurance inquiries with line-specific fields:
- **Auto** — vehicle make, model, VIN, license number, current insurer, coverage
- **Home** — property address, home type, property value, coverage amount
- **Life** — coverage type, coverage amount, beneficiary
- **Business** — business name, business type, coverage amount

### Admin Dashboard
Authenticated employee portal with the ability to query submissions by insurance line via SQL JOINs, flag and assign clients to agents for follow-up, view contact information, send quotes with premium breakdowns (monthly/annual premiums, deductibles, liability limits, comp/collision), and delete client records. All admin routes are JWT-protected.

### Server-Side Validation
Middleware layer (`middleware/validation.js`) intercepts every form submission before it reaches the database. Validates VIN format (17 alphanumeric characters per ISO 3779, excluding I/O/Q), email format, phone (exactly 10 digits), positive coverage amounts, and required fields. Returns specific error messages per field. Global sanitization strips null bytes, control characters, and HTML tags as defense-in-depth on top of parameterized queries.

### Python Reporting & Automation
Three scripts in `scripts/reports/` connect to the MySQL database and automate tasks the agency previously did manually:
- **monthly_summary.py** — customer counts by insurance type, average coverage amounts, new vs. returning customers, employee workload analysis
- **data_quality.py** — scans for duplicate customers, orphaned records, invalid VINs, mismatched insurance types, unassigned clients (10 checks total)
- **export_to_csv.py** — exports every table to timestamped CSV files for import into Excel or Power BI, with password redaction on the employees table

## Database Architecture

The schema (`database/schema.sql`) uses a normalized design with a central `customers` table linked to line-specific tables via foreign keys:

```
customers (id, name, email, phone, insurance_type, assigned_to)
    ├── auto_insurance     (customer_id FK → customers.id, vehicle_make, model, vin, ...)
    ├── home_insurance     (customer_id FK → customers.id, property_address, home_type, ...)
    ├── life_insurance     (customer_id FK → customers.id, type_of_coverage, beneficiary, ...)
    ├── business_insurance (customer_id FK → customers.id, business_name, business_type, ...)
    └── quotes             (customer_id FK → customers.id, premiums, deductible, limits, ...)

employees (id, username, password, full_name, role)
```

Key constraints: `ON DELETE CASCADE` on all foreign keys, `CHECK` constraints for VIN length, positive coverage amounts, and email/phone format, `UNIQUE` on VIN and customer (name + email + phone), and indexes on `customer_id`, `assigned_to`, and `insurance_type`.

## Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0.16+ (required for CHECK constraints)
- Python 3.8+

### Database
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### Backend
```bash
cd insurance-backend
npm install
```

Create a `.env` file in the `insurance-backend/` directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password_here
DB_NAME=insurance_data_dummy
JWT_SECRET=your_jwt_secret_here
```

Start the server:
```bash
node server.js
```

### Frontend
```bash
cd insurance-frontend
npm install
npm start
```

The app runs at `http://localhost:3000` with the API on port `5001`.

### Python Scripts
```bash
cd scripts
pip install -r requirements.txt
```

Create a `.env` file in the `scripts/` directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password_here
DB_NAME=insurance_data_dummy
```

Run any report:
```bash
python reports/monthly_summary.py
python reports/data_quality.py
python reports/export_to_csv.py
```

Output goes to `scripts/reports/output/`.

## Project Structure

```
classic-insurance-proj/
├── database/
│   ├── schema.sql              # Full DDL with constraints and indexes
│   └── seed.sql                # 30 sample customers + related records
├── insurance-backend/
│   ├── middleware/
│   │   └── validation.js       # Server-side validation for all endpoints
│   ├── server.js               # Express API (auth, CRUD, quotes)
│   ├── .env                    # DB credentials (not committed)
│   └── package.json
├── insurance-frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── AdminPage.tsx   # Dashboard with query, flag, quote, delete
│   │   │   ├── AutoForm.tsx    # Auto insurance intake form
│   │   │   ├── HomeForm.tsx    # Home insurance intake form
│   │   │   ├── LifeForm.tsx    # Life insurance intake form
│   │   │   ├── BusinessForm.tsx# Business insurance intake form
│   │   │   ├── Login.tsx       # Employee authentication
│   │   │   └── QuoteSendModal.tsx
│   │   └── App.tsx
│   └── package.json
├── scripts/
│   ├── db_config.py            # Shared DB connection config
│   ├── .env.example            # Template for credentials
│   ├── requirements.txt        # Python dependencies
│   └── reports/
│       ├── monthly_summary.py  # Monthly business report
│       ├── data_quality.py     # Data integrity audit (10 checks)
│       ├── export_to_csv.py    # Full DB export for Excel/Power BI
│       └── output/             # Generated reports land here
└── README.md
```

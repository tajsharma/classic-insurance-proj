-- ============================================================
-- Classic Insurance — Seed Data
-- Run AFTER schema.sql:  mysql -u root -p < database/seed.sql
--
-- Employee passwords (plain text for dev login):
--   admin   → Admin123!
--   sagent  → Agent456!
--   magent  → Agent789!
--   pagent  → Agent321!
--   jsmith  → Super999!
-- ============================================================

USE insurance_data_dummy;

-- ============================================================
-- employees  (5 staff members)
-- ============================================================
INSERT INTO employees (username, password, full_name, role) VALUES
('admin',  '$2a$10$FDK267GvWwto6U1feZWsDeJ2QGpWbEDUkPWpY6eoDD3VF0sq/vKV6', 'Alex Johnson',    'admin'),
('sagent', '$2a$10$jdUGqJF/rd550NIO/kpWVOAtPLQrMpfQd8eaeWMR/V/jOCaawi76G', 'Sarah Chen',      'agent'),
('magent', '$2a$10$X724dDnjcJCc7CbOc3uXWeSWbJA22csWbk5wxDHyGvjXpgkQKV.iS', 'Marcus Williams', 'agent'),
('pagent', '$2a$10$/HoapmSRkDpM6ZF8GGS9TeeRNMV1a2G1ISYv.LU1ypmdN9KwxFRhy', 'Priya Patel',     'agent'),
('jsmith', '$2a$10$L.pNbk8o24qK4eUcArFFI.TpiYMxCpb1FPpJPIJpfEbQ8CjVNPeQW', 'Jordan Smith',    'agent');

-- ============================================================
-- customers  (30 total)
--   1–8   auto insurance
--   9–16  home insurance
--   17–23 life insurance
--   24–30 business insurance
-- ============================================================
INSERT INTO customers (name, email, phone, insurance_type, assigned_to) VALUES
-- auto
('James Miller',      'james.miller@gmail.com',       '5125550101', 'auto',     'sagent'),
('Emily Rodriguez',   'emily.rodriguez@yahoo.com',    '5125550102', 'auto',     'sagent'),
('Daniel Thompson',   'd.thompson@outlook.com',       '5125550103', 'auto',     'magent'),
('Sophia Martinez',   'sophia.m@gmail.com',           '5125550104', 'auto',     'magent'),
('William Chen',      'wchen92@gmail.com',            '5125550105', 'auto',     NULL),
('Olivia Johnson',    'olivia.j@hotmail.com',         '5125550106', 'auto',     NULL),
('Noah Davis',        'noah.davis@gmail.com',         '5125550107', 'auto',     'pagent'),
('Ava Wilson',        'ava.wilson@yahoo.com',         '5125550108', 'auto',     NULL),
-- home
('Liam Brown',        'liam.brown@gmail.com',         '5125550109', 'home',     'sagent'),
('Isabella Taylor',   'isabella.t@gmail.com',         '5125550110', 'home',     NULL),
('Mason Anderson',    'mason.a@outlook.com',          '5125550111', 'home',     'magent'),
('Mia Jackson',       'mia.jackson@yahoo.com',        '5125550112', 'home',     NULL),
('Ethan White',       'ethan.white@gmail.com',        '5125550113', 'home',     'pagent'),
('Charlotte Harris',  'c.harris@gmail.com',           '5125550114', 'home',     NULL),
('James Martin',      'j.martin@hotmail.com',         '5125550115', 'home',     'jsmith'),
('Amelia Garcia',     'amelia.g@gmail.com',           '5125550116', 'home',     NULL),
-- life
('Benjamin Lee',      'ben.lee@gmail.com',            '5125550117', 'life',     'sagent'),
('Harper Lewis',      'harper.l@yahoo.com',           '5125550118', 'life',     NULL),
('Elijah Walker',     'elijah.w@gmail.com',           '5125550119', 'life',     'magent'),
('Abigail Hall',      'abigail.hall@outlook.com',     '5125550120', 'life',     NULL),
('Lucas Allen',       'l.allen@gmail.com',            '5125550121', 'life',     'pagent'),
('Emily Young',       'emily.young@hotmail.com',      '5125550122', 'life',     NULL),
('Logan Hernandez',   'l.hernandez@gmail.com',        '5125550123', 'life',     'jsmith'),
-- business
('Jackson King',      'j.king@gmail.com',             '5125550124', 'business', 'sagent'),
('Aria Wright',       'aria.wright@yahoo.com',        '5125550125', 'business', NULL),
('Aiden Scott',       'aiden.scott@gmail.com',        '5125550126', 'business', 'magent'),
('Scarlett Torres',   'scarlett.t@outlook.com',       '5125550127', 'business', NULL),
('Carter Nguyen',     'carter.n@gmail.com',           '5125550128', 'business', 'pagent'),
('Penelope Hill',     'penelope.h@yahoo.com',         '5125550129', 'business', 'jsmith'),
('Jackson Ramirez',   'j.ramirez@gmail.com',          '5125550130', 'business', NULL);

-- ============================================================
-- auto_insurance  (customers 1–8)
-- VINs are exactly 17 characters
-- ============================================================
INSERT INTO auto_insurance (customer_id, vehicle_make, vehicle_model, vin, license_number, insurance_company, coverage) VALUES
(1,  'Toyota',    'Camry',           '1HGBH41JXMN109186', 'TX-ABC-1234', 'State Farm',       'Full Coverage'),
(2,  'Honda',     'Civic',           '2HGFA1F58CH304982', 'TX-DEF-5678', 'Geico',             'Liability Only'),
(3,  'Ford',      'F-150',           '1FTEW1EP4KFA23451', 'TX-GHI-9012', 'Progressive',       'Full Coverage'),
(4,  'Chevrolet', 'Equinox',         '3GNAXUEV8KS503214', 'TX-JKL-3456', 'Allstate',          'Comprehensive'),
(5,  'BMW',       '330i',            'WBA3A5C59DF596482', 'TX-MNO-7890', 'USAA',              'Full Coverage'),
(6,  'Nissan',    'Altima',          '1N4AL3AP9JC247583', 'TX-PQR-2345', 'Liberty Mutual',    'Liability Only'),
(7,  'Jeep',      'Grand Cherokee',  '1C4RJFBG7LC395721', 'TX-STU-6789', 'Farmers',           'Full Coverage'),
(8,  'Tesla',     'Model 3',         '5YJ3E1EA1JF062345', 'TX-VWX-0123', 'State Farm',        'Comprehensive');

-- ============================================================
-- home_insurance  (customers 9–16)
-- ============================================================
INSERT INTO home_insurance (customer_id, property_address, home_type, property_value, coverage_amount) VALUES
(9,  '1402 Westlake Dr, Austin TX 78746',      'Single Family', 485000.00, 400000.00),
(10, '823 Congress Ave Apt 4B, Austin TX 78701','Condo',         310000.00, 275000.00),
(11, '5610 Burnet Rd Unit 12, Austin TX 78756', 'Townhouse',     395000.00, 350000.00),
(12, '209 E 6th St, Austin TX 78701',           'Single Family', 620000.00, 550000.00),
(13, '4401 Manchaca Rd Apt 3C, Austin TX 78745','Condo',         280000.00, 240000.00),
(14, '7700 Shoal Creek Blvd, Austin TX 78757',  'Multi-Family',  780000.00, 700000.00),
(15, '3322 Red River St, Austin TX 78705',      'Single Family', 530000.00, 475000.00),
(16, '1105 Barton Hills Dr, Austin TX 78704',   'Townhouse',     440000.00, 390000.00);

-- ============================================================
-- life_insurance  (customers 17–23)
-- ============================================================
INSERT INTO life_insurance (customer_id, type_of_coverage, coverage_amount, beneficiary_name) VALUES
(17, 'Term',           500000.00, 'Rachel Lee'),
(18, 'Whole Life',     750000.00, 'David Lewis'),
(19, 'Universal Life', 600000.00, 'Maria Walker'),
(20, 'Term',           250000.00, 'Robert Hall'),
(21, 'Whole Life',    1000000.00, 'Jennifer Allen'),
(22, 'Term',           300000.00, 'Michael Young'),
(23, 'Variable Life',  800000.00, 'Laura Hernandez');

-- ============================================================
-- business_insurance  (customers 24–30)
-- ============================================================
INSERT INTO business_insurance (customer_id, business_name, business_type, coverage_amount) VALUES
(24, 'King Digital Solutions',      'LLC',                  500000.00),
(25, 'Wright Consulting Group',     'Corporation',          750000.00),
(26, 'Scott Handyman Services',     'Sole Proprietorship',  150000.00),
(27, 'Torres & Partners Law',       'Partnership',          600000.00),
(28, 'Nguyen Logistics LLC',        'LLC',                  400000.00),
(29, 'Hill Medical Associates',     'S-Corp',              1200000.00),
(30, 'Ramirez Construction Corp',   'Corporation',          900000.00);

-- ============================================================
-- quotes  (a few samples across all insurance types)
-- ============================================================
INSERT INTO quotes (customer_id, insurance_type, monthly_premium, annual_premium, deductible, liability_coverage_limits, comp_and_collision_coverage_limits, optional_coverage_costs, fees_and_taxes) VALUES
-- auto quotes
(1,  'auto',     142.50, 1710.00,  500.00, '100/300/100', '500 deductible',   15.00, 28.90),
(2,  'auto',      89.00, 1068.00, 1000.00, '50/100/50',   NULL,               10.00, 18.50),
(3,  'auto',     165.75, 1989.00,  500.00, '100/300/100', '500 deductible',   20.00, 33.60),
(7,  'auto',     178.00, 2136.00,  750.00, '100/300/100', '750 deductible',   25.00, 36.20),
-- home quotes
(9,  'home',     185.00, 2220.00, 1000.00, '300000 liability', NULL,           22.00, 44.10),
(11, 'home',     162.50, 1950.00, 1500.00, '200000 liability', NULL,           18.00, 39.75),
(13, 'home',     140.00, 1680.00, 1000.00, '200000 liability', NULL,           15.00, 34.20),
(15, 'home',     198.00, 2376.00,  500.00, '500000 liability', NULL,           30.00, 47.85),
-- life quotes
(17, 'life',      41.67,  500.00,    NULL, NULL,               NULL,           NULL,  8.00),
(18, 'life',     125.00, 1500.00,   NULL, NULL,               NULL,           NULL, 24.50),
(21, 'life',     183.33, 2200.00,   NULL, NULL,               NULL,           NULL, 35.00),
-- business quotes
(24, 'business', 312.50, 3750.00, 2500.00, '1000000 general liability', NULL, 45.00, 62.75),
(28, 'business', 245.00, 2940.00, 2000.00, '500000 general liability',  NULL, 35.00, 51.20),
(29, 'business', 520.83, 6250.00, 5000.00, '2000000 general liability', NULL, 75.00, 98.40);

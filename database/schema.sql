-- ============================================================
-- Classic Insurance — Database Schema
-- MySQL 8.0+   (CHECK constraints require 8.0.16+)
-- Run: mysql -u root -p < database/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS insurance_data_dummy
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE insurance_data_dummy;

-- ============================================================
-- employees
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
    id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    username      VARCHAR(50)     NOT NULL,
    password      VARCHAR(255)    NOT NULL,          -- bcrypt hash
    full_name     VARCHAR(100)    NOT NULL,
    role          ENUM('admin', 'agent') NOT NULL DEFAULT 'agent',
    created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uq_employee_username UNIQUE (username)
);

-- ============================================================
-- customers
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    name            VARCHAR(100)    NOT NULL,
    email           VARCHAR(255)    NOT NULL,
    phone           CHAR(10)        NOT NULL,
    insurance_type  ENUM('auto', 'home', 'life', 'business') NULL,
    assigned_to     VARCHAR(50)     NULL,            -- references employees.username
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    -- prevent exact duplicates created by getOrCreateCustomerId
    CONSTRAINT uq_customer UNIQUE (name, email, phone),
    CONSTRAINT chk_email  CHECK (email  REGEXP '^[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_phone  CHECK (phone  REGEXP '^[0-9]{10}$')
);

CREATE INDEX idx_customers_assigned_to ON customers (assigned_to);
CREATE INDEX idx_customers_email       ON customers (email);

-- ============================================================
-- auto_insurance
-- ============================================================
CREATE TABLE IF NOT EXISTS auto_insurance (
    id                INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    customer_id       INT UNSIGNED    NOT NULL,
    vehicle_make      VARCHAR(50)     NOT NULL,
    vehicle_model     VARCHAR(50)     NOT NULL,
    vin               CHAR(17)        NOT NULL,
    license_number    VARCHAR(20)     NOT NULL,
    insurance_company VARCHAR(100)    NOT NULL,
    coverage          VARCHAR(100)    NOT NULL,
    created_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uq_auto_vin   UNIQUE  (vin),
    CONSTRAINT chk_vin_len   CHECK   (CHAR_LENGTH(vin) = 17),
    CONSTRAINT fk_auto_customer
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
);

CREATE INDEX idx_auto_customer_id ON auto_insurance (customer_id);

-- ============================================================
-- home_insurance
-- ============================================================
CREATE TABLE IF NOT EXISTS home_insurance (
    id               INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    customer_id      INT UNSIGNED      NOT NULL,
    property_address VARCHAR(255)      NOT NULL,
    home_type        VARCHAR(50)       NOT NULL,
    property_value   DECIMAL(12, 2)    NOT NULL,
    coverage_amount  DECIMAL(12, 2)    NOT NULL,
    created_at       TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT chk_home_property_value_pos CHECK (property_value  > 0),
    CONSTRAINT chk_home_coverage_pos       CHECK (coverage_amount > 0),
    CONSTRAINT fk_home_customer
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
);

CREATE INDEX idx_home_customer_id ON home_insurance (customer_id);

-- ============================================================
-- life_insurance
-- ============================================================
CREATE TABLE IF NOT EXISTS life_insurance (
    id               INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    customer_id      INT UNSIGNED      NOT NULL,
    type_of_coverage VARCHAR(50)       NOT NULL,
    coverage_amount  DECIMAL(12, 2)    NOT NULL,
    beneficiary_name VARCHAR(100)      NOT NULL,
    created_at       TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT chk_life_coverage_pos CHECK (coverage_amount > 0),
    CONSTRAINT fk_life_customer
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
);

CREATE INDEX idx_life_customer_id ON life_insurance (customer_id);

-- ============================================================
-- business_insurance
-- ============================================================
CREATE TABLE IF NOT EXISTS business_insurance (
    id              INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    customer_id     INT UNSIGNED      NOT NULL,
    business_name   VARCHAR(150)      NOT NULL,
    business_type   VARCHAR(100)      NOT NULL,
    coverage_amount DECIMAL(12, 2)    NOT NULL,
    created_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT chk_biz_coverage_pos CHECK (coverage_amount > 0),
    CONSTRAINT fk_biz_customer
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
);

CREATE INDEX idx_business_customer_id ON business_insurance (customer_id);

-- ============================================================
-- quotes
-- ============================================================
CREATE TABLE IF NOT EXISTS quotes (
    id                               INT UNSIGNED      NOT NULL AUTO_INCREMENT,
    customer_id                      INT UNSIGNED      NOT NULL,
    insurance_type                   ENUM('auto', 'home', 'life', 'business') NOT NULL,
    monthly_premium                  DECIMAL(10, 2)    NULL,
    annual_premium                   DECIMAL(10, 2)    NULL,
    deductible                       DECIMAL(10, 2)    NULL,
    liability_coverage_limits        VARCHAR(100)      NULL,
    comp_and_collision_coverage_limits VARCHAR(100)    NULL,
    optional_coverage_costs          DECIMAL(10, 2)    NULL,
    fees_and_taxes                   DECIMAL(10, 2)    NULL,
    created_at                       TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT chk_quote_monthly_pos   CHECK (monthly_premium       IS NULL OR monthly_premium       >= 0),
    CONSTRAINT chk_quote_annual_pos    CHECK (annual_premium        IS NULL OR annual_premium        >= 0),
    CONSTRAINT chk_quote_deductible_pos CHECK (deductible           IS NULL OR deductible            >= 0),
    CONSTRAINT chk_quote_optional_pos  CHECK (optional_coverage_costs IS NULL OR optional_coverage_costs >= 0),
    CONSTRAINT chk_quote_fees_pos      CHECK (fees_and_taxes        IS NULL OR fees_and_taxes        >= 0),
    CONSTRAINT fk_quote_customer
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
);

CREATE INDEX idx_quotes_customer_id    ON quotes (customer_id);
CREATE INDEX idx_quotes_insurance_type ON quotes (insurance_type);

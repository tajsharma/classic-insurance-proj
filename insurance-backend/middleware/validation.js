const EMAIL_RE        = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
const PHONE_RE        = /^\d{10}$/;
// ISO 3779: VINs never contain I, O, or Q
const VIN_RE          = /^[A-HJ-NPR-Z0-9]{17}$/i;
const VALID_INS_TYPES = new Set(['auto', 'home', 'life', 'business']);

// ── Sanitization ──────────────────────────────────────────────────────────────
// Defense-in-depth on top of parameterized queries: strip null bytes,
// non-printable control characters, and HTML tags (prevents stored XSS).

const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .trim()
    .replace(/\0/g, '')                             // null bytes
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // non-printable control chars
    .replace(/<[^>]*>/g, '');                       // HTML / script tags
};

// Applied globally in server.js — sanitizes every string field in req.body.
const sanitizeBody = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      req.body[key] = sanitizeString(req.body[key]);
    }
  }
  next();
};

// ── Low-level field validators (push errors into an array) ────────────────────

const requireField = (errors, value, label) => {
  if (!value || String(value).trim() === '') {
    errors.push(`${label} is required`);
    return false;
  }
  return true;
};

const validateEmail = (errors, email) => {
  if (!requireField(errors, email, 'Email')) return;
  if (!EMAIL_RE.test(email)) errors.push('Email format is invalid');
};

const validatePhone = (errors, phone) => {
  if (!requireField(errors, phone, 'Phone')) return;
  if (!PHONE_RE.test(phone)) errors.push('Phone must be exactly 10 digits with no spaces or dashes');
};

const validateVIN = (errors, vin) => {
  if (!requireField(errors, vin, 'VIN')) return;
  if (!VIN_RE.test(vin)) errors.push('VIN must be exactly 17 alphanumeric characters (I, O, and Q are not valid VIN characters)');
};

// Validates a field that must be a positive number (> 0).
const validatePositive = (errors, value, label) => {
  if (!requireField(errors, value, label)) return;
  const n = Number(value);
  if (isNaN(n) || n <= 0) errors.push(`${label} must be a positive number`);
};

// Validates an optional monetary field: if present it must be >= 0.
const validateNonNegativeOptional = (errors, value, label) => {
  if (value === undefined || value === null || value === '') return;
  const n = Number(value);
  if (isNaN(n) || n < 0) errors.push(`${label} must be a non-negative number`);
};

// Shared check used by all four submit endpoints.
const validateCustomerFields = (errors, body) => {
  requireField(errors, body.name, 'Name');
  validateEmail(errors, body.email);
  validatePhone(errors, body.phone);
};

const respond400 = (res, errors) => res.status(400).json({ errors });

// ── Per-endpoint middleware ────────────────────────────────────────────────────

const validateAuto = (req, res, next) => {
  const { name, email, phone, vehicleMake, vehicleModel, vin, licenseNumber, insuranceCompany, coverage } = req.body;
  const errors = [];

  validateCustomerFields(errors, { name, email, phone });
  requireField(errors, vehicleMake,      'Vehicle make');
  requireField(errors, vehicleModel,     'Vehicle model');
  validateVIN(errors, vin);
  requireField(errors, licenseNumber,    'License number');
  requireField(errors, insuranceCompany, 'Insurance company');
  requireField(errors, coverage,         'Coverage type');

  if (errors.length) return respond400(res, errors);
  next();
};

const validateHome = (req, res, next) => {
  const { name, email, phone, propertyAddress, homeType, propertyValue, coverageAmount } = req.body;
  const errors = [];

  validateCustomerFields(errors, { name, email, phone });
  requireField(errors,  propertyAddress, 'Property address');
  requireField(errors,  homeType,        'Home type');
  validatePositive(errors, propertyValue,  'Property value');
  validatePositive(errors, coverageAmount, 'Coverage amount');

  if (errors.length) return respond400(res, errors);
  next();
};

const validateLife = (req, res, next) => {
  const { name, email, phone, coverageType, coverageAmount, beneficiary } = req.body;
  const errors = [];

  validateCustomerFields(errors, { name, email, phone });
  requireField(errors,  coverageType,   'Coverage type');
  validatePositive(errors, coverageAmount, 'Coverage amount');
  requireField(errors,  beneficiary,    'Beneficiary name');

  if (errors.length) return respond400(res, errors);
  next();
};

const validateBusiness = (req, res, next) => {
  const { name, email, phone, businessName, businessType, coverageAmount } = req.body;
  const errors = [];

  validateCustomerFields(errors, { name, email, phone });
  requireField(errors,  businessName,   'Business name');
  requireField(errors,  businessType,   'Business type');
  validatePositive(errors, coverageAmount, 'Coverage amount');

  if (errors.length) return respond400(res, errors);
  next();
};

const validateQuote = (req, res, next) => {
  const {
    customerId, insuranceType,
    monthlyPremium, annualPremium, deductible,
    optionalCoverageCosts, feesAndTaxes,
  } = req.body;
  const errors = [];

  if (!requireField(errors, customerId, 'Customer ID')) {
    // keep going to catch other errors
  } else {
    const id = Number(customerId);
    if (!Number.isInteger(id) || id <= 0) errors.push('Customer ID must be a positive integer');
  }

  if (!requireField(errors, insuranceType, 'Insurance type')) {
    // keep going
  } else if (!VALID_INS_TYPES.has(insuranceType)) {
    errors.push(`Insurance type must be one of: ${[...VALID_INS_TYPES].join(', ')}`);
  }

  validateNonNegativeOptional(errors, monthlyPremium,       'Monthly premium');
  validateNonNegativeOptional(errors, annualPremium,        'Annual premium');
  validateNonNegativeOptional(errors, deductible,           'Deductible');
  validateNonNegativeOptional(errors, optionalCoverageCosts,'Optional coverage costs');
  validateNonNegativeOptional(errors, feesAndTaxes,         'Fees and taxes');

  if (errors.length) return respond400(res, errors);
  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  requireField(errors, username, 'Username');
  requireField(errors, password, 'Password');

  if (errors.length) return respond400(res, errors);
  next();
};

module.exports = {
  sanitizeBody,
  validateAuto,
  validateHome,
  validateLife,
  validateBusiness,
  validateQuote,
  validateLogin,
};

"""
Data quality scan.

Checks for:
  1.  Duplicate customers (same email; same name+phone)
  2.  Customers with no linked insurance policy
  3.  insurance_type column mismatch vs actual policy tables
  4.  Orphaned insurance records (customer_id missing from customers)
  5.  Invalid VIN length (should be 17)
  6.  Duplicate VINs
  7.  Non-positive coverage amounts
  8.  Quotes with no matching customer
  9.  Customers with NULL insurance_type despite having a policy
  10. Unassigned customers (assigned_to IS NULL)

Outputs to console and writes:
  scripts/reports/output/data_quality_YYYY-MM-DD.csv
"""

import sys
import os
from datetime import date

import pandas as pd

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from db_config import get_engine

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'output')
TODAY = date.today().isoformat()

SEVERITY_ORDER = {'CRITICAL': 0, 'WARNING': 1, 'INFO': 2}


def section(title):
    bar = '─' * 62
    print(f'\n{bar}')
    print(f'  {title}')
    print(bar)


def flag(issues, severity, check, detail, df):
    """Append rows from df into the issues list with metadata columns."""
    if df is None or df.empty:
        return
    df = df.copy()
    df.insert(0, 'severity', severity)
    df.insert(1, 'check', check)
    df.insert(2, 'detail', detail)
    issues.append(df)


def print_issue(severity, count, label, df=None):
    icons = {'CRITICAL': '🔴', 'WARNING': '🟡', 'INFO': '🔵'}
    icon = icons.get(severity, '  ')
    status = f'{icon} [{severity}]  {label}  ({count} found)'
    print(f'  {status}')
    if df is not None and not df.empty:
        # indent the dataframe
        lines = df.to_string(index=False).splitlines()
        for line in lines:
            print(f'      {line}')


def run():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    engine = get_engine()
    issues = []
    total_problems = 0

    print(f'\n{"═" * 62}')
    print(f'  DATA QUALITY SCAN  —  {TODAY}')
    print(f'{"═" * 62}')

    # ── 1. Duplicate emails ───────────────────────────────────────────
    section('1. Duplicate Email Addresses')

    df = pd.read_sql(
        """
        SELECT email, COUNT(*) AS occurrences,
               GROUP_CONCAT(id   ORDER BY id SEPARATOR ', ') AS customer_ids,
               GROUP_CONCAT(name ORDER BY id SEPARATOR ', ') AS names
        FROM customers
        GROUP BY email
        HAVING occurrences > 1
        """,
        engine,
    )
    n = len(df)
    total_problems += n
    print_issue('CRITICAL', n, 'Customers sharing the same email', df if n else None)
    flag(issues, 'CRITICAL', 'Duplicate email', 'Multiple customer records share an email address', df)

    # ── 2. Duplicate name + phone ─────────────────────────────────────
    section('2. Duplicate Name + Phone Combinations')

    df = pd.read_sql(
        """
        SELECT name, phone, COUNT(*) AS occurrences,
               GROUP_CONCAT(id ORDER BY id SEPARATOR ', ') AS customer_ids
        FROM customers
        GROUP BY name, phone
        HAVING occurrences > 1
        """,
        engine,
    )
    n = len(df)
    total_problems += n
    print_issue('CRITICAL', n, 'Customers with identical name + phone', df if n else None)
    flag(issues, 'CRITICAL', 'Duplicate name+phone', 'Same name and phone across multiple records', df)

    # ── 3. Customers with no insurance policy ─────────────────────────
    section('3. Customers With No Linked Insurance Policy')

    df = pd.read_sql(
        """
        SELECT c.id, c.name, c.email, c.phone,
               COALESCE(c.insurance_type, 'NULL') AS insurance_type,
               c.created_at
        FROM customers c
        WHERE NOT EXISTS (SELECT 1 FROM auto_insurance     ai WHERE ai.customer_id = c.id)
          AND NOT EXISTS (SELECT 1 FROM home_insurance     hi WHERE hi.customer_id = c.id)
          AND NOT EXISTS (SELECT 1 FROM life_insurance     li WHERE li.customer_id = c.id)
          AND NOT EXISTS (SELECT 1 FROM business_insurance bi WHERE bi.customer_id = c.id)
        ORDER BY c.id
        """,
        engine,
    )
    n = len(df)
    total_problems += n
    print_issue('WARNING', n, 'Customers with no policy record in any insurance table', df if n else None)
    flag(issues, 'WARNING', 'No policy record', 'Customer exists but has no linked insurance policy', df)

    # ── 4. insurance_type mismatch ────────────────────────────────────
    section('4. insurance_type Column Mismatch vs Actual Policy Tables')

    mismatch_queries = {
        'auto':     "SELECT c.id, c.name, c.insurance_type, 'has auto policy but type is not auto' AS mismatch FROM customers c JOIN auto_insurance ai ON ai.customer_id = c.id WHERE c.insurance_type != 'auto'",
        'home':     "SELECT c.id, c.name, c.insurance_type, 'has home policy but type is not home' AS mismatch FROM customers c JOIN home_insurance hi ON hi.customer_id = c.id WHERE c.insurance_type != 'home'",
        'life':     "SELECT c.id, c.name, c.insurance_type, 'has life policy but type is not life' AS mismatch FROM customers c JOIN life_insurance li ON li.customer_id = c.id WHERE c.insurance_type != 'life'",
        'business': "SELECT c.id, c.name, c.insurance_type, 'has business policy but type is not business' AS mismatch FROM customers c JOIN business_insurance bi ON bi.customer_id = c.id WHERE c.insurance_type != 'business'",
    }
    mismatch_frames = []
    for q in mismatch_queries.values():
        mismatch_frames.append(pd.read_sql(q, engine))
    df = pd.concat(mismatch_frames, ignore_index=True)
    n = len(df)
    total_problems += n
    print_issue('WARNING', n, 'insurance_type field disagrees with actual policy table', df if n else None)
    flag(issues, 'WARNING', 'insurance_type mismatch', 'customers.insurance_type does not match their policy table', df)

    # ── 5. Orphaned insurance records ─────────────────────────────────
    section('5. Orphaned Insurance Records (customer_id not in customers)')

    orphan_queries = {
        'auto_insurance':     "SELECT 'auto_insurance' AS source_table, ai.id AS record_id, ai.customer_id FROM auto_insurance ai LEFT JOIN customers c ON c.id = ai.customer_id WHERE c.id IS NULL",
        'home_insurance':     "SELECT 'home_insurance', hi.id, hi.customer_id FROM home_insurance hi LEFT JOIN customers c ON c.id = hi.customer_id WHERE c.id IS NULL",
        'life_insurance':     "SELECT 'life_insurance', li.id, li.customer_id FROM life_insurance li LEFT JOIN customers c ON c.id = li.customer_id WHERE c.id IS NULL",
        'business_insurance': "SELECT 'business_insurance', bi.id, bi.customer_id FROM business_insurance bi LEFT JOIN customers c ON c.id = bi.customer_id WHERE c.id IS NULL",
        'quotes':             "SELECT 'quotes', q.id, q.customer_id FROM quotes q LEFT JOIN customers c ON c.id = q.customer_id WHERE c.id IS NULL",
    }
    orphan_frames = [pd.read_sql(q, engine) for q in orphan_queries.values()]
    df = pd.concat(orphan_frames, ignore_index=True)
    n = len(df)
    total_problems += n
    print_issue('CRITICAL', n, 'Insurance/quote records pointing to a non-existent customer', df if n else None)
    flag(issues, 'CRITICAL', 'Orphaned record', 'Record references a customer_id that does not exist', df)

    # ── 6. Invalid VIN length ─────────────────────────────────────────
    section('6. VINs That Are Not Exactly 17 Characters')

    df = pd.read_sql(
        """
        SELECT ai.id, ai.customer_id, c.name, ai.vin,
               CHAR_LENGTH(ai.vin) AS vin_length
        FROM auto_insurance ai
        JOIN customers c ON c.id = ai.customer_id
        WHERE CHAR_LENGTH(ai.vin) != 17
        """,
        engine,
    )
    n = len(df)
    total_problems += n
    print_issue('CRITICAL', n, 'VINs with incorrect length (must be 17)', df if n else None)
    flag(issues, 'CRITICAL', 'Invalid VIN length', 'VIN is not exactly 17 characters', df)

    # ── 7. Duplicate VINs ─────────────────────────────────────────────
    section('7. Duplicate VINs')

    df = pd.read_sql(
        """
        SELECT vin, COUNT(*) AS occurrences,
               GROUP_CONCAT(id           ORDER BY id SEPARATOR ', ') AS record_ids,
               GROUP_CONCAT(customer_id  ORDER BY id SEPARATOR ', ') AS customer_ids
        FROM auto_insurance
        GROUP BY vin
        HAVING occurrences > 1
        """,
        engine,
    )
    n = len(df)
    total_problems += n
    print_issue('CRITICAL', n, 'VINs appearing on more than one policy', df if n else None)
    flag(issues, 'CRITICAL', 'Duplicate VIN', 'Same VIN registered to multiple auto_insurance records', df)

    # ── 8. Non-positive coverage amounts ──────────────────────────────
    section('8. Non-Positive Coverage Amounts')

    df = pd.read_sql(
        """
        SELECT customer_id, coverage_amount, 'home_insurance' AS source_table
        FROM home_insurance WHERE coverage_amount <= 0
        UNION ALL
        SELECT customer_id, coverage_amount, 'life_insurance'
        FROM life_insurance WHERE coverage_amount <= 0
        UNION ALL
        SELECT customer_id, coverage_amount, 'business_insurance'
        FROM business_insurance WHERE coverage_amount <= 0
        """,
        engine,
    )
    n = len(df)
    total_problems += n
    print_issue('CRITICAL', n, 'Coverage amounts that are zero or negative', df if n else None)
    flag(issues, 'CRITICAL', 'Non-positive coverage', 'coverage_amount is 0 or less', df)

    # ── 9. Non-positive quote premiums ────────────────────────────────
    section('9. Negative Premiums or Deductibles in Quotes')

    df = pd.read_sql(
        """
        SELECT id AS quote_id, customer_id, insurance_type,
               monthly_premium, annual_premium, deductible
        FROM quotes
        WHERE (monthly_premium  IS NOT NULL AND monthly_premium  < 0)
           OR (annual_premium   IS NOT NULL AND annual_premium   < 0)
           OR (deductible       IS NOT NULL AND deductible       < 0)
        """,
        engine,
    )
    n = len(df)
    total_problems += n
    print_issue('CRITICAL', n, 'Quotes with negative monetary values', df if n else None)
    flag(issues, 'CRITICAL', 'Negative quote value', 'A premium or deductible is negative', df)

    # ── 10. NULL insurance_type with existing policy ──────────────────
    section('10. Customers With a Policy But NULL insurance_type')

    df = pd.read_sql(
        """
        SELECT c.id, c.name, c.email
        FROM customers c
        WHERE c.insurance_type IS NULL
          AND (
            EXISTS (SELECT 1 FROM auto_insurance     ai WHERE ai.customer_id = c.id)
            OR EXISTS (SELECT 1 FROM home_insurance   hi WHERE hi.customer_id = c.id)
            OR EXISTS (SELECT 1 FROM life_insurance   li WHERE li.customer_id = c.id)
            OR EXISTS (SELECT 1 FROM business_insurance bi WHERE bi.customer_id = c.id)
          )
        """,
        engine,
    )
    n = len(df)
    total_problems += n
    print_issue('WARNING', n, 'Customers with a policy but insurance_type is NULL', df if n else None)
    flag(issues, 'WARNING', 'NULL insurance_type', 'Has a policy record but customers.insurance_type is NULL', df)

    # ── 11. Unassigned customers ──────────────────────────────────────
    section('11. Customers With No Agent Assigned')

    df = pd.read_sql(
        """
        SELECT id, name, email, COALESCE(insurance_type, 'unassigned') AS insurance_type
        FROM customers
        WHERE assigned_to IS NULL
        ORDER BY id
        """,
        engine,
    )
    n = len(df)
    # Not added to total_problems — unassigned is expected, just informational
    print_issue('INFO', n, 'Customers not yet assigned to an agent', df if n else None)
    flag(issues, 'INFO', 'Unassigned customer', 'No agent assigned (assigned_to IS NULL)', df)

    # ── Summary ───────────────────────────────────────────────────────
    print(f'\n{"═" * 62}')
    print(f'  SCAN COMPLETE — {total_problems} problem(s) found')
    print(f'{"═" * 62}')

    # ── Save CSV ──────────────────────────────────────────────────────
    out_path = os.path.join(OUTPUT_DIR, f'data_quality_{TODAY}.csv')
    if issues:
        all_issues = pd.concat(issues, ignore_index=True)
        # Sort CRITICAL → WARNING → INFO
        all_issues['_sort'] = all_issues['severity'].map(SEVERITY_ORDER)
        all_issues = all_issues.sort_values('_sort').drop(columns='_sort')
        all_issues.to_csv(out_path, index=False)
        print(f'  Report saved → {out_path}')
    else:
        # Write an empty file so the output directory always has something
        pd.DataFrame(columns=['severity', 'check', 'detail']).to_csv(out_path, index=False)
        print(f'  Clean bill of health — empty report saved → {out_path}')

    print()


if __name__ == '__main__':
    run()

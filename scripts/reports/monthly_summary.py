"""
Monthly insurance summary report.

Outputs to console and writes:
  scripts/reports/output/monthly_summary_YYYY-MM.csv
"""

import sys
import os
from datetime import datetime, date

import pandas as pd

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from db_config import get_engine

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'output')
TODAY = date.today()
REPORT_MONTH = TODAY.strftime('%Y-%m')


def section(title):
    bar = '─' * 60
    print(f'\n{bar}')
    print(f'  {title}')
    print(bar)


def fmt_currency(val):
    if pd.isna(val):
        return 'N/A'
    return f'${val:,.2f}'


def run():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    engine = get_engine()
    report_rows = []  # collected for the combined CSV

    print(f'\n{"═" * 60}')
    print(f'  MONTHLY INSURANCE REPORT  —  {TODAY.strftime("%B %Y")}')
    print(f'{"═" * 60}')

    # ── 1. Customers by insurance type ───────────────────────────────
    section('1. CUSTOMERS BY INSURANCE TYPE')

    df_types = pd.read_sql(
        """
        SELECT
            COALESCE(insurance_type, 'unassigned') AS insurance_type,
            COUNT(*)                                AS customer_count
        FROM customers
        GROUP BY insurance_type
        ORDER BY customer_count DESC
        """,
        engine,
    )
    total = df_types['customer_count'].sum()
    df_types['percentage'] = (df_types['customer_count'] / total * 100).round(1).astype(str) + '%'
    df_types.columns = ['Insurance Type', 'Customers', 'Share']
    print(df_types.to_string(index=False))
    print(f'\n  Total customers: {total}')

    df_types['report_section'] = '1. Customers by Type'
    report_rows.append(df_types)

    # ── 2. Average coverage amounts ───────────────────────────────────
    section('2. AVERAGE COVERAGE AMOUNTS')

    df_coverage = pd.read_sql(
        """
        SELECT 'Home Insurance'     AS policy_type,
               COUNT(*)             AS policies,
               AVG(coverage_amount) AS avg_coverage,
               MIN(coverage_amount) AS min_coverage,
               MAX(coverage_amount) AS max_coverage
        FROM home_insurance
        UNION ALL
        SELECT 'Life Insurance',
               COUNT(*), AVG(coverage_amount), MIN(coverage_amount), MAX(coverage_amount)
        FROM life_insurance
        UNION ALL
        SELECT 'Business Insurance',
               COUNT(*), AVG(coverage_amount), MIN(coverage_amount), MAX(coverage_amount)
        FROM business_insurance
        """,
        engine,
    )

    for col in ('avg_coverage', 'min_coverage', 'max_coverage'):
        df_coverage[col] = df_coverage[col].apply(fmt_currency)

    df_coverage.columns = ['Policy Type', 'Policies', 'Avg Coverage', 'Min Coverage', 'Max Coverage']
    print(df_coverage.to_string(index=False))
    print('\n  Note: Auto insurance uses qualitative coverage tiers (not a dollar amount).')

    df_coverage['report_section'] = '2. Coverage Amounts'
    report_rows.append(df_coverage)

    # ── 3. Auto coverage tier breakdown ──────────────────────────────
    section('3. AUTO INSURANCE — COVERAGE TIER BREAKDOWN')

    df_auto = pd.read_sql(
        """
        SELECT coverage AS coverage_tier, COUNT(*) AS policies
        FROM auto_insurance
        GROUP BY coverage
        ORDER BY policies DESC
        """,
        engine,
    )
    df_auto.columns = ['Coverage Tier', 'Policies']
    print(df_auto.to_string(index=False))

    df_auto['report_section'] = '3. Auto Tiers'
    report_rows.append(df_auto)

    # ── 4. New customers: this month vs last month ────────────────────
    section('4. NEW CUSTOMERS — THIS MONTH vs LAST MONTH')

    df_new = pd.read_sql(
        """
        SELECT
            DATE_FORMAT(created_at, '%Y-%m')  AS month,
            COUNT(*)                           AS new_customers
        FROM customers
        WHERE created_at >= DATE_SUB(LAST_DAY(CURDATE()), INTERVAL 1 MONTH)
           OR DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
        GROUP BY month
        ORDER BY month
        """,
        engine,
    )

    # Fetch all time monthly trend (last 6 months)
    df_trend = pd.read_sql(
        """
        SELECT
            DATE_FORMAT(created_at, '%Y-%m') AS month,
            COUNT(*)                          AS new_customers,
            COALESCE(insurance_type, 'unassigned') AS insurance_type
        FROM customers
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY month, insurance_type
        ORDER BY month, insurance_type
        """,
        engine,
    )

    if df_trend.empty:
        print('  No customer data in the last 6 months.')
    else:
        pivot = df_trend.pivot_table(
            index='month', columns='insurance_type', values='new_customers', fill_value=0
        )
        pivot['TOTAL'] = pivot.sum(axis=1)
        print(pivot.to_string())

    df_trend['report_section'] = '4. Monthly Trend'
    report_rows.append(df_trend)

    # ── 5. Quote activity ─────────────────────────────────────────────
    section('5. QUOTE ACTIVITY')

    df_quotes = pd.read_sql(
        """
        SELECT
            insurance_type,
            COUNT(*)                 AS total_quotes,
            AVG(monthly_premium)     AS avg_monthly_premium,
            AVG(annual_premium)      AS avg_annual_premium,
            AVG(deductible)          AS avg_deductible
        FROM quotes
        GROUP BY insurance_type
        ORDER BY total_quotes DESC
        """,
        engine,
    )

    for col in ('avg_monthly_premium', 'avg_annual_premium', 'avg_deductible'):
        df_quotes[col] = df_quotes[col].apply(fmt_currency)

    df_quotes.columns = [
        'Insurance Type', 'Quotes', 'Avg Monthly', 'Avg Annual', 'Avg Deductible'
    ]
    print(df_quotes.to_string(index=False))

    df_quotes['report_section'] = '5. Quote Activity'
    report_rows.append(df_quotes)

    # ── 6. Employee client load ───────────────────────────────────────
    section('6. EMPLOYEE CLIENT LOAD')

    df_emp = pd.read_sql(
        """
        SELECT
            e.full_name                                                        AS employee,
            e.username,
            e.role,
            COUNT(c.id)                                                        AS assigned_clients,
            COALESCE(
                GROUP_CONCAT(DISTINCT c.insurance_type ORDER BY c.insurance_type SEPARATOR ', '),
                '—'
            )                                                                  AS policy_types
        FROM employees e
        LEFT JOIN customers c ON c.assigned_to = e.username
        GROUP BY e.id, e.full_name, e.username, e.role
        ORDER BY assigned_clients DESC
        """,
        engine,
    )

    df_emp.columns = ['Employee', 'Username', 'Role', 'Assigned Clients', 'Policy Types']
    print(df_emp.to_string(index=False))

    unassigned = pd.read_sql(
        "SELECT COUNT(*) AS n FROM customers WHERE assigned_to IS NULL",
        engine,
    ).iloc[0, 0]
    print(f'\n  Unassigned customers: {unassigned}')

    df_emp['report_section'] = '6. Employee Load'
    report_rows.append(df_emp)

    # ── Save combined CSV ─────────────────────────────────────────────
    out_path = os.path.join(OUTPUT_DIR, f'monthly_summary_{REPORT_MONTH}.csv')
    combined = pd.concat(report_rows, ignore_index=True)
    combined.to_csv(out_path, index=False)

    print(f'\n{"═" * 60}')
    print(f'  Report saved → {out_path}')
    print(f'{"═" * 60}\n')


if __name__ == '__main__':
    run()

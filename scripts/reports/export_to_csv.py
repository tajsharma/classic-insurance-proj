"""
Full database export to CSV.

Each table is written to its own timestamped file in:
  scripts/reports/output/export_YYYY-MM-DD/

The employees table has the password column redacted.
"""

import sys
import os
from datetime import date

import pandas as pd

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from db_config import get_engine

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'output')
TODAY = date.today().isoformat()


def section(title):
    print(f'\n  {"─" * 52}')
    print(f'  {title}')


def export_table(engine, table, query, export_dir, label=None):
    label = label or table
    df = pd.read_sql(query, engine)
    row_count = len(df)
    col_count = len(df.columns)
    out_path = os.path.join(export_dir, f'{table}.csv')
    df.to_csv(out_path, index=False)
    print(f'  ✓  {label:<30}  {row_count:>4} rows  ×  {col_count} cols  →  {os.path.basename(out_path)}')
    return df


def run():
    export_dir = os.path.join(OUTPUT_DIR, f'export_{TODAY}')
    os.makedirs(export_dir, exist_ok=True)
    engine = get_engine()

    print(f'\n{"═" * 60}')
    print(f'  DATABASE EXPORT  —  {TODAY}')
    print(f'  Destination: {export_dir}')
    print(f'{"═" * 60}')

    exported = {}

    section('Core tables')

    # employees — password column is redacted
    exported['employees'] = export_table(
        engine,
        'employees',
        "SELECT id, username, full_name, role, created_at FROM employees ORDER BY id",
        export_dir,
        label='employees  (password redacted)',
    )

    exported['customers'] = export_table(
        engine,
        'customers',
        "SELECT id, name, email, phone, insurance_type, assigned_to, created_at FROM customers ORDER BY id",
        export_dir,
    )

    section('Policy tables')

    exported['auto_insurance'] = export_table(
        engine,
        'auto_insurance',
        """
        SELECT
            ai.id,
            ai.customer_id,
            c.name       AS customer_name,
            ai.vehicle_make,
            ai.vehicle_model,
            ai.vin,
            ai.license_number,
            ai.insurance_company,
            ai.coverage,
            ai.created_at
        FROM auto_insurance ai
        JOIN customers c ON c.id = ai.customer_id
        ORDER BY ai.id
        """,
        export_dir,
        label='auto_insurance  (+ customer name)',
    )

    exported['home_insurance'] = export_table(
        engine,
        'home_insurance',
        """
        SELECT
            hi.id,
            hi.customer_id,
            c.name       AS customer_name,
            hi.property_address,
            hi.home_type,
            hi.property_value,
            hi.coverage_amount,
            hi.created_at
        FROM home_insurance hi
        JOIN customers c ON c.id = hi.customer_id
        ORDER BY hi.id
        """,
        export_dir,
        label='home_insurance  (+ customer name)',
    )

    exported['life_insurance'] = export_table(
        engine,
        'life_insurance',
        """
        SELECT
            li.id,
            li.customer_id,
            c.name       AS customer_name,
            li.type_of_coverage,
            li.coverage_amount,
            li.beneficiary_name,
            li.created_at
        FROM life_insurance li
        JOIN customers c ON c.id = li.customer_id
        ORDER BY li.id
        """,
        export_dir,
        label='life_insurance  (+ customer name)',
    )

    exported['business_insurance'] = export_table(
        engine,
        'business_insurance',
        """
        SELECT
            bi.id,
            bi.customer_id,
            c.name       AS customer_name,
            bi.business_name,
            bi.business_type,
            bi.coverage_amount,
            bi.created_at
        FROM business_insurance bi
        JOIN customers c ON c.id = bi.customer_id
        ORDER BY bi.id
        """,
        export_dir,
        label='business_insurance  (+ customer name)',
    )

    section('Quotes')

    exported['quotes'] = export_table(
        engine,
        'quotes',
        """
        SELECT
            q.id,
            q.customer_id,
            c.name       AS customer_name,
            q.insurance_type,
            q.monthly_premium,
            q.annual_premium,
            q.deductible,
            q.liability_coverage_limits,
            q.comp_and_collision_coverage_limits,
            q.optional_coverage_costs,
            q.fees_and_taxes,
            q.created_at
        FROM quotes q
        JOIN customers c ON c.id = q.customer_id
        ORDER BY q.id
        """,
        export_dir,
        label='quotes  (+ customer name)',
    )

    # ── Flat joined view — all customers with their policy details ────
    section('Flat joined view (all tables combined)')

    exported['all_customers_flat'] = export_table(
        engine,
        'all_customers_flat',
        """
        SELECT
            c.id            AS customer_id,
            c.name,
            c.email,
            c.phone,
            c.insurance_type,
            c.assigned_to,
            -- auto
            ai.vehicle_make,
            ai.vehicle_model,
            ai.vin,
            ai.license_number,
            ai.insurance_company,
            ai.coverage      AS auto_coverage_tier,
            -- home
            hi.property_address,
            hi.home_type,
            hi.property_value,
            hi.coverage_amount AS home_coverage_amount,
            -- life
            li.type_of_coverage,
            li.coverage_amount AS life_coverage_amount,
            li.beneficiary_name,
            -- business
            bi.business_name,
            bi.business_type,
            bi.coverage_amount AS business_coverage_amount,
            c.created_at    AS customer_since
        FROM customers c
        LEFT JOIN auto_insurance     ai ON ai.customer_id = c.id
        LEFT JOIN home_insurance     hi ON hi.customer_id = c.id
        LEFT JOIN life_insurance     li ON li.customer_id = c.id
        LEFT JOIN business_insurance bi ON bi.customer_id = c.id
        ORDER BY c.id
        """,
        export_dir,
        label='all_customers_flat  (joined view)',
    )

    # ── Summary stats written to a manifest file ──────────────────────
    total_rows = sum(len(df) for df in exported.values())
    total_files = len(exported)

    manifest_path = os.path.join(export_dir, '_manifest.csv')
    manifest = pd.DataFrame([
        {'file': f'{k}.csv', 'rows': len(v), 'columns': len(v.columns)}
        for k, v in exported.items()
    ])
    manifest.loc[len(manifest)] = ['TOTAL', total_rows, '—']
    manifest.to_csv(manifest_path, index=False)

    print(f'\n{"═" * 60}')
    print(f'  Export complete: {total_files} files, {total_rows} total rows')
    print(f'  Manifest → {manifest_path}')
    print(f'{"═" * 60}\n')


if __name__ == '__main__':
    run()

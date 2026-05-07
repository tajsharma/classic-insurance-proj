import os
from pathlib import Path
from urllib.parse import quote_plus

# Load .env from the scripts/ directory if present
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / '.env')
except ImportError:
    pass

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASS = os.getenv('DB_PASS', '')
DB_NAME = os.getenv('DB_NAME', 'insurance_data_dummy')


def get_engine():
    """SQLAlchemy engine — used by pandas.read_sql()."""
    from sqlalchemy import create_engine
    url = (
        f"mysql+mysqlconnector://{DB_USER}:{quote_plus(DB_PASS)}"
        f"@{DB_HOST}/{DB_NAME}"
    )
    return create_engine(url, pool_pre_ping=True)

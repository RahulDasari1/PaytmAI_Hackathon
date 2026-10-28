import sqlite3
from typing import Generator
from backend.config import DB_PATH

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Transactions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        transaction_id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        payment_method TEXT NOT NULL,
        customer_id TEXT NOT NULL,
        status TEXT NOT NULL
    );
    """)

    # Create indexes for speed on analytical queries
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_txn_timestamp ON transactions(timestamp);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_txn_category ON transactions(category);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_txn_customer ON transactions(customer_id);")

    # Inventory table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS inventory (
        sku TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        current_stock INTEGER NOT NULL,
        unit_cost REAL NOT NULL,
        unit_price REAL NOT NULL,
        min_threshold INTEGER NOT NULL,
        suggested_reorder_qty INTEGER NOT NULL,
        supplier_name TEXT NOT NULL,
        last_reordered_at TEXT
    );
    """)

    # Campaigns table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        objective TEXT NOT NULL,
        audience_segment TEXT NOT NULL,
        offer_type TEXT NOT NULL,
        channel TEXT NOT NULL,
        language TEXT NOT NULL,
        message_copy TEXT NOT NULL,
        offer_details TEXT NOT NULL,
        suggested_timing TEXT NOT NULL,
        rationale TEXT NOT NULL,
        status TEXT NOT NULL,
        target_customer_count INTEGER NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    # Chat history table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        tools_used TEXT,
        tool_data TEXT,
        timestamp TEXT NOT NULL,
        language TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()

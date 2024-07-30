import psycopg2
import os

def test_db_connection():
    try:
        conn = psycopg2.connect(
            dbname=os.environ.get('POSTGRES_NAME', 'pusheenDB'),
            user=os.environ.get('POSTGRES_USER', 'arincon'),
            password=os.environ.get('POSTGRES_PASSWORD', '123'),
            host=os.environ.get('POSTGRES_HOST', 'db'),
            port=os.environ.get('POSTGRES_PORT', '5432')
        )
        print("Connection successful")
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_db_connection()

import psycopg2
conn = psycopg2.connect(dbname='edgenie_db', user='edgenie_user_new', password='your_premium_user@32', host='localhost')
conn.autocommit = True
cur = conn.cursor()
cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public'")
tables = cur.fetchall()
for t in tables:
    cur.execute(f"DROP TABLE IF EXISTS \"{t[0]}\" CASCADE")
print("All tables dropped")

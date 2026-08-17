#"postgresql://me:Sd8bCKRyrG7FunLO2YIpH5IihuoCmVyW@dpg-d5enrju3jp1c73a1kff0-a.frankfurt-postgres.render.com/survey_db_5r09"

"""Very important: what NOT to break now

Please don’t:

Change DB credentials randomly

Rename tables without migrating

Remove CREATE TABLE IF NOT EXISTS from backend

Hardcode localhost anywhere again 😄"""

import psycopg2

DATABASE_URL = "postgresql://me:Sd8bCKRyrG7FunLO2YIpH5IihuoCmVyW@dpg-d5enrju3jp1c73a1kff0-a.frankfurt-postgres.render.com/survey_db_5r09"


def main():
    print("🔌 Connecting to PostgreSQL...\n")

    conn = psycopg2.connect(
        DATABASE_URL,
        sslmode="require"
    )
    cur = conn.cursor()

    # 1️⃣ Count rows
    cur.execute("SELECT COUNT(*) FROM public.surveys;")
    count = cur.fetchone()[0]
    print(f"📊 Total rows in public.surveys: {count}\n")

    # 2️⃣ Show latest rows
    cur.execute("""
        SELECT id, text, created_at
        FROM public.surveys
        ORDER BY created_at DESC
        LIMIT 10;
    """)
    rows = cur.fetchall()

    if not rows:
        print("⚠️ No rows found.")
    else:
        print("📝 Latest survey entries:\n")
        for row in rows:
            print(f"ID: {row[0]}")
            print(f"Text: {row[1]}")
            print(f"Time: {row[2]}")
            print("-" * 40)

    cur.close()
    conn.close()
    print("\n✅ Done.")

if __name__ == "__main__":
    main()

#!/bin/bash
# To'liq test: vaqtinchalik Postgres → sxema → emulyator + statik + admin serverlar → DB/ilova/admin testlari.
# Talab: PostgreSQL 16 (initdb/pg_ctl), Node 20+, Chromium (npx playwright install chromium).
set -u
cd "$(dirname "$0")"
HERE=$(pwd)
ZONA=$(cd ../.. && pwd)
ADMIN_DIR=${ADMIN_DIR:-$(cd "$ZONA/../Zona-Admin" 2>/dev/null && pwd)}
PG_BIN=${PG_BIN:-$(pg_config --bindir 2>/dev/null || ls -d /usr/lib/postgresql/*/bin | tail -1)}
PGDATA=${PGDATA_DIR:-/var/tmp/zona-e2e-pg}
PORT=54329
RUN_AS=""; [ "$(id -u)" = 0 ] && RUN_AS="su postgres -c"
pg() { if [ -n "$RUN_AS" ]; then su postgres -c "$*"; else bash -c "$*"; fi; }

[ -d node_modules ] || npm install --silent
rm -rf "$PGDATA"; mkdir -p "$PGDATA"; [ -n "$RUN_AS" ] && chown postgres "$PGDATA"
pg "$PG_BIN/initdb -D $PGDATA/data -U postgres --auth=trust" >/dev/null
pg "setsid $PG_BIN/pg_ctl -D $PGDATA/data -o '-p $PORT -k /tmp' -l $PGDATA/log start" >/dev/null </dev/null
sleep 2
PSQL="psql -h 127.0.0.1 -p $PORT -U postgres -q -v ON_ERROR_STOP=1"
$PSQL -f bootstrap.sql 2>&1 | grep -v -E "WARNING|HINT" || true
$PSQL -f "$ZONA/supabase/schema.sql" 2>&1 | grep -E "ERROR" && exit 1
$PSQL -f "$ZONA/supabase/schema.sql" 2>&1 | grep -E "ERROR" && { echo "schema.sql idempotent emas"; exit 1; }

node mock-supabase.mjs > mock.log 2>&1 & P1=$!
node static-server.mjs "$ZONA" 8000 > static.log 2>&1 & P2=$!
ADMIN_DIR="$ADMIN_DIR" node admin-server.mjs > admin.log 2>&1 & P3=$!
trap 'kill $P1 $P2 $P3 2>/dev/null; pg "$PG_BIN/pg_ctl -D $PGDATA/data stop -m fast" >/dev/null' EXIT
sleep 1.5

FAIL=0
for t in test-db test-app test-admin; do
  echo "== $t"; node $t.mjs || FAIL=1
done
exit $FAIL

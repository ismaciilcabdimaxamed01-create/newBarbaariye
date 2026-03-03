const db = require('./db');

/**
 * handleDynamicRequest() – U waca PostgreSQL stored procedures maraya /api/all
 * 
 * SIDEE UU U SHAQEEYO:
 * 1. Frontend-ka wuxuu soo gudbinayaa POST request adiga oo maraya JSON payload
 * 2. Payload-ka wuxuu leeyahay: fn (function name) + parameters (p_id, p_name_sp, iwm)
 * 3. dynamicController wuxuu u wacaa PostgreSQL function-ka + soo celiyaa result (text/plain)
 * 
 * TALLAABO:
 * - Step 1: Object.entries(req.body) → kala dhig body-ka (key-value pairs)
 * - Step 2: Hubi in body-ku ma aha empty → haddii empty, soo celi 400 error
 * - Step 3: Ka hel firstEntry → procedureName (function-ka Postgres)
 * - Step 4: Ka hel remaining entries → params (parameters-ka function-ka)
 * - Step 5: Hubi procedureName-ka (security validation) → haddii invalid, soo celi 400 error
 * - Step 6: Abuur SQL query → SELECT * FROM procedureName($1, $2, ...)
 * - Step 7: db.query() → u wac PostgreSQL function-ka
 * - Step 8: Soo celi result (first column value) → text/plain
 */
exports.handleDynamicRequest = async (req, res) => {
    let params = [];
    let procedureName = null;
    
    try {
        /**
         * Step 1: Kala dhig xogta codsiga (Parse the request body)
         * 
         * MUHIIM:
         * Frontend-ka hore wuxuu xogta u soo gudbinayay $.post(url, $("#form").serialize())
         * Tani waxay dhalineysaa jir (body) halkaas oo furayaasha iyo qiimayaashu yihiin URL-encoded.
         * Shuruuddu waxay leedahay: "Qiimaha ugu horreeya ee POST had iyo jeer waa magaca habraaca la kaydiyay"
         * "Qiimayaasha kale ee POST waa dooduha (arguments) habraaca"
         */
        const bodyEntries = Object.entries(req.body);

        // Step 2: Hubi in body-ku ma aha empty → haddii empty, soo celi 400 error
        if (bodyEntries.length === 0) {
            return res.status(400).send('Empty request');
        }

        // Step 3: Ka hel firstEntry → procedureName (function-ka Postgres)
        const firstEntry = bodyEntries[0];
        procedureName = firstEntry[1]; // Qiimaha input-ka hore (The value of the first field)

        // Step 4: Ka hel remaining entries → params (parameters-ka function-ka)
        // Qiimayaasha haray waa dooduha (The remaining entries are arguments)
        params = bodyEntries.slice(1).map(entry => entry[1]);

        /**
         * Step 5: Hubinta Amniga (Security Validation)
         * 
         * TALLAABO:
         * 1. Xaqiiji procedureName si loo hubiyo inuu yahay aqoonsi sax ah loona hortago duritaanka SQL (SQL injection)
         * 2. Kaliya oggolow xarfo (a-zA-Z), tirooyin (0-9), iyo hoos-u-calaamad (_)
         * 3. Haddii invalid → soo celi 400 error
         */
        if (!/^[a-zA-Z0-9_]+$/.test(procedureName)) {
            console.warn(`Invalid procedure name attempt: ${procedureName}`);
            return res.status(400).send('Invalid function name');
        }

        /**
         * Step 6: Dhis Weydiinta SQL (Construct the SQL Query)
         * 
         * TALLAABO:
         * 1. Abuur paramPlaceholders → $1, $2, $3, ... (si loo ilaaliyo SQL injection)
         * 2. Abuur query → SELECT * FROM procedureName($1, $2, ...)
         * 
         * MUHIIM: Waxaan isticmaaleynaa weydiin leh xuduudo (parameterized query)
         *         Ma isku xireyno (concatenate) qiimayaasha. Kaliya waxaan galineynaa magaca habraaca la xaqiijiyay.
         */
        const paramPlaceholders = params.map((_, index) => `$${index + 1}`).join(', ');
        const query = `SELECT * FROM ${procedureName}(${paramPlaceholders})`;

        // Cilad-baaris (Debug): Tus habka si loo arko qaladka
        console.log(`[DEBUG] Waxaa la fulinayaa: SELECT * FROM ${procedureName}('${params.join("', '")}');`);

        /**
         * Step 7: Fuli Weydiinta (Execute Query)
         * 
         * TALLAABO:
         * 1. db.query(query, params) → u wac PostgreSQL function-ka
         * 2. Ka hel result (rows array)
         */
        const result = await db.query(query, params);

        /**
         * Step 8: Qaabaynta Jawaabta (Format Response)
         * 
         * MUHIIM:
         * Hab-dhaqankii hore: "Backend-ku wuxuu soo celinayaa oo kaliya tiirka hore ee safka hore ee soo laabtay"
         * "Frontend-ku wuxuu sugayaa jawaab qoraal cad ah (plain text), ee ma aha JSON"
         * 
         * TALLAABO:
         * 1. Haddii result.rows.length > 0 → ka hel firstRow + firstColumnValue
         * 2. res.set('Content-Type', 'text/plain') → u sheeg browser-ka in response-ku yahay text
         * 3. res.send(String(firstColumnValue)) → soo celi first column value (text)
         * 4. Haddii ma jiro result → soo celi empty string ('')
         */
        if (result.rows.length > 0) {
            // Qaado safka hore (Get the first row)
            const firstRow = result.rows[0];
            // Qaado qiimaha tiirka hore (Getting first column's value)
            const firstColumnValue = Object.values(firstRow)[0];

            // U soo dir sidii qoraal cad (Send as plain text)
            res.set('Content-Type', 'text/plain');
            res.send(String(firstColumnValue));
        } else {
            // Haddii aysan jirin wax natiijo ah (Handle case with no result)
            res.send('');
        }

    } catch (error) {
        console.error('Qalad Fulinta Xogta (Database Execution Error):', error);
        // Production: ha ku tusin client-ka weydiinta iyo params (amniga)
        const isProduction = process.env.NODE_ENV === 'production';
        if (isProduction) {
            res.status(500).send('Qalad nidaamka');
        } else {
            const paramPlaceholders = params && params.length > 0 ? params.map((_, index) => `$${index + 1}`).join(', ') : '';
            const query = `SELECT * FROM ${procedureName || 'LAMA YAQAAN'}${paramPlaceholders ? `(${paramPlaceholders})` : '()'}`;
            res.status(500).send(`Qalad Nidaamka: ${error.message}\nWeydiinta: ${query}\nXuduudaha: ${JSON.stringify(params)}`);
        }
    }
};

/** Xogta SELECT: amniga. */
const FORBIDDEN = ['DELETE', 'DROP', 'UPDATE', 'TRUNCATE', 'INSERT', 'ALTER', 'CREATE'];

/** Run SELECT query (api/showdata) */
exports.runSelectQuery = async (query) => {
  const q = (query || '').trim().toUpperCase();
  if (!q.startsWith('SELECT')) throw new Error('Only SELECT allowed');
  const bad = FORBIDDEN.find((w) => q.includes(w));
  if (bad) throw new Error(`Forbidden: ${bad}`);
  const result = await db.query(query);
  return result.rows || [];
};

/** Run SELECT with pagination (api/data) – returns { columns, data, total }. Optional search: ILIKE on all columns. */
exports.runSelectQueryPaginated = async (query, page = 1, limit = 10, search = '') => {
  const q = (query || '').trim().toUpperCase();
  if (!q.startsWith('SELECT')) throw new Error('Only SELECT allowed');
  const bad = FORBIDDEN.find((w) => q.includes(w));
  if (bad) throw new Error(`Forbidden: ${bad}`);
  const searchTerm = (search ?? '').toString().trim();
  const hasSearch = searchTerm.length > 0;
  const offset = (page - 1) * limit;

  let total, rows;
  if (hasSearch) {
    const searchParam = '%' + searchTerm + '%';
    const whereClause = `EXISTS (
      SELECT 1 FROM jsonb_each_text(to_jsonb(_t)) AS j(k, v)
      WHERE v ILIKE $1
    )`;
    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total FROM (${query}) AS _t WHERE ${whereClause}`,
      [searchParam]
    );
    total = countResult.rows[0]?.total ?? 0;
    const result = await db.query(
      `SELECT * FROM (${query}) AS _t WHERE ${whereClause} LIMIT $2 OFFSET $3`,
      [searchParam, limit, offset]
    );
    rows = result.rows || [];
  } else {
    const countResult = await db.query(`SELECT COUNT(*)::int AS total FROM (${query}) AS _ct`);
    total = countResult.rows[0]?.total ?? 0;
    const result = await db.query(`SELECT * FROM (${query}) AS _paged LIMIT $1 OFFSET $2`, [limit, offset]);
    rows = result.rows || [];
  }
  const columns = rows[0]
    ? Object.keys(rows[0]).map((key) => ({
        key,
        label: key.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
      }))
    : [];
  return { columns, data: rows, total };
};

/** POST /api/stream – row-by-row JSON (xogta badan) – sql waa la gudbiyay api.js (queries whitelist) */
const QueryStream = require('pg-query-stream');
exports.handleStreamRequest = async (req, res, sql) => {
  const client = await db.pool.connect();
  try {
    const stream = client.query(new QueryStream(sql));
    res.setHeader('Content-Type', 'application/json');
    let isFirst = true;
    res.write('[');
    stream.on('data', (row) => {
      if (!isFirst) res.write(',');
      res.write(JSON.stringify(row));
      isFirst = false;
    });
    stream.on('end', () => {
      res.write(']');
      res.end();
      client.release();
    });
    stream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) res.status(500).json({ error: err.message });
      client.release();
    });
  } catch (err) {
    console.error('Stream setup:', err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
    client.release();
  }
};


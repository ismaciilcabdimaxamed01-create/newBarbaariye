/**
 * API Config – POST /api/showdata (fetch), POST /api/all (insert/update/delete)
 */
const dynamicController = require('./dynamicController');
const { getQuery } = require('./queries');

function formatColumnLabel(name) {
  return name.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function rowsToColumnsData(rows) {
  const columns = rows[0]
    ? Object.keys(rows[0]).map((key) => ({ key, label: formatColumnLabel(key) }))
    : [];
  return { columns, data: rows };
}

function registerApiRoutes(app) {
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Barbaariye API is running' });
  });

  /** POST /api/data – { queryName, page?, limit?, search? } → { columns, data, pagination } */
  async function handleDataRequest(req, res) {
    try {
      const body = req.body || {};
      const queryName = (body.queryName || body.query || '').toString().trim();
      const page = Math.max(1, parseInt(body.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(body.limit, 10) || 10));
      const search = (body.search ?? body.q ?? '').toString().trim();
      if (search && process.env.NODE_ENV !== 'production') {
        console.log('[api/data] search:', JSON.stringify(search));
      }
      const sql = getQuery(queryName || 'accounts');
      if (!sql) return res.status(404).json({ error: 'Query not allowed or not found' });
      const { columns, data: rows, total } = await dynamicController.runSelectQueryPaginated(sql, page, limit, search);
      res.json({
        columns,
        data: rows,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message || 'Query failed' });
    }
  }

  app.post('/api/data', handleDataRequest);
  app.post('/api/showdata', (req, res) =>
    handleDataRequest(
      { ...req, body: { ...req.body, page: req.body?.page ?? 1, limit: req.body?.limit ?? 100 } },
      res
    )
  );

  /** POST /api/stream – { queryName } → streaming JSON array (xogta badan 1M+ rows) */
  app.post('/api/stream', (req, res) => {
    const queryName = (req.body?.queryName || req.body?.query || '').trim();
    const sql = getQuery(queryName || 'accounts');
    if (!sql) return res.status(404).json({ error: 'Query not allowed or not found' });
    dynamicController.handleStreamRequest(req, res, sql);
  });
}

module.exports = { registerApiRoutes };

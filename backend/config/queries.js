/**
 * API Queries Config - Whitelist of allowed queries
 * Key waa magac aad doorato (ma aha table name oo kaliya). Ku dar key + SQL aad rabto.
 */
const QUERIES = {
  accounts: 'SELECT * FROM accounts ORDER BY acc_id',
  gendersections: 'SELECT * FROM accounts ORDER BY acc_id',
  subjects: 'SELECT * FROM accounts ORDER BY acc_id',
  students: 'SELECT * FROM students ORDER BY student_id',
  vw_contacts: 'SELECT * FROM vw_contacts',
  contacts: 'SELECT * FROM vw_contacts',
  student_classes: 'SELECT * FROM student_classes ORDER BY student_class_id',
  studentsubjects: 'SELECT * FROM studentsubjects ORDER BY studentsubject_id',
  studentacademicyears: 'SELECT * FROM studentacademicyears ORDER BY studentacademicyear_id',
  student_info: 'SELECT * FROM students ORDER BY student_id',
  people_info: 'SELECT * FROM people ORDER BY people_id',
};

const DEFAULT_QUERY = 'accounts';

/** Returns SQL for name, or null if not whitelisted (security: no fallback). */
function getQuery(name) {
  const key = (name || '').trim().toLowerCase();
  return  QUERIES[key]  ;
}

function getAvailableQueries() {
  return Object.entries(QUERIES).map(([id]) => ({
    id,
    label: id.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  }));
}

module.exports = { getQuery, getAvailableQueries, QUERIES };

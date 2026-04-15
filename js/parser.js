// Parses combined_workout_log.txt into structured JS objects.
// Every source line has a `   NNN | ` prefix that we strip first.
// The log evolves over time and has occasional typos; the parser is defensive
// and returns best-effort data without throwing on malformed rows.

const LINE_PREFIX = /^\s*\d+\s*\|\s?/;

function stripPrefix(line) {
  return line.replace(LINE_PREFIX, '');
}

function toISO(mdYStr) {
  // Accepts "M/D/YYYY" or "MM/DD/YYYY" or "MM/DD/YY".
  const m = mdYStr.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return null;
  let [, mo, d, y] = m;
  if (y.length === 2) y = (parseInt(y, 10) >= 70 ? '19' : '20') + y;
  return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

function parseBodyWeight(lines) {
  const out = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^\d{4}$/.test(line)) continue; // year header like "2023"
    // "M/D/YYYY, NNN.N lbs[, notes]"
    const m = line.match(/^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d+(?:\.\d+)?)\s*lbs(?:[,\s]+(.+))?$/i);
    if (!m) continue;
    const iso = toISO(m[1]);
    if (!iso) continue;
    out.push({ date: iso, weight: parseFloat(m[2]), note: (m[3] || '').trim() || null });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

function parseSessionIndex(lines) {
  const out = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^\d{4}$/.test(line)) continue;
    // "MM/DD/YYYY: GroupA, GroupB [@ Gym][, est. volume = N,NNN]"
    const m = line.match(/^(\d{1,2}\/\d{1,2}\/\d{2,4}):\s*(.+)$/);
    if (!m) continue;
    const iso = toISO(m[1]);
    if (!iso) continue;
    let rest = m[2].trim();

    let estVolume = null;
    const est = rest.match(/,?\s*est\.?\s*volume\s*=\s*([\d,]+)/i);
    if (est) {
      estVolume = parseInt(est[1].replace(/,/g, ''), 10);
      rest = rest.replace(est[0], '').trim();
    }

    let gym = null;
    const atIdx = rest.lastIndexOf('@');
    if (atIdx >= 0) {
      gym = rest.slice(atIdx + 1).trim().replace(/,+$/, '').trim();
      rest = rest.slice(0, atIdx).trim().replace(/,+$/, '').trim();
    }

    const muscleGroups = rest.split(',').map((s) => s.trim()).filter(Boolean);
    out.push({ date: iso, muscleGroups, gym, estVolume });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

function parseChronological(lines) {
  // Scans the full document for chronological session blocks. The chronological
  // section has no explicit header; merged-log entries don't have indented
  // exercise lines beneath them, so we filter to sessions with >=1 exercise.
  // Sessions look like:
  //   MM/DD/YYYY, volume = NN,NNN
  //     Exercise Name: set notation = total
  //     ...
  const sessions = [];
  let current = null;
  const flush = () => { if (current && current.exercises.length) sessions.push(current); current = null; };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    const trimmed = line.trim();
    if (!trimmed) { flush(); continue; }
    if (/^[A-Za-z]+\s+\d{4}$/.test(trimmed)) continue; // "October 2023"

    const dateMatch = trimmed.match(/^(\d{1,2}\/\d{1,2}\/\d{2,4})(?:,\s*volume\s*=\s*([\d,]+))?\s*$/i);
    if (dateMatch) {
      flush();
      const iso = toISO(dateMatch[1]);
      if (!iso) { current = null; continue; }
      current = {
        date: iso,
        volume: dateMatch[2] ? parseInt(dateMatch[2].replace(/,/g, ''), 10) : null,
        exercises: []
      };
      continue;
    }

    if (current && line.startsWith(' ')) {
      const ex = trimmed.match(/^([^:]+):\s*(.+)$/);
      if (!ex) continue;
      const name = ex[1].trim();
      const body = ex[2].trim();
      let total = null;
      let sets = body;
      const eq = body.lastIndexOf('=');
      if (eq >= 0) {
        const maybeTotal = body.slice(eq + 1).trim().replace(/,/g, '');
        if (/^\d+$/.test(maybeTotal)) {
          total = parseInt(maybeTotal, 10);
          sets = body.slice(0, eq).trim();
        }
      }
      current.exercises.push({ name, sets, total });
    }
  }
  flush();
  return sessions.sort((a, b) => a.date.localeCompare(b.date));
}

function parseAnnualSummary(lines) {
  // Rows: "YYYY  Total  Weights  Martial  Yoga/Pil  Cardio  Qigong  Volume  Avg/Sess"
  const out = [];
  for (const raw of lines) {
    const line = raw.trim();
    const m = line.match(/^(\d{4})\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,]+)(?:\s+([\d,]+))?\s*$/);
    if (!m) continue;
    out.push({
      year: parseInt(m[1], 10),
      total: parseInt(m[2], 10),
      weights: parseInt(m[3], 10),
      martial: parseInt(m[4], 10),
      yoga: parseInt(m[5], 10),
      cardio: parseInt(m[6], 10),
      qigong: parseInt(m[7], 10),
      volume: parseInt(m[8].replace(/,/g, ''), 10),
      avgPerSession: m[9] ? parseInt(m[9].replace(/,/g, ''), 10) : null
    });
  }
  return out;
}

function parseMonthlySummary(lines) {
  // Rows: "Mon YYYY  Total  Weights  Martial  Yoga  Cardio  Qigong  Volume"
  const out = [];
  for (const raw of lines) {
    const line = raw.trim();
    const m = line.match(/^([A-Za-z]{3})\s+(\d{4})\s+(\d+)\s+(\d+)(?:\s+(\d+))?(?:\s+(\d+))?(?:\s+(\d+))?(?:\s+(\d+))?(?:\s+([\d,]+))?\s*$/);
    if (!m) continue;
    out.push({
      month: m[1],
      year: parseInt(m[2], 10),
      total: parseInt(m[3], 10),
      weights: parseInt(m[4], 10),
      martial: m[5] ? parseInt(m[5], 10) : 0,
      yoga: m[6] ? parseInt(m[6], 10) : 0,
      cardio: m[7] ? parseInt(m[7], 10) : 0,
      qigong: m[8] ? parseInt(m[8], 10) : 0,
      volume: m[9] ? parseInt(m[9].replace(/,/g, ''), 10) : 0
    });
  }
  return out;
}

function extractSection(strippedLines, startHeader, endMarkers) {
  // Returns the lines between a header line containing `startHeader`
  // and the next line matching any of the endMarkers.
  const out = [];
  let inSection = false;
  for (let i = 0; i < strippedLines.length; i++) {
    const line = strippedLines[i];
    if (!inSection) {
      if (line.trim().toUpperCase() === startHeader.toUpperCase()) {
        inSection = true;
        continue;
      }
    } else {
      if (endMarkers.some((m) => line.trim().toUpperCase() === m.toUpperCase())) break;
      out.push(line);
    }
  }
  return out;
}

export function parseLog(rawText) {
  const lines = rawText.split(/\r?\n/).map(stripPrefix);

  const END_MARKERS = [
    'ANNUAL SUMMARY', 'QUARTERLY SUMMARY', 'MONTHLY SUMMARY', 'WEEKLY SUMMARY',
    'BODY WEIGHT TRACKING', 'SESSION INDEX', 'MERGED EXERCISE LOG',
    'MERGED EXERCISE LOG (All Parts Combined)',
    'CHRONOLOGICAL EXERCISE LOG', 'CHRONOLOGICAL EXERCISE LOG (by Date)',
    'EXERCISE STATISTICS & EST. 1RM', 'EXECUTIVE SUMMARY', 'NOTATION KEY', 'TABLE OF CONTENTS'
  ];

  const annualLines = extractSection(lines, 'ANNUAL SUMMARY', END_MARKERS);
  const monthlyLines = extractSection(lines, 'MONTHLY SUMMARY', END_MARKERS);
  const bodyWeightLines = extractSection(lines, 'BODY WEIGHT TRACKING', END_MARKERS);
  const sessionIndexLines = extractSection(lines, 'SESSION INDEX', END_MARKERS);

  // Chronological log has no explicit header in this file; scan the whole doc.
  const annual = parseAnnualSummary(annualLines);
  const monthly = parseMonthlySummary(monthlyLines);
  const bodyWeight = parseBodyWeight(bodyWeightLines);
  const sessionIndex = parseSessionIndex(sessionIndexLines);
  const chronological = parseChronological(lines);

  // Derived totals from annual summary's Total row (or sum of years).
  const totalSessions = annual.reduce((s, y) => s + y.total, 0);
  const totalVolume = annual.reduce((s, y) => s + y.volume, 0);

  // 135-at-bench progress: max single-set reps at exactly 135 lbs on Bench Press.
  let bench135Max = 0;
  let bench135Date = null;
  for (const session of chronological) {
    for (const ex of session.exercises) {
      if (ex.name.trim() !== 'Bench Press') continue;
      // Look for 135x NN (not 135.5, not 1350) in the set notation.
      const re = /(?<![\d.])135\s*[xX]\s*(\d+)(?![\d.])/g;
      let m;
      while ((m = re.exec(ex.sets)) !== null) {
        const reps = parseInt(m[1], 10);
        if (reps > bench135Max) {
          bench135Max = reps;
          bench135Date = session.date;
        }
      }
    }
  }

  // Unique exercises (from chronological).
  const exerciseIndex = new Map();
  for (const session of chronological) {
    for (const ex of session.exercises) {
      const key = ex.name.trim();
      if (!exerciseIndex.has(key)) {
        exerciseIndex.set(key, { name: key, entries: 0, totalVolume: 0, lastDate: null });
      }
      const item = exerciseIndex.get(key);
      item.entries += 1;
      if (ex.total) item.totalVolume += ex.total;
      if (!item.lastDate || session.date > item.lastDate) item.lastDate = session.date;
    }
  }
  const exercises = Array.from(exerciseIndex.values())
    .sort((a, b) => b.totalVolume - a.totalVolume);

  return {
    annual,
    monthly,
    bodyWeight,
    sessionIndex,
    chronological,
    exercises,
    totals: { sessions: totalSessions, volume: totalVolume },
    bench135: { maxReps: bench135Max, date: bench135Date, goal: 100 }
  };
}

export async function loadParsedLog(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching log`);
  const text = await res.text();
  return parseLog(text);
}

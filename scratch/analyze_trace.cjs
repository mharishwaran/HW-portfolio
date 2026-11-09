const fs = require('fs');
const path = require('path');

const tracePath = path.join(__dirname, 'trace_transition1.json');
const content = fs.readFileSync(tracePath, 'utf8');

// Trace could be JSON Lines or JSON object
let events = [];
try {
  const parsed = JSON.parse(content);
  events = parsed.traceEvents || parsed;
} catch (e) {
  events = content.split('\n').filter(Boolean).map(line => {
    try { return JSON.parse(line); } catch (e) { return null; }
  }).filter(Boolean);
}

console.log(`Loaded ${events.length} trace events.`);

// Look for events between 5200ms and 6200ms (where the long tasks happened)
// Trace timestamps (ts) are usually in microseconds (divide by 1000 for ms)
const startTs = events.find(e => e.name === 'navigationStart' || e.name === 'firstPaint')?.ts || (events[0]?.ts || 0);

// Find top duration events
const topEvents = events
  .filter(e => e.dur && e.dur > 5000) // > 5ms
  .sort((a, b) => b.dur - a.dur)
  .slice(0, 30);

console.log('\nTop 30 longest trace events:');
for (const ev of topEvents) {
  console.log(`- ${ev.name} (${(ev.dur / 1000).toFixed(1)}ms) [cat: ${ev.cat}]`);
  if (ev.args && ev.args.data) {
    console.log('   args:', JSON.stringify(ev.args.data).slice(0, 150));
  }
}

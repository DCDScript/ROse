const https = require('https');

// REPLACE WITH YOUR REAL VALUES
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1547685091298254929/oS3WqejHn6OL7gBK6ar01Xts4tsgmWpvReXDew_592AuPUJfaJHeVxqGPKUluoWyt_VF';
const RSC_API_KEY = 'rsc_live_MPDb5TC8atDu_Zh2hBi4HFKZz9XSprXE';

const TARGET_URL = 'https://api.rscripts.net/v1/analytics/ingame?period=30d';

function fetchData() {
  return new Promise((resolve, reject) => {
    const url = new URL(TARGET_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + RSC_API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'DecodeHubScript/1.0',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data, error: 'Not JSON' });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function sendDiscord(text) {
  return new Promise((resolve, reject) => {
    const url = new URL(DISCORD_WEBHOOK);
    const payload = JSON.stringify({ content: text });

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'DecodeHubScript/1.0',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  try {
    const response = await fetchData();

    // Extract from new API format: data.totals.*
    const totals = response?.data?.totals ?? {};
    let stats = {
      runs: totals.runs ?? 0,
      uniquePlayers: totals.uniquePlayers ?? 0,
      avgSessionMinutes: totals.avgSessionMinutes ?? 0,
      liveNow: totals.liveNow ?? 0,
    };

    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZoneName: 'short'
    });

    // Design without emojis - using box characters
    const message = `╔════════════════════════════════════════╗
║         DECODE HUB SCRIPT TRACKER        ║
╠════════════════════════════════════════╣
║  TOTAL EXECUTIONS : ${String(stats.runs).padEnd(14)} ║
║  UNIQUE USERS     : ${String(stats.uniquePlayers).padEnd(14)} ║
║  AVG SESSION      : ${String(stats.avgSessionMinutes + ' mins').padEnd(14)} ║
║  LIVE USERS       : ${String(stats.liveNow).padEnd(14)} ║
╠════════════════════════════════════════╣
║  UPDATED          : now (${timeString}) ║
╚════════════════════════════════════════╝`;

    console.log('Sending to Discord:', message);
    const result = await sendDiscord(message);
    console.log('Discord response:', result.status, result.body);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();


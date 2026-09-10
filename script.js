const https = require('https');

// REPLACE WITH YOUR REAL VALUES
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1547685091298254929/oS3WqejHn6OL7gBK6ar01Xts4tsgmWpvReXDew_592AuPUJfaJHeVxqGPKUluoWyt_VF';
const RSC_API_KEY = 'rsc_live_MPDb5TC8atDu_Zh2hBi4HFKZz9XSprXE';
const MESSAGE_ID = '1547685839671136256';

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

function updateDiscord(text) {
  return new Promise((resolve, reject) => {
    const webhookUrl = new URL(DISCORD_WEBHOOK);
    const patchPath = webhookUrl.pathname.replace(/\/$/, '') + '/messages/' + MESSAGE_ID;

    const payload = JSON.stringify({ content: text });
    const options = {
      hostname: webhookUrl.hostname,
      path: patchPath,
      method: 'PATCH',
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

    const totals = response?.data?.totals ?? {};
    let stats = {
      runs: totals.runs ?? 0,
      uniquePlayers: totals.uniquePlayers ?? 0,
      avgSessionMinutes: totals.avgSessionMinutes ?? 0,
      liveNow: totals.liveNow ?? 0,
    };

    const unixTime = Math.floor(Date.now() / 1000);

    // Bullet design, no emojis, Discord auto-timezone timestamp
    const message = `• Total Executions: ${stats.runs}
• Unique Users: ${stats.uniquePlayers}
• Average Session: ${stats.avgSessionMinutes} mins
• Live Users: ${stats.liveNow}
Updated: <t:${unixTime}:R>`;

    console.log('Updating Discord message:', MESSAGE_ID);
    const result = await updateDiscord(message);
    console.log('Discord response:', result.status, result.body);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();

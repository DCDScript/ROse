const https = require('https');

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const RSC_API_KEY = process.env.RSC_API_KEY;
const MESSAGE_ID = '1547701512522956892';

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

function updateDiscord(payload) {
  return new Promise((resolve, reject) => {
    const webhookUrl = new URL(DISCORD_WEBHOOK);
    const patchPath = webhookUrl.pathname.replace(/\/$/, '') + '/messages/' + MESSAGE_ID;

    const body = typeof payload === 'string' ? JSON.stringify({ content: payload }) : JSON.stringify(payload);
    const options = {
      hostname: webhookUrl.hostname,
      path: patchPath,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': 'DecodeHubScript/1.0',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });

    req.on('error', reject);
    req.write(body);
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
    const embedPayload = {
      embeds: [
        {
          title: "Script Stats",
          color: 0x5865f2,
          fields: [
            { name: "Total Executions", value: String(stats.runs), inline: true },
            { name: "Unique Users", value: String(stats.uniquePlayers), inline: true },
            { name: "Average Session", value: `${stats.avgSessionMinutes} mins`, inline: true },
            { name: "Live Users", value: String(stats.liveNow), inline: true },
          ],
          footer: { text: `Updated: <t:${unixTime}:R>` },
        },
      ],
    };

    console.log('Updating Discord message:', MESSAGE_ID);
    const result = await updateDiscord(embedPayload);
    console.log('Discord response:', result.status, result.body);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();

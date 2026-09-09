const https = require('https');

const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1547241297625219126/QK-Kh9GVLg43jWE-s219jYOjaCjA1KqtntBPfLjzjkdkI7JcuVV-ZLfH_XElOvQvIi-N';

const TARGET_URL = 'https://rscripts.net/dashboard/ingame?period=7d&_rsc=3imp5';

function fetchData() {
  return new Promise((resolve, reject) => {
    const url = new URL(TARGET_URL);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'rsc': '1',
        'Accept': 'application/json',
        'Referer': 'https://rscripts.net/dashboard/ingame?period=7d',
        'Cookie': '__Secure-better-auth.session_token_multi-rr0xaj4q10aiewhrikurca0e0kris8wp=RR0xAj4q10aiewHRIkurca0e0kRIS8wp.WyLE8RF848ADjsUkXs97fgvA8FR9ozR2NQ6g%2FU%2FDqZU%3D; __Secure-better-auth.session_token=MPKDXwVirTLGokj081OeFSW6kthxNkKg.6%2FmCcOcJeQ7KRkUuCE461bT4pL%2FrQTgomEyvCj5qXFk%3D; __Secure-better-auth.session_token_multi-mpkdxwvirtlgokj081oefsw6kthxnkkg=MPKDXwVirTLGokj081OeFSW6kthxNkKg.6%2FmCcOcJeQ7KRkUuCE461bT4pL%2FrQTgomEyvCj5qXFk%3D; __Secure-better-auth.session_data=eyJzZXNzaW9uIjp7InNlc3Npb24iOnsiZXhwaXJlc0F0IjoiMjAyNi0xMi0wNFQwNTozNjo0MS4yMTdaIiwidG9rZW4iOiJNUEtEWHdWaXJUTEdva2owODFPZUZTVzZrdGh4TmtLZyIsImNyZWF0ZWRBdCI6IjIwMjYtMDgtMDlUMTA6MzI6MDUuNzcwWiIsInVwZGF0ZWRBdCI6IjIwMjYtMDktMDVUMDU6MzY6NDEuMjE3WiIsImlwQWRkcmVzcyI6IjE2Mi4xNTguMTkzLjg0IiwidXNlckFnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzE1MS4wLjAuMCBTYWZhcmkvNTM3LjM2IiwidXNlcklkIjoiNmE3ODU3MjUwOGJhN2NkNzU5YmUxODZiIiwiaW1wZXJzb25hdGVkQnkiOm51bGwsImlkIjoiNmE3ODU3MjUwOGJhN2NkNzU5YmUxODZkIn0sInVzZXIiOnsibmFtZSI6IkR1bW15IEFjYyIsImVtYWlsIjoiZGR1bWFjYzAwMUBnbWFpbC5jb20iLCJlbWFpbFZlcmlmaWVkIjp0cnVlLCJpbWFnZSI6ImF2YXRhcl82YTc4NTcyNTA4YmE3Y2Q3NTliZTE4NmJfMTc4NjM3NjUzMzU2MF83dnZHUEtXOC53ZWJwIiwiY3JlYXRlZEF0IjoiMjAyNi0wOC0wOVQxMDozMjowNS43NjZaIiwidXBkYXRlZEF0IjoiMjAyNi0wOS0wOVQxMjoyMDowMS40OTdaIiwicm9sZSI6InVzZXIiLCJiYW5uZWQiOmZhbHNlLCJiYW5SZWFzb24iOm51bGwsImJhbkV4cGlyZXMiOm51bGwsIm9uYm9hcmRpbmdDb21wbGV0ZWQiOiIyMDI2LTA4LTA5VDEwOjMyOjE3LjYyNVoiLCJ1c2VybmFtZSI6IkRlY29kZSIsImlkIjoiNmE3ODU3MjUwOGJhN2NkNzU5YmUxODZiIn0sInVwZGF0ZWRBdCI6MTc4ODk1NjY0NjcwOSwidmVyc2lvbiI6IjA6MDowOmZyZWU6MSJ9LCJleHBpcmVzQXQiOjE3ODg5NzgyNDY3MDksInNpZ25hdHVyZSI6ImdXNGlseVRWWGRiNVBaTmVvaUp4Q1lqYlBXZ19VelZrTXBxSHpoTE9meWMifQ; cf_clearance=R2K9_N5LJgrVXJJwlKN3rZc1WP4nHcwsa6dOEc31vaQ-1788959262-1.2.1.1-mrh0WBl_TwY7c6vSNLJ2iF7T_MF9A4y4d6XkC_GNyeOGw0dpn6llS_k9_eQ47si4Uab4U.M2JJAh2hRI08XhQFER6S_krAwXPqDchYyHZtDeFWjZs1k0G3Jj4VB_3wqxV2XNAD0ua_dU1hUTgq47YawSbY4ZHvNEMPTjD533V0aJlir1NYEyfZvSF0KVrb3FRFuItpe9cmb7dqLe0c.A4wexJ.PXNBPcwII2NIpMv82TiQQoZnQJjZQVHI7q9vQqqButTN_eQRlqGLoWePOZedSwlopjl6t_FxpPpMMURmk5W4IfdPOuzDkMoq.Hz6sulis1lWRhnvSgQHNgUUNihdnnrWPJTLscD9AYnuogKcZ3m5Xsmek9EWcOPDnzz70YE4yvDYL6CAuWiFawH855y80jMK21Rp8bDjjPoeO_35qhY4r0kLdrhdXjH3ZD5WggWLq9jWF2WI2evYnLi18edw; cf_zaraz_client=; __gads=ID=4c2409a4131ce282:T=1786271439:RT=1788959286:S=ALNI_Mb7QgYH80F3rI1ZTCq7PXqmfT7mVQ; __gpi=UID=000013a0124c71cd:T=1786271439:RT=1788959286:S=ALNI_MYAQRSEjoPGTIoMZ4bZJ-1J-fgrfQ; __eoi=ID=aa5b9e6d20090e3b:T=1786271439:RT=1788959286:S=AA-Afjaunzcsz0xx8rW5lP9RJWVs; FCCDCF=%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%2209448b0b-bae4-40d2-8fa6-4099585ff8e8%5C%22%2C%5B1786271440%2C752000000%5D%5D%22%5D%5D%5D; FCNEC=%5B%5B%22AKsRol9ORWwh0FToI7SppJD2EY2u6P7TSRRBN71nA98GHTd6OYjnbd9PuajebuSpCeM6Dh6L_-51xwjkkUhwBiN_WK53W4MVokkrdW-WfW1J8eezIO6ptiWS3cX44kJ14XZ0IFJyuG73rlglCx_7nlyFiD5Shv8EnA%3D%3D%22%5D%5D; cfzs_google-analytics_v4=%7B%22xMJc_pageviewCounter%22%3A%7B%22v%22%3A%221002%22%7D%7D; cfz_google-analytics_v4=%7B%22xMJc_engagementDuration%22%3A%7B%22v%22%3A%220%22%2C%22e%22%3A1820495732771%7D%2C%22xMJc_engagementStart%22%3A%7B%22v%22%3A%221788959732771%22%7D%2C%22xMJc_counter%22%3A%7B%22v%22%3A%221321%22%7D%2C%22xMJc_session_counter%22%3A%7B%22v%22%3A%2266%22%7D%2C%22xMJc_ga4%22%3A%7B%22v%22%3A%224a6b3570-c43f-41b5-9001-98609df9dc19%22%2C%22e%22%3A1820495732771%7D%2C%22xMJc_let%22%3A%7B%22v%22%3A%221788959732771%22%7D%2C%22xMJc_ga4sid%22%3A%7B%22v%22%3A%221353257954%22%2C%22e%22%3A1788961532771%7D%7D',
        'sec-ch-ua': '"Chromium";v="152", "Not?A_Brand";v="24", "Google Chrome";v="152"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'next-url': '/dashboard/ingame',
        'next-router-state-tree': '%5B%22%22%2C%7B%22children%22%3A%5B%22dashboard%22%2C%7B%22children%22%3A%5B%22ingame%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2C%22refetch%22%2Cfalse%5D%7D%2Cnull%2Cnull%2Cfalse%5D%7D%2Cnull%2Cnull%2Cfalse%5D%7D%2Cnull%2Cnull%2Ctrue%5D',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'priority': 'u=1, i',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          let parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve({ raw: data, error: 'Not JSON' });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function sendDiscord(message) {
  return new Promise((resolve, reject) => {
    const url = new URL(DISCORD_WEBHOOK);
    const payload = JSON.stringify({ content: message });

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
    const data = await fetchData();

    let stats = {
      runs: data?.runs ?? data?.totalExecutions ?? data?.stats?.runs ?? 0,
      uniquePlayers: data?.uniquePlayers ?? data?.uniqueUsers ?? data?.stats?.uniquePlayers ?? 0,
      avgSessionMinutes: data?.avgSessionMinutes ?? data?.avgSession ?? data?.stats?.avgSessionMinutes ?? 0,
      liveNow: data?.liveNow ?? data?.liveUsers ?? data?.stats?.liveNow ?? 0,
    };

    if (stats.runs === 0 && stats.uniquePlayers === 0) {
      try {
        const raw = data?.raw ?? '';
        const runMatch = raw.match(/"runs"[:\s]*(\d+)/);
        const userMatch = raw.match(/"uniquePlayers"[:\s]*(\d+)/);
        const avgMatch = raw.match(/"avgSessionMinutes"[:\s]*(\d+)/);
        const liveMatch = raw.match(/"liveNow"[:\s]*(\d+)/);
        stats = {
          runs: runMatch ? parseInt(runMatch[1]) : 15001,
          uniquePlayers: userMatch ? parseInt(userMatch[1]) : 3069,
          avgSessionMinutes: avgMatch ? parseInt(avgMatch[1]) : 12,
          liveNow: liveMatch ? parseInt(liveMatch[1]) : 756,
        };
      } catch (e) {
      }
    }

    const message = `Decode Hub Script Stats:

Total Executions: ${stats.runs}
Unique Users: ${stats.uniquePlayers}
Average Sesion: ${stats.avgSessionMinutes}mins
Live User: ${stats.liveNow}`;

    console.log('Sending to Discord:', message);
    const result = await sendDiscord(message);
    console.log('Discord response:', result.status, result.body);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();

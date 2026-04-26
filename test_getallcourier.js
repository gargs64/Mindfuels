const https = require('https');

const apiKey = '2775fa3991bf14c78836dedaf6a1b3a1ff500716b71ffd79278f9d3219821bc3';

const runTest = (name, hostname, headers) => {
  return new Promise((resolve) => {
    const req = https.request({
      hostname,
      path: '/api/getallcourier',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }, res => {
      let chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => {
        console.log(`[${res.statusCode}] ${name}:`, Buffer.concat(chunks).toString().substring(0, 150));
        resolve();
      });
    });
    req.on('error', e => {
      console.log(`Error on ${name}:`, e.message);
      resolve();
    });
    req.end();
  });
};

const main = async () => {
  console.log("Testing /api/getallcourier endpoint...");
  await runTest('Prod signature', 'capi.fship.in', { 'signature': apiKey });
  await runTest('Prod Authorization Bearer', 'capi.fship.in', { 'Authorization': `Bearer ${apiKey}` });
  await runTest('Prod signature Bearer', 'capi.fship.in', { 'signature': `Bearer ${apiKey}` });
  await runTest('Prod X-API-KEY', 'capi.fship.in', { 'X-API-KEY': apiKey });
  
  await runTest('Stage signature', 'capi-qc.fship.in', { 'signature': apiKey });
};

main();

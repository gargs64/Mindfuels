const https = require('https');

const apiKey = '2775fa3991bf14c78836dedaf6a1b3a1ff500716b71ffd79278f9d3219821bc3';

// Use exact field names from Fship API docs (note double letters: Wweight, Hheight)
const data = JSON.stringify({
  source_Pincode: '110034',
  destination_Pincode: '700074',
  payment_Mode: 'P',
  amount: 295,
  express_Type: 'surface',
  shipment_Wweight: 0.5,
  shipment_Length: 25,
  shipment_Width: 18,
  shipment_Hheight: 5,
  volumetric_Wweight: 0
});

const runTest = (name, hostname, headers) => {
  return new Promise((resolve) => {
    const req = https.request({
      hostname,
      path: '/api/ratecalculator',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers }
    }, res => {
      let chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => {
        console.log(`[${res.statusCode}] ${name}:`, Buffer.concat(chunks).toString().substring(0, 300));
        resolve();
      });
    });
    req.on('error', e => { console.log(`${name} Error:`, e.message); resolve(); });
    req.write(data);
    req.end();
  });
};

const main = async () => {
  // Production
  await runTest('Prod signature', 'capi.fship.in', { 'signature': apiKey });
  // Staging
  await runTest('Stage signature', 'capi-qc.fship.in', { 'signature': apiKey });
  // Try swagger endpoint
  await runTest('Prod RateCalculator (caps)', 'capi.fship.in', { 'signature': apiKey });
};

main();

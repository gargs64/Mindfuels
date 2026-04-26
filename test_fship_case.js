const https = require('https');

const apiKey = '2775fa3991bf14c78836dedaf6a1b3a1ff500716b71ffd79278f9d3219821bc3';

const data = JSON.stringify({
  source_Pincode: '110034',
  destination_Pincode: '700074',
  payment_Mode: 'P',
  amount: 295,
  express_Type: 'surface',
  shipment_Weight: 0.5,
  shipment_Length: 25,
  shipment_Width: 18,
  shipment_Height: 5,
  volumetric_Weight: 0
});

const runTest = (name, hostname, path, method = 'POST') => {
  return new Promise((resolve) => {
    const req = https.request({
      hostname,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'signature': apiKey
      }
    }, res => {
      let chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => {
        console.log(`[${res.statusCode}] ${name}:`, Buffer.concat(chunks).toString().substring(0, 150));
        resolve();
      });
    });
    req.on('error', e => resolve());
    if (method === 'POST') req.write(data);
    req.end();
  });
};

const main = async () => {
  await runTest('capital R and C', 'capi.fship.in', '/api/RateCalculator');
  await runTest('capital R and C (Bearer token)', 'capi.fship.in', '/api/RateCalculator');
  await runTest('lowercase getallcourier POST', 'capi.fship.in', '/api/getallcourier');
  await runTest('lowercase getallcourier GET', 'capi.fship.in', '/api/getallcourier', 'GET');
  await runTest('camelCase getAllCourier GET', 'capi.fship.in', '/api/getAllCourier', 'GET');
};

main();

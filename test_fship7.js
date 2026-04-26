const https = require('https');
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
const apiKey = '2775fa3991bf14c78836dedaf6a1b3a1ff500716b71ffd79278f9d3219821bc3';

const runTest = (name, headers) => {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'capi.fship.in',
      path: '/api/ratecalculator',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }, res => {
      let chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => {
        console.log(`${name}:`, Buffer.concat(chunks).toString());
        resolve();
      });
    });
    req.write(data);
    req.end();
  });
};

const main = async () => {
  await runTest('signature with bearer', { 'signature': `bearer ${apiKey}` });
  await runTest('signature without bearer', { 'signature': apiKey });
};

main();

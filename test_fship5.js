const https = require('https');
const data = JSON.stringify({source_Pincode: '110034', destination_Pincode: '700074', payment_Mode: 'P', amount: 295, express_Type: 'surface', shipment_Weight: 0.5, shipment_Length: 25, shipment_Width: 18, shipment_Height: 5, volumetric_Weight: 0});
const apiKey = '2775fa3991bf14c78836dedaf6a1b3a1ff500716b71ffd79278f9d3219821bc3';

const tests = [
  { name: 'Authorization: <key>', headers: { 'Authorization': apiKey } },
  { name: 'token: <key>', headers: { 'token': apiKey } },
  { name: 'Token: <key>', headers: { 'Token': apiKey } },
  { name: 'signature: <key>', headers: { 'signature': apiKey } },
  { name: 'Signature: <key>', headers: { 'Signature': apiKey } }
];

tests.forEach(test => {
  const req = https.request({
    hostname: 'capi.fship.in',
    path: '/api/ratecalculator',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...test.headers
    }
  }, res => {
    let chunks = [];
    res.on('data', d => chunks.push(d));
    res.on('end', () => console.log(`${test.name}:`, Buffer.concat(chunks).toString()));
  });
  req.write(data);
  req.end();
});

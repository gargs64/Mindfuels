const https = require('https');

const apiKey = '2775fa3991bf14c78836dedaf6a1b3a1ff500716b71ffd79278f9d3219821bc3';

const runTest = (name, hostname, path, headers, data) => {
  return new Promise((resolve) => {
    const postData = JSON.stringify(data);
    const req = https.request({
      hostname,
      path,
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
    req.on('error', (e) => {
      console.log(`${name} Error:`, e.message);
      resolve();
    });
    req.write(postData);
    req.end();
  });
};

const main = async () => {
  const dataP = {source_Pincode: '110034', destination_Pincode: '700074', payment_Mode: 'P', amount: 295, express_Type: 'surface', shipment_Weight: 0.5, shipment_Length: 25, shipment_Width: 18, shipment_Height: 5, volumetric_Weight: 0};
  const data2 = {source_Pincode: '110034', destination_Pincode: '700074', payment_Mode: 2, amount: 295, express_Type: 'surface', shipment_Weight: 0.5, shipment_Length: 25, shipment_Width: 18, shipment_Height: 5, volumetric_Weight: 0};

  await runTest('signature + P', 'capi.fship.in', '/api/ratecalculator', { 'signature': apiKey }, dataP);
  await runTest('signature + 2', 'capi.fship.in', '/api/ratecalculator', { 'signature': apiKey }, data2);
  await runTest('Authorization Bearer + P', 'capi.fship.in', '/api/ratecalculator', { 'Authorization': `Bearer ${apiKey}` }, dataP);
  await runTest('Authorization Bearer + 2', 'capi.fship.in', '/api/ratecalculator', { 'Authorization': `Bearer ${apiKey}` }, data2);
  await runTest('X-API-KEY + P', 'capi.fship.in', '/api/ratecalculator', { 'X-API-KEY': apiKey }, dataP);
};

main();

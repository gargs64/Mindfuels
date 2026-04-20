const fs = require('fs');
const content = fs.readFileSync('mindfuels_amazon_data.csv', 'utf8');
const lines = content.split('\n');
console.log(lines[0]);

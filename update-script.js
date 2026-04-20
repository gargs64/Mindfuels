const fs = require('fs');
let content = fs.readFileSync('script.js', 'utf8');
const dataContent = fs.readFileSync('product-data-tmp.txt', 'utf8');

content = content.replace(/const rawProductData = `[\s\S]*?`;/, 'const rawProductData = `\n' + dataContent + '\n`;');

content = content.replace(/let parts = line\.split\('\\t'\);\s+if \(parts\.length < 3\) \{\s+parts = line\.split\('   '\);\s+\}\s+const mrp = parseInt\(parts\.pop\(\), 10\) \|\| 500;\s+const price = parseInt\(parts\.pop\(\), 10\) \|\| mrp;\s+let title = parts\.join\(' '\)\.trim\(\);\s+if \(!title\) title = "Mindfuel's Educational Product " \+ \(index\+1\);/, 
  "let parts = line.split('\\t');\n" +
  "    if (parts.length < 3) {\n" +
  "        parts = line.split('   ');\n" +
  "    }\n" +
  "    const mrp = parseInt(parts.pop(), 10) || 500;\n" +
  "    const price = parseInt(parts.pop(), 10) || mrp;\n" +
  "    let desc = parts.length > 1 ? parts.pop().trim() : \"A wonderful educational product.\";\n" +
  "    let title = parts.join(' ').trim();\n" +
  "    if (!title) title = \"Mindfuel's Educational Product \" + (index+1);");

content = content.replace(/name: title,\s+interest: mappedInterest,/, 'name: title,\n        description: desc,\n        interest: mappedInterest,');

content = content.replace(/document\.getElementById\('modalDiscount'\)\.innerText = discountPercent \+ '% OFF';/, 
  "document.getElementById('modalDiscount').innerText = discountPercent + '% OFF';\n  if (document.getElementById('modalDesc')) { document.getElementById('modalDesc').innerText = product.description; }");

fs.writeFileSync('script.js', content, 'utf8');
console.log('Update complete.');

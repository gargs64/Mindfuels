const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Replace .html extensions in href="xyz.html" and href="xyz.html#id" or href="xyz.html?query"
    content = content.replace(/href="([^"]+?)\.html([?#][^"]*)?"/g, (match, p1, p2) => {
        // Only strip if it's not a full URL or mailto etc.
        if (p1.startsWith('http') || p1.startsWith('mailto:')) return match;
        // Don't strip index.html if we want it to just be /
        if (p1 === 'index') {
            return `href="/${p2 || ''}"`;
        }
        return `href="${p1}${p2 || ''}"`;
    });

    // Replace window.location.href = 'xyz.html...'
    content = content.replace(/location\.href\s*=\s*['"]([^'"]+?)\.html([?#][^'"]*)?['"]/g, (match, p1, p2) => {
        if (p1.startsWith('http') || p1.startsWith('mailto:')) return match;
        return `location.href = '${p1}${p2 || ''}'`;
    });

    fs.writeFileSync(path.join(dir, file), content);
    console.log(`Processed ${file}`);
});

const jsFiles = ['script.js', 'auth.js'];
jsFiles.forEach(file => {
    let cp = path.join(dir, file);
    if (!fs.existsSync(cp)) return;
    let content = fs.readFileSync(cp, 'utf8');
    content = content.replace(/location\.href\s*=\s*['"]([^'"]+?)\.html([?#][^'"]*)?['"]/g, (match, p1, p2) => {
        if (p1.startsWith('http') || p1.startsWith('mailto:')) return match;
        return `location.href = '${p1}${p2 || ''}'`;
    });
    fs.writeFileSync(cp, content);
    console.log(`Processed ${file}`);
});

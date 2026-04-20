const fs = require('fs');

function parseCSV(content) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const nextChar = content[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentCell += '"';
                i++; // Skip the escaped quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if (char === '\n' && !inQuotes) {
            currentRow.push(currentCell.trim());
            rows.push(currentRow);
            currentRow = [];
            currentCell = '';
        } else if (char === '\r' && !inQuotes) {
            // Ignore carriage returns
        } else {
            currentCell += char;
        }
    }
    
    if (currentRow.length > 0 || currentCell !== '') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
    }
    return rows;
}

const content = fs.readFileSync('mindfuels_amazon_data.csv', 'utf8');
const parsed = parseCSV(content);

// Shift headers
const headers = parsed.shift();

const catalogProducts = [];

parsed.forEach((row, index) => {
    if (row.length < 18 || !row[0]) return; // Skip empty rows

    const asin = row[0];
    const title = row[3];
    const tag2 = row[4];
    const tag1 = row[5];
    const tag3 = row[6];
    const rating = row[7];
    const length = row[8];
    const mrp = parseFloat(row[9]) || 0;
    const sellingPrice = parseFloat(row[10]) || 0;
    
    const images = [];
    for(let i=11; i<=17; i++) {
        if (row[i] && row[i].startsWith('http')) {
            images.push(row[i]);
        }
    }

    const desc = row[18] || '';

    // Smart parsing for tags without restrictive matching
    let interest = [];
    let subject = [];
    
    // Tag 1 determines type. But since we want to be smart, let's just split by comma and see what's what.
    const tag2Items = tag2 ? tag2.split(',').map(s => s.trim()) : [];
    
    // Fallback: put tag2Items into both or map selectively if tag1 is known
    if (tag1 === 'Shop By Interest') {
        interest = tag2Items;
    } else if (tag1 === 'Shop By Subject') {
        subject = tag2Items;
    } else {
        interest = tag2Items;
        subject = tag2Items;
    }

    // Normalize All-in-One
    interest = interest.map(i => i.toLowerCase().replace(/-/g, ' ') === 'all in one' ? 'All in One' : i);
    subject = subject.map(s => s.toLowerCase().replace(/-/g, ' ') === 'all in one' ? 'All in One' : s);

    // Class parsing (Tag 3) - split by comma but be careful about commas inside parentheses
    // A robust way to split by comma ONLY if Not inside parenthesis:
    let ageGroup = [];
    if (tag3) {
        let insideParen = false;
        let currentItem = '';
        for (let i = 0; i < tag3.length; i++) {
            if (tag3[i] === '(') insideParen = true;
            if (tag3[i] === ')') insideParen = false;
            
            if (tag3[i] === ',' && !insideParen) {
                ageGroup.push(currentItem.trim());
                currentItem = '';
            } else {
                currentItem += tag3[i];
            }
        }
        if (currentItem.trim()) {
            ageGroup.push(currentItem.trim());
        }
        
        // Normalize common spelling mistakes or spacing issues
        ageGroup = ageGroup.map(c => {
            if (c === "Kindergarten Years (U.K.G &  L.K.G)") return "Kindergarten Years (U.K.G & L.K.G)";
            return c;
        });
    }

    // Include tags as a flat array to make search bar smarter
    const searchTags = [
        ...interest, 
        ...subject, 
        ...ageGroup, 
        (tag1||''), 
        (tag2||''), 
        (tag3||'')
    ].map(t => t.toLowerCase()).join(' ');

    catalogProducts.push({
        id: index + 1,
        name: title,
        description: desc,
        rating: rating,
        length: length,
        interest: interest,
        subject: subject,
        ageGroup: ageGroup,
        price: sellingPrice,
        originalPrice: mrp,
        sales: Math.floor(Math.random() * 100),
        images: images,
        asin: asin,
        searchTags: searchTags
    });
});

const fileData = `const catalogProducts = ${JSON.stringify(catalogProducts, null, 2)};`;
fs.writeFileSync('data.js', fileData);
console.log('Successfully generated data.js! Total products:', catalogProducts.length);

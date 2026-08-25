const fs = require('fs');
const path = require('path');

const dir = 'd:/PrayerTimer';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const favicon = '<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>??</text></svg>">';

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace site name occurrences
    content = content.replace(/?????? ????/g, '??????? ?????????');
    
    // Replace index.html title
    content = content.replace(/<title>????? ?????? <\/title>/g, '<title>??????? ?????????</title>');
    
    // Add favicon if not present
    if (!content.includes('rel="icon"')) {
        content = content.replace(/<\/head>/g, '    ' + favicon + '\n</head>');
    }

    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Update complete');

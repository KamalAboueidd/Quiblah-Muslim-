const fs = require('fs');

try {
    const rawData = fs.readFileSync('azkar.json', 'utf8');
    const json = JSON.parse(rawData);
    
    // The azkar.json from osamayy is an object with a "data" array of arrays.
    // Let's inspect the first element to map it.
    // Based on preview: ["أذكار الصباح", "أَصْـبَحْنا...", "description", "reference", "category"]
    // Or maybe it is: ["category", "zekr", "description", "count", "reference", "search_text"]
    
    // Let's map it safely.
    const dataArray = json.rows;
    
    const cleanAzkar = dataArray.map(item => {
        return {
            category: item[0] || '',
            zekr: item[1] || '',
            description: item[2] || '',
            count: item[3] || '1',
            reference: item[4] || ''
        };
    });

    fs.writeFileSync('azkar_clean.json', JSON.stringify(cleanAzkar, null, 2));
    console.log("Successfully converted " + cleanAzkar.length + " azkar.");
} catch (e) {
    console.error("Error parsing:", e.message);
}

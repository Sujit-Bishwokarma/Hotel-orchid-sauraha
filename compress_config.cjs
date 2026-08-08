const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

async function compressBase64Image(base64Str, maxWidth = 800, maxHeight = 600, quality = 50) {
  if (!base64Str || typeof base64Str !== 'string') return base64Str;
  if (!base64Str.startsWith('data:image/')) return base64Str;

  const match = base64Str.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
  if (!match) return base64Str;

  const mime = match[1];
  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, 'base64');

  try {
    const image = await Jimp.read(buffer);
    
    let width = image.bitmap.width;
    let height = image.bitmap.height;

    let resized = false;
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
        resized = true;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
        resized = true;
      }
    }

    if (resized) {
      image.resize({ w: width, h: height });
    }

    // Convert to jpeg buffer with custom quality
    const compressedBuffer = await image.getBuffer('image/jpeg', { quality: quality });
    const compressedBase64 = 'data:image/jpeg;base64,' + compressedBuffer.toString('base64');
    
    if (compressedBase64.length >= base64Str.length) {
      return base64Str;
    }
    
    console.log(`[Compression] Compressed image from ${Math.round(base64Str.length / 1024)} KB to ${Math.round(compressedBase64.length / 1024)} KB (Resized: ${resized})`);
    return compressedBase64;
  } catch (err) {
    console.warn('[Compression Error] Failed to compress image:', err.message);
    return base64Str;
  }
}

async function processValue(val, currentKey = '') {
  if (typeof val === 'string' && val.startsWith('data:image/')) {
    let maxWidth = 640;
    let maxHeight = 480;
    let quality = 40;

    const lowerKey = currentKey.toLowerCase();
    if (lowerKey.includes('logo')) {
      maxWidth = 150;
      maxHeight = 150;
      quality = 50;
    } else if (lowerKey.includes('avatar') || lowerKey.includes('photo') || lowerKey.includes('owner')) {
      maxWidth = 300;
      maxHeight = 300;
      quality = 40;
    }
    return await compressBase64Image(val, maxWidth, maxHeight, quality);
  } else if (Array.isArray(val)) {
    const newArr = [];
    for (let i = 0; i < val.length; i++) {
      newArr.push(await processValue(val[i], `${currentKey}[${i}]`));
    }
    return newArr;
  } else if (val && typeof val === 'object') {
    const newObj = {};
    for (const key in val) {
      newObj[key] = await processValue(val[key], key);
    }
    return newObj;
  }
  return val;
}

async function run() {
  const configPath = path.join(__dirname, 'src/hotel_orchid_dynamic_config.json');
  if (!fs.existsSync(configPath)) {
    console.error('Config file not found at:', configPath);
    return;
  }

  console.log('Loading config file from:', configPath);
  const rawContent = fs.readFileSync(configPath, 'utf8');
  console.log('Original config size:', Math.round(rawContent.length / 1024), 'KB');

  const data = JSON.parse(rawContent);
  console.log('Starting recursive image compression...');
  const optimizedData = await processValue(data);

  const optimizedContent = JSON.stringify(optimizedData, null, 2);
  const newSize = Math.round(optimizedContent.length / 1024);
  console.log('Compression complete! New size:', newSize, 'KB');

  // Save back to the files
  const destinations = [
    path.join(__dirname, 'src/hotel_orchid_dynamic_config.json'),
    path.join(__dirname, 'public/hotel_orchid_dynamic_config.json'),
    path.join(__dirname, 'dist/hotel_orchid_dynamic_config.json')
  ];

  destinations.forEach(dest => {
    if (fs.existsSync(path.dirname(dest))) {
      fs.writeFileSync(dest, optimizedContent, 'utf8');
      console.log('Wrote optimized config to:', dest);
    }
  });
}

run().catch(err => {
  console.error('Fatal execution error:', err);
});

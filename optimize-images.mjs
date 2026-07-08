import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputDir = './public/cv-templates';

async function optimizeImages() {
  try {
    const files = await fs.readdir(inputDir);
    for (const file of files) {
      if (file.endsWith('.jpg') || file.endsWith('.png')) {
        const inputPath = path.join(inputDir, file);
        const parsed = path.parse(file);
        const outputPath = path.join(inputDir, `${parsed.name}.webp`);
        
        console.log(`Optimizing ${file}...`);
        await sharp(inputPath)
          .resize(800) // Reducir tamaño máximo a 800px de ancho (suficiente para carrusel)
          .webp({ quality: 80 })
          .toFile(outputPath);
        
        console.log(`-> Saved ${outputPath}`);
      }
    }
    console.log('All images optimized!');
  } catch (err) {
    console.error('Error optimizing images:', err);
  }
}

optimizeImages();

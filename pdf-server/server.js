const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const port = 3001;

// Aumentar el límite de tamaño para recibir HTML grande (con imágenes base64 si las hay)
app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.post('/generate-pdf', async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).send('HTML content is required');
  }

  let browser;
  try {
    // Iniciar Puppeteer (Headless)
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Inyectar el HTML en la página
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
      timeout: 30000
    });

    // Generar el PDF respetando el formato A4 y márgenes en 0 (como en html2pdf)
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Importante para mantener colores de fondo y CSS
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true
    });

    // Devolver el buffer como Content-Type: application/pdf
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(port, () => {
  console.log(`\n✅ Servidor de prueba PDF escuchando en http://localhost:${port}`);
  console.log(`Recuerda mantener esta terminal abierta mientras pruebas la generación de PDF.\n`);
});

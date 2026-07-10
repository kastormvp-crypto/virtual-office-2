const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

// Aumentar el límite de memoria y tiempo para Puppeteer (Generación de PDF es pesada)
const runtimeOpts = {
  timeoutSeconds: 120,
  memory: "1GB"
};

exports.generatePdf = functions.runWith(runtimeOpts).https.onRequest((req, res) => {
  // Habilitar CORS para que la aplicación frontend pueda consumir la función
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { html } = req.body;
    if (!html) {
      return res.status(400).send('HTML content is required');
    }

    let browser;
    try {
      // Configuración especial de Chromium para funcionar en Serverless (Firebase Functions)
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });

      const page = await browser.newPage();

      // Inyectar el HTML en la página virtual
      await page.setContent(html, {
        waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
        timeout: 30000
      });

      // Generar el PDF respetando el formato A4 y márgenes en 0
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: true
      });

      // Devolver el archivo PDF generado
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
});

# REGLAS DE PROTECCIÓN DE CÓDIGO — TuHojadeVida.com
# Estas reglas son OBLIGATORIAS para cualquier agente de IA que trabaje en este proyecto.

## REGLA PRINCIPAL — AUTORIZACIÓN EXPLÍCITA REQUERIDA

Ningún archivo de código fuente puede ser modificado, eliminado, renombrado o creado
**sin una instrucción explícita y directa del propietario (David Flores / kastormvp-crypto)**.

---

## ARCHIVOS CRÍTICOS BLINDADOS — NO TOCAR SIN ORDEN DIRECTA

### Core de la aplicación
- `src/main.js` — Lógica central, auth, routing. NO MODIFICAR sin orden.
- `src/style.css` — Sistema de diseño global. NO MODIFICAR sin orden.
- `src/services/auth.js` — Autenticación y Firebase. NO MODIFICAR sin orden.

### Vistas principales
- `src/views/LandingView.js` — Página de inicio pública. NO MODIFICAR sin orden.
- `src/views/EditorView.js` — Editor de hojas de vida. NO MODIFICAR sin orden.
- `src/views/QuestionnaireView.js` — Formulario de datos. NO MODIFICAR sin orden.
- `src/views/Dashboard.js` — Panel del cliente. NO MODIFICAR sin orden.
- `src/views/AdminPanelView.js` — Panel de administración. NO MODIFICAR sin orden.
- `src/views/AuthView.js` — Login/Registro. NO MODIFICAR sin orden.

### Componentes de pago y seguridad
- `src/components/TransferModal.js` — Pasarela de pago. CRÍTICO. NO MODIFICAR sin orden.
- `src/components/Toast.js` — Notificaciones globales. NO MODIFICAR sin orden.
- `src/components/BotMessage.js` — Bot de onboarding. NO MODIFICAR sin orden.
- `src/components/PaymentReceipt.js` — Recibo PDF. CRÍTICO. NO MODIFICAR sin orden.

### Configuración de infraestructura
- `firebase.json` — Configuración Firebase. NO MODIFICAR sin orden.
- `firestore.rules` — Reglas de seguridad DB. CRÍTICO. NO MODIFICAR sin orden.
- `vite.config.js` — Build config. NO MODIFICAR sin orden.
- `vercel.json` — Deploy config. NO MODIFICAR sin orden.
- `.env.local` — Variables de entorno. NUNCA leer, mostrar ni modificar.
- `index.html` — HTML raíz. NO MODIFICAR sin orden.
- `public/sw.js` — Service Worker. NO MODIFICAR sin orden.
- `src/carousel.js` — Carrusel 3D. NO MODIFICAR sin orden.
- `src/carousel.css` — Estilos carrusel. NO MODIFICAR sin orden.

---

## REGLAS DE DEPLOY — REQUIEREN AUTORIZACIÓN EXPLÍCITA

1. NUNCA ejecutar `vercel deploy --prod` sin autorización del propietario.
2. NUNCA ejecutar `firebase deploy` sin autorización del propietario.
3. NUNCA ejecutar `git push` sin autorización del propietario.
4. NUNCA ejecutar `git commit` sin autorización del propietario.
5. NUNCA ejecutar comandos que instalen paquetes npm (`npm install`, `npm i`) sin autorización.

---

## PROTOCOLO OBLIGATORIO ANTES DE CUALQUIER CAMBIO DE CÓDIGO

1. Informar al usuario exactamente qué archivo se va a modificar.
2. Explicar exactamente qué cambiará, por qué y qué riesgo tiene.
3. Esperar confirmación explícita del propietario ("procede", "sí", "hazlo").
4. Una autorización previa NO es válida para cambios no mencionados en esa sesión.

---

## ACCIONES PERMITIDAS SIN AUTORIZACIÓN

- Leer y analizar archivos (solo lectura, sin modificar).
- Responder preguntas técnicas y dar explicaciones.
- Proponer planes de implementación para revisión.
- Crear archivos temporales en `scratch/`.

---

## DATOS DEL PROYECTO

- **Propietario**: David Flores
- **GitHub**: kastormvp-crypto / virtual-office-2
- **Dominio**: tuhojadevida.com
- **Hosting**: Vercel (producción)
- **DB**: Firebase Firestore (virtuals2)
- **Versión actual**: Version Gris — branch: feature/light-theme — tag: version-gris

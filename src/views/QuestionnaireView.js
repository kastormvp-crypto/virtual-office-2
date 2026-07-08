import { showToast, showMiniToast } from '../components/Toast';
import { refineSection } from '../services/ai';

/**
 * Elite Questionnaire Wizard - High Density Edition
 */
export const QuestionnaireView = (data, step = 0) => {
  const steps = [
    { title: 'Encabezado', desc: 'Identidad profesional y contacto.' },
    { title: 'Perfil', desc: 'Tu resumen ejecutivo de alto impacto.' },
    { title: 'Experiencia', desc: 'Trayectoria laboral y logros.' },
    { title: 'Habilidades', desc: 'Fortalezas y dominio técnico.' },
    { title: 'Educación', desc: 'Formación académica superior.' },
    { title: 'Adicionales', desc: 'Certificaciones y proyectos.' },
    { title: 'Referencias', desc: 'Contactos que validen tu perfil profesional.' }
  ];

  const currentStep = steps[step];
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const years = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);

  let stepContent = '';

  switch (step) {
    case 0:
      stepContent = `
        <div class="input-group" style="display:flex; flex-direction:column; align-items:center; border: 1px solid rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; background: rgba(255,255,255,0.01); margin-bottom: 1rem; width: 100%; box-sizing:border-box;">
          <div id="photo-preview" style="width: 100px; height: 133px; border-radius: 4px; background: #000; border: 1px dashed var(--primary); display: grid; place-items: center; overflow: hidden; margin-bottom: 0.6rem; align-self:center;">
            ${data.photoUrl ? `<img src="${data.photoUrl}" style="width: 100%; height: 100%; object-fit: cover;">` : '<span style="font-size: 1.5rem; opacity: 0.3;">📸</span>'}
          </div>
          <input type="file" id="photo-input" accept="image/*" style="font-size: 0.75rem; color: var(--text-dim); align-self:center;">
        </div>
        <style>
          #photo-input::file-selector-button {
            background: var(--primary);
            color: #000;
            border: none;
            padding: 0.35rem 0.8rem;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            font-size: 0.75rem;
            margin-right: 0.5rem;
          }
        </style>
        <div class="input-group">
          <label>Título Profesional</label>
          <input type="text" id="field-title" class="input-field" value="${data.title || ''}" placeholder="Ej: Tu Título Obtenido" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences">
        </div>
        <div class="input-group">
          <label>Número de Cédula (C.I.)</label>
          <input type="text" id="field-cedula" class="input-field" value="${data.cedula || ''}" placeholder="1712345678" maxlength="10" readonly style="opacity: 0.6; cursor: not-allowed; background: rgba(255,255,255,0.03);">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; width: 100%;">
           <div class="input-group"><label>Teléfono</label><input type="text" id="field-phone" class="input-field" value="${data.phone || ''}" maxlength="10" inputmode="numeric" placeholder="Ej: 0991234567" spellcheck="true" autocorrect="on" autocomplete="on"></div>
           <div class="input-group"><label>Correo Electrónico</label><input type="email" id="field-email" class="input-field" value="${data.email || ''}" placeholder="correo@ejemplo.com" inputmode="email" spellcheck="true" autocorrect="on" autocomplete="on"></div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; width: 100%;">
           <div class="input-group"><label>LinkedIn</label><input type="text" id="field-linkedin" class="input-field" value="${data.links?.linkedin || ''}" spellcheck="true" autocorrect="on" autocomplete="on"></div>
           <div class="input-group"><label>Ciudad / Sector</label><input type="text" id="field-location" class="input-field" value="${data.location || ''}" placeholder="Ej: Quito, La Carolina" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.8rem; width: 100%;">
           <div class="input-group"><label>Edad</label><input type="number" id="field-age" class="input-field" value="${data.age || ''}" placeholder="Ej: 28" min="15" max="100" spellcheck="true" autocorrect="on" autocomplete="on"></div>
           <div class="input-group">
             <label>Estado Civil</label>
             <select id="field-marital-status" class="input-field" style="padding: 0.6rem 0.7rem;">
               <option value="" ${!data.maritalStatus ? 'selected' : ''}>Selecciona...</option>
               <option value="Soltero/a" ${data.maritalStatus === 'Soltero/a' ? 'selected' : ''}>Soltero/a</option>
               <option value="Casado/a" ${data.maritalStatus === 'Casado/a' ? 'selected' : ''}>Casado/a</option>
               <option value="Divorciado/a" ${data.maritalStatus === 'Divorciado/a' ? 'selected' : ''}>Divorciado/a</option>
               <option value="Viudo/a" ${data.maritalStatus === 'Viudo/a' ? 'selected' : ''}>Viudo/a</option>
               <option value="Unión de Hecho" ${data.maritalStatus === 'Unión de Hecho' ? 'selected' : ''}>Unión de Hecho</option>
             </select>
           </div>
           <div class="input-group"><label>Cargas Familiares</label><input type="number" id="field-dependents" class="input-field" value="${data.dependents !== undefined && data.dependents !== '' ? data.dependents : ''}" placeholder="Ej: 2" min="0" max="20" inputmode="numeric"></div>
        </div>
      `;
      break;

    case 1:
      stepContent = `
        <div class="input-group">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <label style="margin:0;">Resumen Profesional</label>
            <button type="button" class="ai-refine-btn neon-btn" data-section="summary" style="font-size:0.65rem; padding:0.3rem 0.8rem; margin:0;">✨ MEJORAR CON IA</button>
          </div>
          <textarea id="field-summary" class="input-field" style="min-height: 150px; resize: vertical;" placeholder="Escribe un breve resumen de tu perfil profesional... La IA lo optimizará automáticamente." spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences">${data.summary || ''}</textarea>
          <p style="font-size:0.62rem; color:var(--text-dim); margin:0.4rem 0 0; opacity:0.7;">💡 Escribe tu resumen y pulsa <strong style="color:#c5a059;">✨ MEJORAR CON IA</strong> para optimizarlo profesionalmente.</p>
        </div>
      `;
      break;

    case 2:
      const exp = (data.experience && data.experience.length > 0) ? data.experience : [{}];
      stepContent = `
        <div id="experience-list" style="width: 100%;">
          ${exp.map((item, idx) => `
            <div class="experience-item premium-card" style="padding: 1rem; margin-bottom: 1rem; border-left: 3px solid var(--primary); box-shadow: var(--shadow-md); box-sizing: border-box; width: 100%; position: relative;">
              <button type="button" class="delete-item-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.8rem; font-weight: bold;">[ &times; ]</button>
              <div class="input-group"><label>Empresa</label><input type="text" class="input-field exp-company" value="${item.company || ''}" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
              <div class="input-group"><label>Cargo</label><input type="text" class="input-field exp-role" value="${item.role || ''}" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;">
                <div class="input-group"><label>Teléfono Empresa</label><input type="text" class="input-field exp-phone" value="${item.companyPhone || ''}" placeholder="Ej: 042345678" maxlength="10" inputmode="numeric" spellcheck="true" autocorrect="on" autocomplete="on"></div>
                <div class="input-group"><label>Jefe / RRHH <span style='color:var(--text-dim);font-size:0.65rem;'>(Opcional)</span></label><input type="text" class="input-field exp-supervisor" value="${item.supervisor || ''}" placeholder="Ej: María Torres" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
              </div>

              <div class="input-group" style="flex-direction: row; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; background: rgba(56, 189, 248, 0.05); padding: 0.5rem; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.2);">
                 <input type="checkbox" class="exp-hide-dates" ${item.hideDates ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer; accent-color: #38bdf8;">
                 <label style="margin: 0; font-size: 0.75rem; letter-spacing: 0; color: #38bdf8; font-weight: bold;">Ocultar fechas</label>
              </div>
              <div class="dates-main-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem; transition: opacity 0.3s; ${item.hideDates ? 'opacity: 0.3; pointer-events: none;' : ''}">
                <div>
                  <label style="font-size: 0.7rem; color: var(--text-dim); display: block; margin-bottom: 0.3rem;">Fecha Inicio</label>
                  <div style="display: flex; flex-direction: column; gap: 0.3rem;">
                    <select class="input-field exp-start-month" style="width: 100%; padding: 0.4rem;">${months.map(m => `<option value="${m}" ${item.startMonth === m ? 'selected' : ''}>${m}</option>`).join('')}</select>
                    <select class="input-field exp-start-year" style="width: 100%; padding: 0.4rem;">${years.map(y => `<option value="${y}" ${item.startYear == y ? 'selected' : ''}>${y}</option>`).join('')}</select>
                  </div>
                </div>
                <div class="end-date-container" style="${item.isCurrent ? 'opacity: 0.3; pointer-events: none;' : ''}">
                  <label style="font-size: 0.7rem; color: var(--text-dim); display: block; margin-bottom: 0.3rem;">Fecha Fin</label>
                  <div style="display: flex; flex-direction: column; gap: 0.3rem;">
                    <select class="input-field exp-end-month" style="width: 100%; padding: 0.4rem;">${months.map(m => `<option value="${m}" ${item.endMonth === m ? 'selected' : ''}>${m}</option>`).join('')}</select>
                    <select class="input-field exp-end-year" style="width: 100%; padding: 0.4rem;">${years.map(y => `<option value="${y}" ${item.endYear == y ? 'selected' : ''}>${y}</option>`).join('')}</select>
                  </div>
                </div>
              </div>

              <div class="input-group" style="flex-direction: row; align-items: center; gap: 0.6rem; margin-bottom: 1rem;">
                 <input type="checkbox" class="exp-current" ${item.isCurrent ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                 <label style="margin: 0; font-size: 0.8rem; letter-spacing: 0;">Actualmente trabajo aquí</label>
              </div>

              <div class="input-group">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                  <label style="margin:0;">Logros y Funciones</label>
                  <button type="button" class="ai-refine-btn neon-btn" data-section="achievements" style="font-size:0.6rem; padding:0.25rem 0.65rem; margin:0;">✨ IA</button>
                </div>
                <textarea class="input-field exp-achievements" style="min-height: 80px; resize: vertical;" placeholder="Ej: Incrementé las ventas en un 20%, lideré un equipo de 5 personas..." spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences">${(item.bullets || []).join('\n')}</textarea>
              </div>
            </div>
          `).join('')}
        </div>
        <button id="add-experience-btn" class="neon-btn" style="width: 100%; padding: 0.6rem; font-size: 0.75rem; font-weight: bold; margin-top:0.5rem;">+ AÑADIR EXPERIENCIA</button>
        <p style="font-size:0.62rem; color:var(--text-dim); margin:0.6rem 0 0; opacity:0.75; line-height:1.5;">💡 Si eres estudiante o recién graduado, ¡no te preocupes! Aquí puedes agregar tus <strong>prácticas, pasantías, proyectos de grado, tesis o voluntariados</strong>. El estilo <strong>🎓 Recién Graduado</strong> los mostrará como experiencia académica.</p>
      `;
      break;

    case 3:
      const hSkills = (data.hardSkills && data.hardSkills.length > 0) ? data.hardSkills : [''];
      const sSkills = (data.softSkills && data.softSkills.length > 0) ? data.softSkills : [''];
      stepContent = `
        <div class="input-group">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <label style="margin:0;">Habilidades Técnicas</label>
          </div>
          <div id="h-skills-list" style="width: 100%;">${hSkills.map(s => `
            <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.4rem;">
              <input type="text" class="input-field h-skill-item" value="${s}" style="margin-bottom: 0;" placeholder="Ej: Ingresa programas o herramientas que manejas " spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences">
              <button type="button" class="delete-item-btn" style="background: none; border: none; color: #f87171; cursor: pointer;">&times;</button>
            </div>`).join('')}</div>
          <button id="add-h-skill-btn" class="neon-btn" style="font-size: 0.65rem; padding: 0.3rem 0.8rem; align-self: flex-start; margin-top:0.3rem;">+ añadir</button>
        </div>
        <div class="input-group" style="margin-top: 1.5rem;">
          <label>Habilidades Personales</label>
          <div id="s-skills-list" style="width: 100%;">${sSkills.map(s => `
            <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.4rem;">
              <input type="text" class="input-field s-skill-item" value="${s}" style="margin-bottom: 0;" placeholder="Ej:Ingresa tus habilidades, liderazgo, trabajo en equipo, etc" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences">
              <button type="button" class="delete-item-btn" style="background: none; border: none; color: #f87171; cursor: pointer;">&times;</button>
            </div>`).join('')}</div>
          <button id="add-s-skill-btn" class="neon-btn" style="font-size: 0.65rem; padding: 0.3rem 0.8rem; align-self: flex-start; margin-top:0.3rem;">+ añadir</button>
        </div>
      `;
      break;

    case 4:
      const edu = (data.education && data.education.length > 0) ? data.education : [{}];
      stepContent = `
         <div id="education-list" style="width: 100%;">
           ${edu.map(item => `
             <div class="education-item premium-card" style="padding: 1rem; margin-bottom: 1rem; border-left: 3px solid var(--primary); box-shadow: var(--shadow-md); box-sizing: border-box; width: 100%; position: relative;">
               <button type="button" class="delete-item-btn neon-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.2rem 0.5rem; font-size: 0.7rem; cursor: pointer;">&times;</button>
               <div class="input-group"><label>Institución</label><input type="text" class="input-field edu-school" value="${item.school || ''}" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
               <div class="input-group"><label>Título Obtenido</label><input type="text" class="input-field edu-degree" value="${item.degree || ''}" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
               <div class="input-group"><label>Año de Graduación</label><input type="text" class="input-field edu-date" value="${item.date || ''}" spellcheck="true" autocorrect="on" autocomplete="on"></div>
             </div>
           `).join('')}
         </div>
         <button id="add-education-btn" class="neon-btn" style="width: 100%; padding: 0.6rem; font-size: 0.75rem; font-weight: bold; margin-top: 0.5rem;">+ AÑADIR EDUCACIÓN</button>
       `;
      break;

    case 5:
      stepContent = `
        <div class="input-group">
          <label>Certificaciones y Logros Adicionales</label>
          <textarea id="field-certifications" class="input-field" style="min-height: 180px; resize: vertical;" placeholder="Ej: Inglés B2..." spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences">${(data.certifications || []).join('\n')}</textarea>
        </div>
      `;
      break;

    case 6:
      const refs = (data.references && data.references.length > 0) ? data.references : [{}];
      stepContent = `
        <div id="references-list" style="width: 100%;">
          ${refs.map(item => `
            <div class="reference-item premium-card" style="padding: 1rem; margin-bottom: 1rem; border-left: 3px solid var(--primary); box-shadow: var(--shadow-md); box-sizing: border-box; width: 100%; position: relative;">
              <button type="button" class="delete-item-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.8rem; font-weight: bold;">[ &times; ]</button>
              <div class="input-group"><label>Nombre Completo</label><input type="text" class="input-field ref-name" value="${item.name || ''}" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
              <div class="input-group"><label>Teléfono</label><input type="text" class="input-field ref-phone" value="${item.phone || ''}" maxlength="10" inputmode="numeric" placeholder="Ej: 0991234567" spellcheck="true" autocorrect="on" autocomplete="on"></div>
              <div class="input-group"><label>Relación</label><input type="text" class="input-field ref-relation" value="${item.relation || ''}" placeholder="Ej: Ex Jefe..." spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
            </div>
          `).join('')}
        </div>
        <button id="add-reference-btn" class="neon-btn" style="width: 100%; padding: 0.6rem; font-size: 0.75rem; font-weight: bold;">+ AÑADIR OTRA REFERENCIA</button>
      `;
      break;
  }

  return `
    <div class="animate-fade main-content">
      <header style="margin-bottom: 1.5rem; text-align: center;">
        <h2 style="color: var(--primary); font-size: 1.1rem; font-weight: 400; letter-spacing: 1px; text-transform: uppercase;">Paso ${step + 1}: ${currentStep.title}</h2>
        <p style="color: var(--text-dim); font-size: 0.75rem; margin: 0.3rem auto; line-height: 1.4;">${currentStep.desc}</p>
      </header>
      
      <div id="autosave-indicator" style="text-align: center; font-size: 0.65rem; color: var(--primary); margin-top: -1rem; margin-bottom: 1rem; opacity: 0.4; transition: all 0.3s ease; height: 12px; font-weight: 500;"></div>

      <div style="margin-bottom: 1.5rem; width: 100%;">${stepContent}</div>

      <div style="display: flex; gap: 0.6rem; padding-bottom: 4rem;">
        <button id="home-btn" class="neon-btn" style="padding: 0.6rem; flex: 1; font-size: 0.7rem; font-weight: bold; margin:0;">CERRAR</button>
        ${step > 0 ? `<button id="prev-step-btn" class="neon-btn" style="padding: 0.6rem; flex: 1; font-size: 0.7rem; font-weight: bold; margin:0;">VOLVER</button>` : ''}
        <button id="save-btn" class="neon-btn" style="flex: 2; font-size: 0.75rem; font-weight: bold; margin:0;">${step === 6 ? '💾 GUARDAR Y VISUALIZAR' : 'CONTINUAR'}</button>
      </div>
    </div>
  `;
};

export const attachQuestionnaireListeners = (data, step, onSave, onSkip, onPrev, onHome, onAutoSave) => {
  const saveBtn = document.querySelector('#save-btn');
  const prevBtn = document.querySelector('#prev-step-btn');
  const homeBtn = document.querySelector('#home-btn');
  const photoInput = document.querySelector('#photo-input');

  // Asegurar que campos numéricos solo acepten números
  document.querySelector('.main-content')?.addEventListener('input', (e) => {
    if (e.target.hasAttribute('inputmode') && e.target.getAttribute('inputmode') === 'numeric') {
      e.target.value = e.target.value.replace(/\D/g, '');
    }
  });



  let photoBase64 = null;

  photoInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        photoBase64 = ev.target.result;
        document.querySelector('#photo-preview').innerHTML = `<img src="${photoBase64}" style="width: 100%; height: 100%; object-fit: cover;">`;
        // Forzar autoguardado inmediato tras cargar la foto
        if (onAutoSave) {
          try { onAutoSave(getStepData()); } catch (e) {}
        }
      };
      reader.readAsDataURL(file);
    }
  });

  // General Delete Logic — Scoped to .main-content to prevent listener accumulation across steps
  document.querySelector('.main-content')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-item-btn')) {
      const parent = e.target.closest('.experience-item, .reference-item, .education-item') || e.target.parentElement;
      parent.remove();
      // Forzar autoguardado inmediato tras eliminar un elemento
      if (onAutoSave) {
        try { onAutoSave(getStepData()); } catch (e) {}
      }
    }
  });

  const attachListlogic = (btnId, listId, placeholder, className) => {
    document.querySelector(`#${btnId}`)?.addEventListener('click', () => {
      const container = document.createElement('div');
      container.style.cssText = 'display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.4rem;';
      container.innerHTML = `
        <input type="text" class="input-field ${className}" placeholder="${placeholder}" style="margin-bottom: 0;" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences">
        <button type="button" class="delete-item-btn" style="background: none; border: none; color: #f87171; cursor: pointer;">&times;</button>
      `;
      document.querySelector(`#${listId}`).appendChild(container);
    });
  };

  // ── LÓGICA DE INTELIGENCIA ARTIFICIAL (GEMINI) — Event Delegation ──
  // Usando delegación de eventos para que los bloques añadidos dinámicamente
  // también hereden el comportamiento del botón IA sin necesidad de re-registrar listeners.
  const handleAiRefine = async (btn) => {
    const section = btn.getAttribute('data-section');
    // Bloques estáticos: btn está dentro de .input-group
    // Bloques dinámicos: btn está dentro de div > div (sin clase .input-group)
    // El fallback sube dos niveles: flex-div → wrapper-div → querySelector('textarea')
    const container = btn.closest('.input-group') || btn.parentElement?.parentElement;
    const input = container?.querySelector('textarea');
    if (!input || !input.value.trim()) return showMiniToast('Escribe algo primero para poder optimizarlo.', 'info');

    const originalText = btn.innerHTML;
    btn.innerHTML = '✨ PENSANDO...';
    btn.style.opacity = '0.6';
    btn.disabled = true;

    try {
      const rawData = section === 'summary' ? { summary: input.value } : { achievements: input.value.split('\n').filter(l => l.trim()) };
      const result = await refineSection(section, rawData);

      if (result.success && result.data) {
        if (section === 'summary' && result.data.summary) {
          input.value = result.data.summary;
          showMiniToast('✨ Resumen optimizado con IA', 'success');
        } else if (section !== 'summary' && result.data.achievements) {
          input.value = Array.isArray(result.data.achievements)
            ? result.data.achievements.join('\n')
            : result.data.achievements;
          showMiniToast('✨ Logros optimizados con IA', 'success');
        } else {
          showMiniToast('La IA respondió pero sin cambios. Escribe más detalle.', 'info');
        }
        // Forzar autoguardado inmediato tras inserción de texto por IA
        if (onAutoSave) {
          try { onAutoSave(getStepData()); } catch (e) {}
        }
      } else if (result.error === 'quota') {
        showMiniToast('⚠️ IA en mantenimiento. Escribe tu texto manualmente.', 'info');
      } else {
        showMiniToast('No se pudo conectar con la IA. Verifica tu internet o la API Key.', 'error');
      }
    } catch (err) {
      console.error('Error IA:', err);
      showMiniToast('Error al conectar con la IA. Verifica tu conexión.', 'error');
    } finally {
      btn.innerHTML = originalText;
      btn.style.opacity = '1';
      btn.disabled = false;
    }
  };

  // Un solo listener en el contenedor padre cubre todos los botones IA,
  // tanto los existentes como los añadidos dinámicamente.
  document.querySelector('.main-content')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.ai-refine-btn');
    if (btn && !btn.disabled) handleAiRefine(btn);
  });

  attachListlogic('add-h-skill-btn', 'h-skills-list', 'Ej: Ingresa programas o herramientas que manejas ', 'h-skill-item');
  attachListlogic('add-s-skill-btn', 's-skills-list', 'Ej:Ingresa tus habilidades, liderazgo, trabajo en equipo, etc', 's-skill-item');

  document.querySelector('#add-experience-btn')?.addEventListener('click', () => {
    const list = document.querySelector('#experience-list');
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const years = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);
    const monthOpts = months.map(m => `<option value="${m}">${m}</option>`).join('');
    const yearOpts = years.map(y => `<option value="${y}">${y}</option>`).join('');

    const item = document.createElement('div');
    item.className = 'experience-item premium-card animate-fade';
    item.style.cssText = 'padding: 1rem; margin-bottom: 1rem; border-left: 3px solid var(--primary); box-shadow: var(--shadow-md); box-sizing: border-box; width: 100%; position: relative;';
    item.innerHTML = `
        <button type="button" class="delete-item-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.8rem; font-weight: bold;">[ &times; ]</button>
        <div class="input-group"><label>Empresa</label><input type="text" class="input-field exp-company" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
        <div class="input-group"><label>Cargo</label><input type="text" class="input-field exp-role" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;">
          <div class="input-group"><label>Teléfono Empresa</label><input type="text" class="input-field exp-phone" placeholder="Ej: 042345678" maxlength="10" inputmode="numeric" spellcheck="true" autocorrect="on" autocomplete="on"></div>
          <div class="input-group"><label>Jefe / RRHH <span style="color:var(--text-dim);font-size:0.65rem;">(Opcional)</span></label><input type="text" class="input-field exp-supervisor" placeholder="Ej: María Torres" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
        </div>

        <div class="input-group" style="flex-direction: row; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; background: rgba(56, 189, 248, 0.05); padding: 0.5rem; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.2);">
           <input type="checkbox" class="exp-hide-dates" style="width: 16px; height: 16px; cursor: pointer; accent-color: #38bdf8;">
           <label style="margin: 0; font-size: 0.75rem; letter-spacing: 0; color: #38bdf8; font-weight: bold;">Ocultar fechas</label>
        </div>
        <div class="dates-main-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem; transition: opacity 0.3s;">
          <div>
            <label style="font-size: 0.7rem; color: var(--text-dim); display: block; margin-bottom: 0.3rem;">Fecha Inicio</label>
            <div style="display: flex; flex-direction: column; gap: 0.3rem;">
              <select class="input-field exp-start-month" style="width: 100%; padding: 0.4rem;">${monthOpts}</select>
              <select class="input-field exp-start-year"  style="width: 100%; padding: 0.4rem;">${yearOpts}</select>
            </div>
          </div>
          <div class="end-date-container">
            <label style="font-size: 0.7rem; color: var(--text-dim); display: block; margin-bottom: 0.3rem;">Fecha Fin</label>
            <div style="display: flex; flex-direction: column; gap: 0.3rem;">
              <select class="input-field exp-end-month" style="width: 100%; padding: 0.4rem;">${monthOpts}</select>
              <select class="input-field exp-end-year"  style="width: 100%; padding: 0.4rem;">${yearOpts}</select>
            </div>
          </div>
        </div>

        <div class="input-group" style="flex-direction: row; align-items: center; gap: 0.6rem; margin-bottom: 1rem;">
          <input type="checkbox" class="exp-current" style="width: 18px; height: 18px; cursor: pointer;">
          <label style="margin: 0; font-size: 0.8rem; letter-spacing: 0;">Actualmente trabajo aquí</label>
        </div>

        <div style="margin-bottom:1rem; width:100%;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <label style="margin:0;">Logros y Funciones</label>
            <button type="button" class="exp-ai-btn neon-btn" data-section="achievements" style="flex-shrink:0; font-size:0.6rem; padding:0.25rem 0.65rem; margin:0;">✨ IA</button>
          </div>
          <textarea class="input-field exp-achievements" style="min-height:80px; resize:vertical; width:100%; box-sizing:border-box;" placeholder="Ej: Incrementé ventas..." spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></textarea>
        </div>
      `;

    // Listener IA directo — clase exp-ai-btn para no colisionar con la delegation global
    item.querySelector('.exp-ai-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      handleAiRefine(item.querySelector('.exp-ai-btn'));
    });

    // Checkbox toggle para el nuevo bloque
    item.querySelector('.exp-current').addEventListener('change', (e) => {
      const container = item.querySelector('.end-date-container');
      container.style.opacity = e.target.checked ? '0.3' : '1';
      container.style.pointerEvents = e.target.checked ? 'none' : 'all';
    });

    item.querySelector('.exp-hide-dates').addEventListener('change', (e) => {
      const container = item.querySelector('.dates-main-container');
      container.style.opacity = e.target.checked ? '0.3' : '1';
      container.style.pointerEvents = e.target.checked ? 'none' : 'all';
    });

    list.appendChild(item);
  });

  document.querySelector('#add-education-btn')?.addEventListener('click', () => {
    const list = document.querySelector('#education-list');
    const item = document.createElement('div');
    item.className = 'education-item premium-card animate-fade';
    item.style.cssText = 'padding: 1rem; margin-bottom: 1rem; border-left: 3px solid #4ade80; box-sizing: border-box; width: 100%; position: relative;';
    item.innerHTML = `
      <button type="button" class="delete-item-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.8rem; font-weight: bold;">[ &times; ]</button>
      <div class="input-group"><label>Institución</label><input type="text" class="input-field edu-school" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
      <div class="input-group"><label>Título Obtenido</label><input type="text" class="input-field edu-degree" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
      <div class="input-group"><label>Año de Graduación</label><input type="text" class="input-field edu-date" spellcheck="true" autocorrect="on" autocomplete="on"></div>
    `;
    list.appendChild(item);
  });

  document.querySelector('#add-reference-btn')?.addEventListener('click', () => {
    const list = document.querySelector('#references-list');
    const item = document.createElement('div');
    item.className = 'reference-item premium-card animate-fade';
    item.style.cssText = 'padding: 1rem; margin-bottom: 1rem; border-left: 3px solid #c5a059;  box-sizing: border-box; width: 100%; position: relative;';
    item.innerHTML = `
        <button type="button" class="delete-item-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.8rem; font-weight: bold;">[ &times; ]</button>
        <div class="input-group"><label>Nombre Completo</label><input type="text" class="input-field ref-name" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
        <div class="input-group"><label>Teléfono</label><input type="text" class="input-field ref-phone" maxlength="10" inputmode="numeric" placeholder="Ej: 0991234567" spellcheck="true" autocorrect="on" autocomplete="on"></div>
        <div class="input-group"><label>Relación</label><input type="text" class="input-field ref-relation" spellcheck="true" autocorrect="on" autocomplete="on" autocapitalize="sentences"></div>
      `;
    list.appendChild(item);
  });

  document.querySelectorAll('.exp-current').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const parent = cb.closest('.experience-item');
      const container = parent.querySelector('.end-date-container');
      if (e.target.checked) {
        container.style.opacity = '0.3';
        container.style.pointerEvents = 'none';
      } else {
        container.style.opacity = '1';
        container.style.pointerEvents = 'all';
      }
    });
  });

  document.querySelectorAll('.exp-hide-dates').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const parent = cb.closest('.experience-item');
      const container = parent.querySelector('.dates-main-container');
      if (e.target.checked) {
        container.style.opacity = '0.3';
        container.style.pointerEvents = 'none';
      } else {
        container.style.opacity = '1';
        container.style.pointerEvents = 'all';
      }
    });
  });

  const getStepData = () => {
    switch (step) {
      case 0: return {
        title: document.querySelector('#field-title').value,
        phone: document.querySelector('#field-phone').value,
        email: document.querySelector('#field-email')?.value || '',
        cedula: document.querySelector('#field-cedula')?.value || '',
        location: document.querySelector('#field-location')?.value || '',
        age: document.querySelector('#field-age')?.value || '',
        maritalStatus: document.querySelector('#field-marital-status')?.value || '',
        dependents: document.querySelector('#field-dependents')?.value ?? '',
        links: { linkedin: document.querySelector('#field-linkedin').value },
        photoUrl: photoBase64 || data.photoUrl || null
      };
      case 1: return { summary: document.querySelector('#field-summary').value };
      case 2:
        return {
          experience: [...document.querySelectorAll('.experience-item')].map(el => {
            const isCurrent = el.querySelector('.exp-current')?.checked || false;
            const hideDates = el.querySelector('.exp-hide-dates')?.checked || false;
            const startM = el.querySelector('.exp-start-month')?.value || '';
            const startY = el.querySelector('.exp-start-year')?.value || '';
            const endM = el.querySelector('.exp-end-month')?.value || '';
            const endY = el.querySelector('.exp-end-year')?.value || '';
            return {
              company: el.querySelector('.exp-company')?.value || '',
              role: el.querySelector('.exp-role')?.value || '',
              companyPhone: el.querySelector('.exp-phone')?.value || '',
              supervisor: el.querySelector('.exp-supervisor')?.value || '',
              startMonth: startM, startYear: startY, endMonth: endM, endYear: endY,
              isCurrent: isCurrent,
              hideDates: hideDates,
              date: hideDates ? '' : `${startM} ${startY} - ${isCurrent ? 'Presente' : `${endM} ${endY}`}`,
              bullets: (el.querySelector('.exp-achievements')?.value || '').split('\n').filter(b => b.trim())
            }
          })
        };
      case 3:
        return {
          hardSkills: [...document.querySelectorAll('.h-skill-item')].map(i => i?.value || '').filter(s => s),
          softSkills: [...document.querySelectorAll('.s-skill-item')].map(i => i?.value || '').filter(s => s)
        };
      case 4:
        return {
          education: [...document.querySelectorAll('.education-item')].map(el => ({
            school: el.querySelector('.edu-school')?.value || '',
            degree: el.querySelector('.edu-degree')?.value || '',
            date: el.querySelector('.edu-date')?.value || ''
          }))
        };
      case 5: return { certifications: (document.querySelector('#field-certifications')?.value || '').split('\n').filter(b => b.trim()) };
      case 6:
        return {
          references: [...document.querySelectorAll('.reference-item')].map(el => ({
            name: el.querySelector('.ref-name')?.value || '',
            phone: el.querySelector('.ref-phone')?.value || '',
            relation: el.querySelector('.ref-relation')?.value || ''
          }))
        };
    }
  };

  saveBtn?.addEventListener('click', async () => {
    if (saveBtn.disabled) return;
    saveBtn.disabled = true;
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'GUARDANDO...';
    try {
      const stepData = getStepData();
      onSave(stepData);
    } catch (err) {
      console.error('Error al guardar el paso:', err);
      // Avanzar al siguiente paso en caso de error crítico para evitar congelamientos
      onSkip();
    } finally {
      // Reactivar después de 1 segundo para evitar clics repetidos rápidos
      setTimeout(() => {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = originalText;
        }
      }, 1000);
    }
  });
  prevBtn?.addEventListener('click', () => {
    try {
      if (onAutoSave) onAutoSave(getStepData());
    } catch (e) {}
    onPrev();
  });
  homeBtn?.addEventListener('click', () => {
    try {
      if (onAutoSave) onAutoSave(getStepData());
    } catch (e) { }
    onHome();
  });

  // Sistema de Autoguardado Inteligente Debounceado
  let autoSaveTimeout = null;
  const mainContent = document.querySelector('.main-content');
  const indicator = document.querySelector('#autosave-indicator');

  if (mainContent && onAutoSave) {
    const triggerAutoSave = () => {
      // FIX CRÍTICO: Prevenir pérdida de datos si el timeout se dispara cuando el paso ya fue reemplazado
      if (!document.body.contains(mainContent)) return;

      if (indicator) {
        indicator.innerHTML = '⚡ Guardando cambios...';
        indicator.style.opacity = '0.9';
      }
      try {
        const stepData = getStepData();
        onAutoSave(stepData);
        if (indicator) {
          indicator.innerHTML = '✓ Guardado automáticamente';
          setTimeout(() => {
            if (indicator && document.body.contains(mainContent)) indicator.style.opacity = '0.4';
          }, 2000);
        }
      } catch (err) {
        console.error('Error en autoguardado:', err);
      }
    };

    mainContent.addEventListener('input', (e) => {
      // Ignorar si el cambio fue en un campo que no queremos guardar por cada tecla
      if (e.target.type === 'file') return;

      if (indicator) {
        indicator.innerHTML = '🔄 Escribiendo...';
        indicator.style.opacity = '0.9';
      }
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(triggerAutoSave, 1500); // 1.5s después de que deja de escribir
    });

    mainContent.addEventListener('change', (e) => {
      // Para selects, checkboxes y otros controles de cambio de estado directo, guardar más rápido
      clearTimeout(autoSaveTimeout);
      triggerAutoSave();
    });

    // Save immediately if the user attempts to leave the page or switches tabs
    const flushAutoSave = () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
        triggerAutoSave();
      }
    };

    window.addEventListener('beforeunload', flushAutoSave);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flushAutoSave();
      }
    });

    // Ensure we clean up listeners if needed, though this view is overwritten in innerHTML
    // it is best practice to avoid multiple bindings, but since it's an SPA and visibilitychange 
    // is on document, we should ideally remove it, but for a simple fix this works well.
  }
};

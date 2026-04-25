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
          <input type="text" id="field-title" class="input-field" value="${data.title || ''}" placeholder="Ej:Tu Titulo Obtenido">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; width: 100%;">
           <div class="input-group"><label>Teléfono</label><input type="text" id="field-phone" class="input-field" value="${data.phone || ''}"></div>
           <div class="input-group"><label>LinkedIn</label><input type="text" id="field-linkedin" class="input-field" value="${data.links?.linkedin || ''}"></div>
        </div>
        <div class="input-group">
          <label>Ciudad y Sector de Residencia</label>
          <input type="text" id="field-location" class="input-field" value="${data.location || ''}" placeholder="Ej: Quito, Sector La Carolina">
        </div>
      `;
      break;

    case 1:
      stepContent = `
        <div class="input-group">
          <label>Resumen Profesional (La IA lo complementará)</label>
          <textarea id="field-summary" class="input-field" style="min-height: 150px; resize: vertical;">${data.summary || ''}</textarea>
        </div>
      `;
      break;

    case 2:
      const exp = (data.experience && data.experience.length > 0) ? data.experience : [{}];
      stepContent = `
        <div id="experience-list" style="width: 100%;">
          ${exp.map((item, idx) => `
            <div class="experience-item glass" style="padding: 1rem; margin-bottom: 1rem; border-left: 3px solid var(--primary); box-sizing: border-box; width: 100%; position: relative;">
              <button type="button" class="delete-item-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.8rem; font-weight: bold;">[ &times; ]</button>
              <div class="input-group"><label>Empresa</label><input type="text" class="input-field exp-company" value="${item.company || ''}"></div>
              <div class="input-group"><label>Cargo</label><input type="text" class="input-field exp-role" value="${item.role || ''}"></div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;">
                <div class="input-group"><label>Teléfono Empresa</label><input type="text" class="input-field exp-phone" value="${item.companyPhone || ''}" placeholder="Ej: 04-2345678"></div>
                <div class="input-group"><label>Jefe / RRHH <span style='color:var(--text-dim);font-size:0.65rem;'>(Opcional)</span></label><input type="text" class="input-field exp-supervisor" value="${item.supervisor || ''}" placeholder="Ej: María Torres"></div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem;">
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

              <div class="input-group"><label>Logros</label><textarea class="input-field exp-achievements" style="min-height: 80px; resize: vertical;" placeholder="Ej: Incrementé ventas...">${(item.bullets || []).join('\n')}</textarea></div>
            </div>
          `).join('')}
        </div>
        <button id="add-experience-btn" class="glass" style="width: 100%; padding: 0.6rem; border-color: var(--primary); color: var(--primary); font-size: 0.75rem; font-weight: bold;">+ AÑADIR EXPERIENCIA</button>
      `;
      break;

    case 3:
      const hSkills = (data.hardSkills && data.hardSkills.length > 0) ? data.hardSkills : [''];
      const sSkills = (data.softSkills && data.softSkills.length > 0) ? data.softSkills : [''];
      stepContent = `
        <div class="input-group">
          <label>Habilidades Técnicas</label>
          <div id="h-skills-list" style="width: 100%;">${hSkills.map(s => `
            <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.4rem;">
              <input type="text" class="input-field h-skill-item" value="${s}" style="margin-bottom: 0;" placeholder="Ej: Excel Avanzado">
              <button type="button" class="delete-item-btn" style="background: none; border: none; color: #f87171; cursor: pointer;">&times;</button>
            </div>`).join('')}</div>
          <button id="add-h-skill-btn" class="glass" style="font-size: 0.65rem; padding: 0.3rem 0.8rem; border-color: var(--primary); align-self: flex-start;">+ añadir</button>
        </div>
        <div class="input-group" style="margin-top: 1.5rem;">
          <label>Habilidades Blandas</label>
          <div id="s-skills-list" style="width: 100%;">${sSkills.map(s => `
            <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.4rem;">
              <input type="text" class="input-field s-skill-item" value="${s}" style="margin-bottom: 0;" placeholder="Ej: Comunicación asertiva">
              <button type="button" class="delete-item-btn" style="background: none; border: none; color: #f87171; cursor: pointer;">&times;</button>
            </div>`).join('')}</div>
          <button id="add-s-skill-btn" class="glass" style="font-size: 0.65rem; padding: 0.3rem 0.8rem; border-color: #4ade80; align-self: flex-start;">+ añadir</button>
        </div>
      `;
      break;

    case 4:
      const edu = (data.education && data.education.length > 0) ? data.education : [{}];
      stepContent = `
         <div id="education-list" style="width: 100%;">
           ${edu.map(item => `
             <div class="education-item glass" style="padding: 1rem; margin-bottom: 1rem; border-left: 3px solid #4ade80; box-sizing: border-box; width: 100%; position: relative;">
               <button type="button" class="delete-item-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.8rem; font-weight: bold;">[ &times; ]</button>
               <div class="input-group"><label>Institución</label><input type="text" class="input-field edu-school" value="${item.school || ''}"></div>
               <div class="input-group"><label>Título Obtenido</label><input type="text" class="input-field edu-degree" value="${item.degree || ''}"></div>
               <div class="input-group"><label>Año de Graduación</label><input type="text" class="input-field edu-date" value="${item.date || ''}"></div>
             </div>
           `).join('')}
         </div>
         <button id="add-education-btn" class="glass" style="width: 100%; padding: 0.6rem; border-color: #4ade80; color: #4ade80; font-size: 0.75rem; font-weight: bold; margin-top: 0.5rem;">+ AÑADIR EDUCACIÓN</button>
       `;
      break;

    case 5:
      stepContent = `
        <div class="input-group">
          <label>Certificaciones y Logros Adicionales</label>
          <textarea id="field-certifications" class="input-field" style="min-height: 180px; resize: vertical;" placeholder="Ej: Inglés B2...">${(data.certifications || []).join('\n')}</textarea>
        </div>
      `;
      break;

    case 6:
      const refs = (data.references && data.references.length > 0) ? data.references : [{}];
      stepContent = `
        <div id="references-list" style="width: 100%;">
          ${refs.map(item => `
            <div class="reference-item glass" style="padding: 1rem; margin-bottom: 1rem; border-left: 3px solid #c5a059; box-sizing: border-box; width: 100%; position: relative;">
              <button type="button" class="delete-item-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.8rem; font-weight: bold;">[ &times; ]</button>
              <div class="input-group"><label>Nombre Completo</label><input type="text" class="input-field ref-name" value="${item.name || ''}"></div>
              <div class="input-group"><label>Teléfono</label><input type="text" class="input-field ref-phone" value="${item.phone || ''}"></div>
              <div class="input-group"><label>Relación</label><input type="text" class="input-field ref-relation" value="${item.relation || ''}" placeholder="Ej: Ex Jefe..."></div>
            </div>
          `).join('')}
        </div>
        <button id="add-reference-btn" class="glass" style="width: 100%; padding: 0.6rem; border-color: #c5a059; color: #c5a059; font-size: 0.75rem; font-weight: bold;">+ AÑADIR OTRA REFERENCIA</button>
      `;
      break;
  }

  return `
    <div class="animate-fade main-content">
      <header style="margin-bottom: 1.5rem; text-align: center;">
        <h2 style="color: var(--primary); font-size: 1.1rem; font-weight: 400; letter-spacing: 1px; text-transform: uppercase;">Paso ${step + 1}: ${currentStep.title}</h2>
        <p style="color: var(--text-dim); font-size: 0.75rem; margin: 0.3rem auto; line-height: 1.4;">${currentStep.desc}</p>
      </header>

      <div style="margin-bottom: 1.5rem; width: 100%;">${stepContent}</div>

      <div style="display: flex; gap: 0.6rem; padding-bottom: 4rem;">
        <button id="home-btn" class="glass" style="padding: 0.6rem; flex: 1; font-size: 0.7rem; font-weight: bold;">CERRAR</button>
        ${step > 0 ? `<button id="prev-step-btn" class="glass" style="padding: 0.6rem; flex: 1; font-size: 0.7rem; font-weight: bold;">VOLVER</button>` : ''}
        <button id="save-btn" class="btn-primary" style="flex: 2; font-size: 0.75rem; font-weight: bold;">CONTINUAR</button>
      </div>
    </div>
  `;
};

export const attachQuestionnaireListeners = (data, step, onSave, onSkip, onPrev, onHome) => {
  const saveBtn = document.querySelector('#save-btn');
  const prevBtn = document.querySelector('#prev-step-btn');
  const homeBtn = document.querySelector('#home-btn');
  const photoInput = document.querySelector('#photo-input');

  let photoBase64 = null;

  photoInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        photoBase64 = ev.target.result;
        document.querySelector('#photo-preview').innerHTML = `<img src="${photoBase64}" style="width: 100%; height: 100%; object-fit: cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  // General Delete Logic
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-item-btn')) {
      const parent = e.target.closest('.experience-item, .reference-item, .education-item') || e.target.parentElement;
      parent.remove();
    }
  });

  const attachListlogic = (btnId, listId, placeholder, className) => {
    document.querySelector(`#${btnId}`)?.addEventListener('click', () => {
      const container = document.createElement('div');
      container.style.cssText = 'display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.4rem;';
      container.innerHTML = `
        <input type="text" class="input-field ${className}" placeholder="${placeholder}" style="margin-bottom: 0;">
        <button type="button" class="delete-item-btn" style="background: none; border: none; color: #f87171; cursor: pointer;">&times;</button>
      `;
      document.querySelector(`#${listId}`).appendChild(container);
    });
  };

  attachListlogic('add-h-skill-btn', 'h-skills-list', 'Ej: Excel Avanzado', 'h-skill-item');
  attachListlogic('add-s-skill-btn', 's-skills-list', 'Ej: Liderazgo', 's-skill-item');

  document.querySelector('#add-experience-btn')?.addEventListener('click', () => {
    const list = document.querySelector('#experience-list');
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const years = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);
    const monthOpts = months.map(m => `<option value="${m}">${m}</option>`).join('');
    const yearOpts = years.map(y => `<option value="${y}">${y}</option>`).join('');

    const item = document.createElement('div');
    item.className = 'experience-item glass animate-fade';
    item.style.cssText = 'padding: 1rem; margin-bottom: 1rem; border-left: 3px solid var(--primary); box-sizing: border-box; width: 100%; position: relative;';
    item.innerHTML = `
        <button type="button" class="delete-item-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.8rem; font-weight: bold;">[ &times; ]</button>
        <div class="input-group"><label>Empresa</label><input type="text" class="input-field exp-company"></div>
        <div class="input-group"><label>Cargo</label><input type="text" class="input-field exp-role"></div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;">
          <div class="input-group"><label>Teléfono Empresa</label><input type="text" class="input-field exp-phone" placeholder="Ej: 04-2345678"></div>
          <div class="input-group"><label>Jefe / RRHH <span style="color:var(--text-dim);font-size:0.65rem;">(Opcional)</span></label><input type="text" class="input-field exp-supervisor" placeholder="Ej: María Torres"></div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem;">
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

        <div class="input-group"><label>Logros</label><textarea class="input-field exp-achievements" style="min-height: 60px;" placeholder="Ej: Incrementé ventas..."></textarea></div>
      `;

    // Attach checkbox toggle for the new block
    item.querySelector('.exp-current').addEventListener('change', (e) => {
      const container = item.querySelector('.end-date-container');
      container.style.opacity = e.target.checked ? '0.3' : '1';
      container.style.pointerEvents = e.target.checked ? 'none' : 'all';
    });

    list.appendChild(item);
  });

  document.querySelector('#add-education-btn')?.addEventListener('click', () => {
    const list = document.querySelector('#education-list');
    const item = document.createElement('div');
    item.className = 'education-item glass animate-fade';
    item.style.cssText = 'padding: 1rem; margin-bottom: 1rem; border-left: 3px solid #4ade80; box-sizing: border-box; width: 100%; position: relative;';
    item.innerHTML = `
      <button type="button" class="delete-item-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.8rem; font-weight: bold;">[ &times; ]</button>
      <div class="input-group"><label>Institución</label><input type="text" class="input-field edu-school"></div>
      <div class="input-group"><label>Título Obtenido</label><input type="text" class="input-field edu-degree"></div>
      <div class="input-group"><label>Año de Graduación</label><input type="text" class="input-field edu-date"></div>
    `;
    list.appendChild(item);
  });

  document.querySelector('#add-reference-btn')?.addEventListener('click', () => {
    const list = document.querySelector('#references-list');
    const item = document.createElement('div');
    item.className = 'reference-item glass animate-fade';
    item.style.cssText = 'padding: 1rem; margin-bottom: 1rem; border-left: 3px solid #c5a059;  box-sizing: border-box; width: 100%; position: relative;';
    item.innerHTML = `
        <button type="button" class="delete-item-btn" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.8rem; font-weight: bold;">[ &times; ]</button>
        <div class="input-group"><label>Nombre Completo</label><input type="text" class="input-field ref-name"></div>
        <div class="input-group"><label>Teléfono</label><input type="text" class="input-field ref-phone"></div>
        <div class="input-group"><label>Relación</label><input type="text" class="input-field ref-relation"></div>
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

  const getStepData = () => {
    switch (step) {
      case 0: return {
        title: document.querySelector('#field-title').value,
        phone: document.querySelector('#field-phone').value,
        links: { linkedin: document.querySelector('#field-linkedin').value },
        photoUrl: photoBase64 || data.photoUrl || null
      };
      case 1: return { summary: document.querySelector('#field-summary').value };
      case 2:
        return {
          experience: [...document.querySelectorAll('.experience-item')].map(el => {
            const isCurrent = el.querySelector('.exp-current')?.checked || false;
            const startM = el.querySelector('.exp-start-month')?.value || '';
            const startY = el.querySelector('.exp-start-year')?.value || '';
            const endM = el.querySelector('.exp-end-month')?.value || '';
            const endY = el.querySelector('.exp-end-year')?.value || '';
            return {
              company: el.querySelector('.exp-company').value,
              role: el.querySelector('.exp-role').value,
              companyPhone: el.querySelector('.exp-phone')?.value || '',
              supervisor: el.querySelector('.exp-supervisor')?.value || '',
              startMonth: startM, startYear: startY, endMonth: endM, endYear: endY,
              isCurrent: isCurrent,
              date: `${startM} ${startY} - ${isCurrent ? 'Presente' : `${endM} ${endY}`}`,
              bullets: el.querySelector('.exp-achievements').value.split('\n').filter(b => b.trim())
            }
          })
        };
      case 3:
        return {
          hardSkills: [...document.querySelectorAll('.h-skill-item')].map(i => i.value).filter(s => s),
          softSkills: [...document.querySelectorAll('.s-skill-item')].map(i => i.value).filter(s => s)
        };
      case 4:
        return {
          education: [...document.querySelectorAll('.education-item')].map(el => ({
            school: el.querySelector('.edu-school').value,
            degree: el.querySelector('.edu-degree').value,
            date: el.querySelector('.edu-date').value
          }))
        };
      case 5: return { certifications: document.querySelector('#field-certifications').value.split('\n').filter(b => b.trim()) };
      case 6:
        return {
          references: [...document.querySelectorAll('.reference-item')].map(el => ({
            name: el.querySelector('.ref-name').value,
            phone: el.querySelector('.ref-phone').value,
            relation: el.querySelector('.ref-relation').value
          }))
        };
    }
  };

  saveBtn?.addEventListener('click', async () => onSave(getStepData()));
  prevBtn?.addEventListener('click', onPrev);
  homeBtn?.addEventListener('click', onHome);
};

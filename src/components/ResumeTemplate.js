/**
 * Professional Resume Template Engine - ATS & Photo Standardized Edition
 * Strictly A4 (21x29.7cm), Standardized 3x4cm Photos, ATS optimized structure.
 */
export const ResumeTemplate = (data, theme = 'modern-sidebar') => {
  const { 
    fullName = '', email = '', photoUrl = '', title = '', phone = '', 
    location = '', cedula = '', links = { linkedin: '' }, summary = '', 
    experience = [], education = [], hardSkills = [], 
    softSkills = [], languages = [], certifications = [], 
    references = [] 
  } = data;

  const themes = {
    'executive-navy': { font: "'Lora', serif", accent: "#0f172a", bg: "#ffffff", layout: 'standard' },
    'tech-minimal': { font: "'Inter', sans-serif", accent: "#22c55e", bg: "#fefefe", layout: 'minimal' },
    'modern-sidebar': { font: "'Inter', sans-serif", accent: "#1e3a8a", bg: "#ffffff", layout: 'sidebar' },
    'harvard-classic': { font: "'Lora', serif", accent: "#000000", bg: "#ffffff", layout: 'harvard' },
    'harvard-navy': { font: "'Lora', serif", accent: "#0a192f", bg: "#ffffff", layout: 'harvard' },
    'startup-modern': { font: "'Inter', sans-serif", accent: "#3b82f6", bg: "#ffffff", layout: 'startup' },
    'creative-exec': { font: "'Playfair Display', serif", accent: "#1a1a1a", bg: "#ffffff", layout: 'sidebar', isCreative: true }
  };

  const currentTheme = themes[theme] || themes['modern-sidebar'];

  // Global A4 Wrapper Style (ATS Compliant)
  const a4Style = `
    width: 21cm; min-height: 28.7cm; padding: 1.2cm; margin: 0 auto; 
    box-sizing: border-box; background: ${currentTheme.bg || '#fff'}; 
    font-family: ${currentTheme.font}; color: #1a1a1a;
    line-height: 1.4; position: relative; text-align: left;
    -webkit-text-size-adjust: 100%; text-size-adjust: 100%;
  `;

  // Standardized Photo Style (3x4 cm)
  const photoSizeStyle = `width: 3cm; height: 4cm; object-fit: cover; border: 1px solid #ddd; padding: 2px; border-radius: 4px;`;

  // Helper: Section Headers (ATS Friendly)
  const sectionTitle = (txt) => `
    <h2 style="font-size: 1rem; text-transform: uppercase; color: ${currentTheme.accent}; border-bottom: 2px solid ${currentTheme.accent}; padding-bottom: 0.1rem; margin-top: 1.5rem; margin-bottom: 0.8rem; font-weight: 700;">${txt}</h2>
  `;

  const renderRefs = (refs) => {
    if (!refs || refs.length === 0) return '';
    return `
      ${sectionTitle("Referencias")}
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; page-break-inside: avoid; break-inside: avoid;">
        ${refs.map(ref => `<p style="flex: 1; min-width: 45%; font-size: 0.85rem; margin: 0; page-break-inside: avoid; break-inside: avoid;"><strong>${ref.name}</strong> (${ref.relation})<br>${ref.phone}</p>`).join('')}
      </div>
    `;
  };

  const renderCerts = (certs) => {
    if (!certs || certs.length === 0) return '';
    return `
      ${sectionTitle("Certificaciones y Proyectos")}
      <ul style="padding-left: 1.2rem; font-size: 0.85rem; margin-top: 0.5rem; page-break-inside: avoid; break-inside: avoid;">
        ${certs.map(item => `<li style="margin-bottom: 0.2rem; page-break-inside: avoid; break-inside: avoid;">${item}</li>`).join('')}
      </ul>
    `;
  };

  // --- Layout: STANDARD (Classic Executive) ---
  if (currentTheme.layout === 'standard') {
    return `
      <div id="resume-document" style="${a4Style}">
        <header style="display: flex; gap: 2rem; align-items: flex-start; margin-bottom: 1.5rem;">
           ${photoUrl ? `<img src="${photoUrl}" style="${photoSizeStyle}">` : ''}
           <div style="flex-grow: 1;">
              <h1 style="margin: 0; font-size: 2.2rem; color: ${currentTheme.accent};">${fullName}</h1>
              <p style="margin: 0.3rem 0; font-size: 1.2rem; font-weight: 600; color: #444;">${title}</p>
              <div style="font-size: 0.85rem; color: #666; display: flex; flex-wrap: wrap; gap: 0.8rem;">
                <span style="white-space: nowrap;">${email}</span> | <span style="white-space: nowrap;">${phone}</span> | <span style="white-space: nowrap;">C.I. ${cedula}</span> | <span style="white-space: nowrap;">${location}</span>
              </div>
           </div>
        </header>
        ${sectionTitle("Perfil Profesional")}
        <p style="text-align: justify; font-size: 0.9rem;">${summary}</p>
        
        ${sectionTitle("Experiencia Laboral")}
        ${experience.map(exp => `
          <div style="margin-bottom: 1rem; page-break-inside: avoid; break-inside: avoid; display: block;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 0.95rem;">
              <span>${exp.role} - ${exp.company}</span>
              <span style="font-size: 0.85rem; color: #666;">${exp.date}</span>
            </div>
            ${exp.companyPhone || exp.supervisor ? `<div style="font-size: 0.78rem; color: #888; margin: 0.1rem 0; font-style: italic;">${exp.companyPhone ? '📞 ' + exp.companyPhone : ''}${exp.companyPhone && exp.supervisor ? '  ·  ' : ''}${exp.supervisor ? 'Ref: ' + exp.supervisor : ''}</div>` : ''}
            <ul style="margin: 0.3rem 0; padding-left: 1.2rem; font-size: 0.85rem;">${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul>
          </div>
        `).join('')}

        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2rem; page-break-inside: avoid; break-inside: avoid;">
          <section style="flex: 1; min-width: 45%; page-break-inside: avoid; break-inside: avoid;">${sectionTitle("Educación")}${education.map(edu => `<p style="font-size: 0.85rem; margin-bottom: 0.4rem; page-break-inside: avoid; break-inside: avoid;"><strong>${edu.degree}</strong><br>${edu.school} (${edu.date})</p>`).join('')}</section>
          <section style="flex: 1; min-width: 45%; page-break-inside: avoid; break-inside: avoid;">${sectionTitle("Habilidades")}<p style="font-size: 0.85rem;"><strong>Técnicas:</strong> ${hardSkills.join(', ')}</p><p style="font-size: 0.85rem; margin-top: 0.3rem;"><strong>Blandas:</strong> ${softSkills.join(', ')}</p></section>
        </div>
        ${renderCerts(certifications)}
        ${renderRefs(references)}
      </div>
    `;
  }

  // --- Layout: MINIMAL (Modern Left Aligned) ---
  if (currentTheme.layout === 'minimal') {
    const a4Minimal = `width: 21cm; min-height: 28.7cm; padding: 1cm; margin: 0 auto; box-sizing: border-box; background: ${currentTheme.bg || '#fff'}; font-family: ${currentTheme.font}; color: #1a1a1a; line-height: 1.35; position: relative; text-align: left; -webkit-text-size-adjust: 100%; text-size-adjust: 100%;`;
    const secTitle = (txt) => `<h2 style="font-size: 0.9rem; text-transform: uppercase; color: ${currentTheme.accent}; border-bottom: 2px solid ${currentTheme.accent}; padding-bottom: 0.1rem; margin-top: 0.9rem; margin-bottom: 0.5rem; font-weight: 700;">${txt}</h2>`;
    return `
      <div id="resume-document" style="${a4Minimal}">
        <header style="margin-bottom: 1.2rem; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <h1 style="margin: 0; font-size: 2.2rem; font-weight: 300; letter-spacing: 1px;">${fullName.toUpperCase()}</h1>
            <p style="margin: 0.25rem 0; font-size: 1rem; color: ${currentTheme.accent}; font-weight: 600;">${title}</p>
            <div style="font-size: 0.78rem; color: #777;"><span style="white-space: nowrap;">${email}</span> &bull; <span style="white-space: nowrap;">${phone}</span> &bull; <span style="white-space: nowrap;">C.I. ${cedula}</span> &bull; <span style="white-space: nowrap;">${location}</span></div>
          </div>
          ${photoUrl ? `<img src="${photoUrl}" style="${photoSizeStyle}">` : ''}
        </header>

        <section style="margin-bottom: 0.8rem; page-break-inside: avoid;"><p style="text-align: justify; font-size: 0.85rem; border-left: 3px solid ${currentTheme.accent}; padding-left: 0.8rem; margin: 0;">${summary}</p></section>

        ${secTitle('Experiencia')}
        ${experience.map(exp => `
          <div style="margin-bottom: 0.85rem; page-break-inside: avoid; break-inside: avoid; display: block;">
            <div style="font-weight: bold; font-size: 0.95rem;">${exp.role} <span style="font-weight:normal; color:#999; font-size:0.8rem; margin-left:0.8rem;">${exp.date}</span></div>
            <div style="color: ${currentTheme.accent}; font-size: 0.85rem; margin-bottom: 0.1rem;">${exp.company}</div>
            ${exp.companyPhone || exp.supervisor ? `<div style="font-size: 0.75rem; color: #888; font-style: italic; margin-bottom: 0.1rem;">${exp.companyPhone ? '&#128222; ' + exp.companyPhone : ''}${exp.companyPhone && exp.supervisor ? '  &middot;  ' : ''}${exp.supervisor ? 'Ref: ' + exp.supervisor : ''}</div>` : ''}
            <ul style="padding-left: 1rem; font-size: 0.82rem; color: #444; margin: 0.2rem 0 0;">${(exp.bullets || []).map(b => `<li style="margin-bottom: 0.05rem;">${b}</li>`).join('')}</ul>
          </div>
        `).join('')}

        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1.2rem; margin-top: 0.5rem; page-break-inside: avoid; break-inside: avoid;">
          <section style="flex: 1; min-width: 30%; page-break-inside: avoid; break-inside: avoid;">${secTitle('Educación')}${education.map(edu => `<p style="font-size: 0.8rem; margin-bottom: 0.3rem;"><strong>${edu.school}</strong><br>${edu.degree}${edu.date ? `<br><span style="color:${currentTheme.accent};font-size:0.73rem;">${edu.date}</span>` : ''}</p>`).join('')}</section>
          <section style="flex: 1; min-width: 30%; page-break-inside: avoid; break-inside: avoid;">${secTitle('Habilidades')}<div style="font-size: 0.8rem; line-height: 1.6;">${hardSkills.map(s => `&bull; ${s}`).join('<br>')}</div></section>
          <section style="flex: 1; min-width: 30%; page-break-inside: avoid; break-inside: avoid;">${secTitle('Referencias')}${(references || []).map(ref => `<p style="font-size: 0.78rem; margin: 0 0 0.4rem;"><strong>${ref.name}</strong><br><span style="color:#555;">${ref.relation}</span><br>${ref.phone}</p>`).join('')}</section>
        </div>
        ${renderCerts(certifications)}
      </div>
    `;
  }

  // --- Layout: HARVARD (Strict - No Photo) ---
  if (currentTheme.layout === 'harvard') {
    return `
      <div id="resume-document" style="${a4Style}">
        <header style="text-align: center; border-bottom: 2px solid ${currentTheme.accent}; padding-bottom: 1rem; margin-bottom: 1rem;">
          <h1 style="margin: 0; font-size: 2.5rem; text-transform: uppercase; color: ${currentTheme.accent};">${fullName}</h1>
          <div style="font-size: 0.9rem; margin-top: 0.5rem;"><span style="white-space: nowrap;">C.I. ${cedula}</span> | <span style="white-space: nowrap;">${location}</span> | <span style="white-space: nowrap;">${phone}</span> | <span style="white-space: nowrap;">${email}</span></div>
        </header>
        <section style="margin-top: 1.2rem;"><h2 style="font-size: 0.95rem; text-transform: uppercase; border-bottom: 1.5px solid ${currentTheme.accent}; color: ${currentTheme.accent}; padding-bottom: 0.1rem; margin-bottom: 0.4rem; font-weight: bold;">Educación</h2>
          ${education.map(edu => `<div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: bold;"><span>${edu.school.toUpperCase()}</span><span>${edu.date}</span></div><div style="font-size: 0.9rem; font-style: italic;">${edu.degree}</div>`).join('')}
        </section>
        <section style="margin-top: 1.2rem;"><h2 style="font-size: 0.95rem; text-transform: uppercase; border-bottom: 1.5px solid ${currentTheme.accent}; color: ${currentTheme.accent}; padding-bottom: 0.1rem; margin-bottom: 0.4rem; font-weight: bold;">Experiencia Profesional</h2>
          ${experience.map(exp => `
            <div style="margin-bottom: 0.8rem; page-break-inside: avoid; break-inside: avoid; display: block;">
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 0.9rem;"><span>${exp.company.toUpperCase()}</span><span>${exp.date}</span></div>
              <div style="font-style: italic; font-size: 0.85rem; margin-bottom: 0.1rem;">${exp.role}</div>
              ${exp.companyPhone || exp.supervisor ? `<div style="font-size: 0.78rem; color: #666; margin-bottom: 0.1rem; font-style: italic;">${exp.companyPhone ? '📞 ' + exp.companyPhone : ''}${exp.companyPhone && exp.supervisor ? '  ·  ' : ''}${exp.supervisor ? 'Ref: ' + exp.supervisor : ''}</div>` : ''}
              <ul style="margin: 0.2rem 0; padding-left: 1.2rem; font-size: 0.85rem;">${(exp.bullets || []).map(b => `<li style="margin-bottom: 0.05rem;">${b}</li>`).join('')}</ul>
            </div>
          `).join('')}
        </section>
        <section style="margin-top: 1.2rem; page-break-inside: avoid; break-inside: avoid; display: block;"><h2 style="font-size: 0.95rem; text-transform: uppercase; border-bottom: 1.5px solid ${currentTheme.accent}; color: ${currentTheme.accent}; padding-bottom: 0.1rem; margin-bottom: 0.4rem; font-weight: bold;">Habilidades</h2><p style="font-size: 0.9rem;">${hardSkills.join(' • ')}</p></section>
        <div style="page-break-inside: avoid; break-inside: avoid; display: block;">
          ${renderCerts(certifications)}
          ${renderRefs(references)}
        </div>
      </div>
    `;
  }

  // --- Layout: STARTUP PRO (Modern full-width, bold accent) ---
  if (currentTheme.layout === 'startup') {
    const a4Startup = `width: 21cm; min-height: 28.7cm; padding: 1cm; margin: 0 auto; box-sizing: border-box; background: ${currentTheme.bg || '#fff'}; font-family: ${currentTheme.font}; color: #1a1a1a; line-height: 1.35; position: relative; text-align: left; -webkit-text-size-adjust: 100%; text-size-adjust: 100%;`;
    const secTitle2 = (txt) => `<h2 style="font-size: 0.88rem; text-transform: uppercase; color: ${currentTheme.accent}; border-bottom: 2px solid ${currentTheme.accent}; padding-bottom: 0.1rem; margin-top: 0.9rem; margin-bottom: 0.45rem; font-weight: 700;">${txt}</h2>`;
    return `
      <div id="resume-document" style="${a4Startup}">
        <!-- Header: Bold accent strip -->
        <header style="border-left: 5px solid ${currentTheme.accent}; padding-left: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: flex-start; page-break-inside: avoid;">
          <div>
            <h1 style="margin: 0; font-size: 2rem; font-weight: 800; color: #111; letter-spacing: -0.5px;">${fullName}</h1>
            <p style="margin: 0.15rem 0 0.4rem; font-size: 1rem; color: ${currentTheme.accent}; font-weight: 600; letter-spacing: 0.3px;">${title}</p>
            <div style="font-size: 0.78rem; color: #666; display: flex; flex-wrap: wrap; gap: 0.8rem;">
              <span style="white-space: nowrap;">&#9993; ${email}</span>
              <span style="white-space: nowrap;">&#128222; ${phone}</span>
              <span style="white-space: nowrap;">&#127380; C.I. ${cedula}</span>
              <span style="white-space: nowrap;">&#128205; ${location}</span>
              ${links.linkedin ? `<span style="white-space: nowrap;">&#128279; ${links.linkedin}</span>` : ''}
            </div>
          </div>
          ${photoUrl ? `<img src="${photoUrl}" style="${photoSizeStyle} margin-left: 0.8rem;">` : ''}
        </header>

        <!-- Summary -->
        <div style="background: #f0f5ff; border-radius: 5px; padding: 0.55rem 0.8rem; margin-bottom: 0.9rem; border: 1px solid ${currentTheme.accent}20; page-break-inside: avoid;">
          <p style="margin: 0; font-size: 0.83rem; color: #333; line-height: 1.5;">${summary}</p>
        </div>

        <!-- Experience -->
        ${secTitle2('Experiencia Profesional')}
        ${experience.map(exp => `
          <div style="margin-bottom: 0.75rem; padding-bottom: 0.6rem; border-bottom: 1px solid #eef0f5; page-break-inside: avoid; break-inside: avoid; display: block;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-weight: 700; font-size: 0.9rem; color: ${currentTheme.accent};">${exp.company}</span>
              <span style="font-size: 0.74rem; color: #999; white-space: nowrap; margin-left: 0.8rem;">${exp.date}</span>
            </div>
            <div style="font-size: 0.85rem; font-weight: 600; color: #222; margin-bottom: 0.05rem;">${exp.role}</div>
            ${exp.companyPhone || exp.supervisor ? `<div style="font-size: 0.72rem; color: #aaa; font-style: italic; margin-bottom: 0.1rem;">${exp.companyPhone ? '&#128222; ' + exp.companyPhone : ''}${exp.companyPhone && exp.supervisor ? '  &middot;  ' : ''}${exp.supervisor ? 'Ref: ' + exp.supervisor : ''}</div>` : ''}
            <ul style="margin: 0.2rem 0 0; padding-left: 1.1rem; font-size: 0.8rem; color: #444;">${(exp.bullets || []).map(b => `<li style="margin-bottom: 0.1rem;">${b}</li>`).join('')}</ul>
          </div>
        `).join('')}

        <!-- 3-column bottom flex -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; margin-top: 0.6rem; page-break-inside: avoid; break-inside: avoid;">
          <section style="flex: 1; min-width: 30%; page-break-inside: avoid; break-inside: avoid;">
            ${secTitle2('Educación')}
            ${education.map(edu => `<p style="font-size: 0.78rem; margin-bottom: 0.4rem; page-break-inside: avoid; break-inside: avoid;"><strong>${edu.degree}</strong><br><span style="color: #666;">${edu.school}</span><br><span style="color: ${currentTheme.accent}; font-size: 0.72rem;">${edu.date}</span></p>`).join('')}
          </section>
          <section style="flex: 1; min-width: 30%; page-break-inside: avoid; break-inside: avoid;">
            ${secTitle2('Habilidades')}
            <div style="page-break-inside: avoid; break-inside: avoid;">${hardSkills.map(s => `<span style="display: inline-block; background: ${currentTheme.accent}12; border: 1px solid ${currentTheme.accent}35; color: ${currentTheme.accent}; padding: 0.1rem 0.4rem; border-radius: 3px; margin: 0.1rem; font-size: 0.72rem;">${s}</span>`).join('')}</div>
            <div style="margin-top: 0.3rem; page-break-inside: avoid; break-inside: avoid;">${softSkills.map(s => `<span style="display: inline-block; background: #f5f5f5; padding: 0.1rem 0.4rem; border-radius: 3px; margin: 0.1rem; font-size: 0.72rem; color: #555;">${s}</span>`).join('')}</div>
          </section>
          <section style="flex: 1; min-width: 30%; page-break-inside: avoid; break-inside: avoid;">
            ${secTitle2('Referencias')}
            ${(references || []).map(ref => `<p style="font-size: 0.78rem; margin: 0 0 0.4rem; page-break-inside: avoid; break-inside: avoid;"><strong>${ref.name}</strong><br><span style="color:#555;">${ref.relation}</span><br>${ref.phone}</p>`).join('')}
            ${secTitle2('Idiomas')}
            ${languages.map(l => `<p style="font-size: 0.78rem; margin: 0.1rem 0; page-break-inside: avoid; break-inside: avoid;">${l}</p>`).join('')}
          </section>
        </div>
        ${certifications && certifications.length > 0 ? renderCerts(certifications) : ''}
      </div>
    `;
  }

  // --- Layout: SIDEBAR (Modern & Creative) ---
  const isCreative = currentTheme.isCreative;
  const sidebarBg = isCreative ? '#f8fafc' : '#0f172a';
  const sidebarTextColor = isCreative ? '#1a1a1a' : 'white';
  
  return `
    <div id="resume-document" style="${a4Style} padding: 0; display: flex; background: linear-gradient(to right, ${sidebarBg} 35%, #ffffff 35%);">
      <aside style="width: 35%; background: transparent; color: ${sidebarTextColor}; padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 1.5rem;">
        <section><h3 style="font-size: 0.8rem; text-transform: uppercase; border-bottom: 1px solid ${isCreative?'#ddd':'#444'}; padding-bottom: 0.2rem; margin-bottom: 0.5rem;">Contacto</h3><p style="font-size: 0.75rem; line-height: 1.6; margin:0;"><span style="white-space: nowrap;">${email}</span><br><span style="white-space: nowrap;">${phone}</span><br><span style="white-space: nowrap;">C.I. ${cedula}</span><br><span style="white-space: nowrap;">${location}</span></p></section>
        <section><h3 style="font-size: 0.8rem; text-transform: uppercase; border-bottom: 1px solid ${isCreative?'#ddd':'#444'}; padding-bottom: 0.2rem; margin-bottom: 0.5rem;">Habilidades</h3><div style="font-size: 0.75rem; opacity: 0.9; line-height: 1.4;">${hardSkills.map(s => `<div style="margin-bottom:0.15rem;">• ${s}</div>`).join('')}</div></section>
        ${references && references.length > 0 ? `<section><h3 style="font-size: 0.8rem; text-transform: uppercase; border-bottom: 1px solid ${isCreative?'#ddd':'#444'}; padding-bottom: 0.2rem; margin-bottom: 0.5rem;">Referencias</h3>${references.map(ref => `<div style="font-size: 0.75rem; margin-bottom: 0.6rem; line-height: 1.3;"><strong style="color: ${isCreative?'#000':'#fff'}">${ref.name}</strong><br><span style="opacity:0.8;">${ref.relation}</span><br>${ref.phone}</div>`).join('')}</section>` : ''}
      </aside>
      <main style="flex-grow: 1; padding: 1.5rem; background: transparent;">
        <header style="margin-bottom: 1.8rem; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #eee; padding-bottom: 1.2rem;">
          <div style="flex-grow: 1; padding-right: 1rem;">
            <h1 style="margin: 0; font-size: 2.2rem; font-family:${isCreative?"'Playfair Display', serif":'inherit'}; line-height: 1.1;">${fullName}</h1>
            <p style="color: ${currentTheme.accent}; font-size: 1.1rem; font-weight: 600; margin-top: 0.4rem; margin-bottom: 0;">${title}</p>
          </div>
          ${photoUrl ? `<img src="${photoUrl}" style="${photoSizeStyle} border-color: ${currentTheme.accent};">` : ''}
        </header>
        <section style="margin-bottom: 1.5rem; page-break-inside: avoid; break-inside: avoid; display: block;"><h2 style="font-size: 0.9rem; text-transform: uppercase; color: #999; margin-bottom: 0.5rem;">Perfil</h2><p style="font-size: 0.85rem; text-align: justify; line-height: 1.5; margin: 0;">${summary}</p></section>
        <section><h2 style="font-size: 0.9rem; text-transform: uppercase; color: #999; margin-bottom: 0.8rem;">Trayectoria</h2>${experience.map(exp => `<div style="margin-bottom: 1.2rem; page-break-inside: avoid; break-inside: avoid; display: block;"><div style="font-weight: bold; display: flex; justify-content: space-between; font-size:0.95rem;"><span>${exp.company}</span><span style="color:#777; font-size:0.85rem;">${exp.date}</span></div><div style="color: ${currentTheme.accent}; font-size: 0.85rem; font-weight:600;">${exp.role}</div>${exp.companyPhone || exp.supervisor ? `<div style="font-size: 0.75rem; color: #999; font-style: italic; margin-top:0.1rem;">${exp.companyPhone ? '📞 ' + exp.companyPhone : ''}${exp.companyPhone && exp.supervisor ? '  ·  ' : ''}${exp.supervisor ? 'Ref: ' + exp.supervisor : ''}</div>` : ''}<ul style="font-size: 0.85rem; padding-left: 1.2rem; margin-top:0.3rem;">${(exp.bullets || []).map(b => `<li style="margin-bottom:0.1rem; page-break-inside: avoid; break-inside: avoid;">${b}</li>`).join('')}</ul></div>`).join('')}</section>
        ${renderCerts(certifications)}
      </main>
    </div>
  `;
};

/**
 * Admin Panel - Role Based Edition
 * Master and Admins can manage Staff, VIP, and correct locked user profiles.
 */
export const AdminPanelView = (users = [], currentUserRole = '') => {
  const isMaster = currentUserRole === 'master';

  return `
<div class="animate-fade">
  <!-- VIP Master Header -->
  <header style="
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 15px 16px;
    margin-bottom: 2rem;
    border-bottom: 1px solid rgba(197, 160, 89, 0.25);
    background: rgba(10, 11, 16, 0.6);
    backdrop-filter: blur(8px);
    border-radius: 10px;
  ">
    <!-- Centered Title -->
    <div style="text-align: center;">
      <h2 style="margin: 0; color: var(--primary); font-size: 1.2rem; letter-spacing: 3px; text-transform: uppercase; font-weight: 700;">
        ${isMaster ? '⚡ Panel de Control Master' : '🛡️ Panel de Gestión de Staff'}
      </h2>
      <p style="margin: 0.2rem 0 0; color: var(--text-dim); font-size: 0.75rem; letter-spacing: 1px;">
        Gestión de accesos VIP, roles y corrección de perfiles.
      </p>
    </div>
    <!-- Exit button — absolutely positioned to the right -->
    <button id="close-admin-btn" type="button" style="
      position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
      padding: 0.5rem 1rem; font-size: 0.8rem; font-weight: 600;
      background: rgba(60, 65, 80, 0.7); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px; color: #e0e0e0; cursor: pointer; white-space: nowrap;
    ">SALIR</button>
  </header>

  <!-- Search Filter -->
  <div style="margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: center;">
    <div class="input-group" style="flex: 1; margin-bottom: 0;">
      <div style="position: relative; display: flex; align-items: center;">
        <span style="position: absolute; left: 1rem; color: var(--text-dim); font-size: 0.9rem;">🔍</span>
        <input type="text" id="admin-search-input" class="input-field" placeholder="Buscar por nombre, correo o cédula..." style="padding-left: 2.5rem; margin-bottom: 0;">
      </div>
    </div>
    <div style="font-size: 0.75rem; color: var(--text-dim); white-space: nowrap;">
      Total: <span id="user-count">${users.length}</span> usuarios
    </div>
  </div>

  <!-- Edit Name Modal (hidden by default) -->
  <div id="edit-profile-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9000; place-items:center;" onclick="if(event.target===this)this.style.display='none';">
    <div class="glass" style="padding:2rem; border-radius:12px; width:90%; max-width:420px; border:1px solid rgba(197,160,89,0.3);">
      <h3 style="margin:0 0 0.3rem; color:var(--primary); font-size:1rem; letter-spacing:2px; text-transform:uppercase;">✏️ Corrección de Perfil</h3>
      <p style="color:var(--text-dim); font-size:0.72rem; margin-bottom:1.5rem;">Acción exclusiva de administración. El campo corrección queda registrado.</p>
      <input type="hidden" id="edit-uid">
      <div class="input-group">
        <label>Nombre Completo</label>
        <input type="text" id="edit-fullname" class="input-field" placeholder="Nombre corregido">
      </div>
      <div class="input-group">
        <label>Cédula</label>
        <input type="text" id="edit-cedula" class="input-field" placeholder="Número de cédula" maxlength="10" inputmode="numeric">
      </div>
      <div style="display:flex; gap:0.8rem; margin-top:1.5rem;">
        <button id="cancel-edit-btn" class="glass" style="flex:1; padding:0.6rem; font-size:0.8rem;">CANCELAR</button>
        <button id="confirm-edit-btn" class="btn-primary" style="flex:2; padding:0.6rem; font-size:0.8rem; font-weight:bold;">CONFIRMAR CORRECCIÓN</button>
      </div>
    </div>
  </div>

  <div class="glass" style="overflow: hidden;">
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 800px;">
        <thead>
          <tr style="background: rgba(255,255,255,0.05); color: var(--primary); font-size: 0.8rem; text-transform: uppercase;">
            <th style="padding: 1.5rem;">Nombre / Correo</th>
            <th style="padding: 1.5rem;">Estatus VIP</th>
            ${isMaster ? '<th style="padding: 1.5rem;">Rol / Permisos</th>' : ''}
            <th style="padding: 1.5rem; text-align: right;">Acciones</th>
          </tr>
        </thead>
        <tbody id="admin-table-body">
          ${users.length === 0 ? `
            <tr>
              <td colspan="${isMaster ? 4 : 3}" style="padding: 4rem; text-align: center;">
                <p style="color: var(--text-dim);">No se detectaron usuarios o acceso denegado.</p>
              </td>
            </tr>` : ''}
          ${users.map(u => {
            const userIsMasterAccount = u.email === 'ks_mvp@icloud.com';
            const isAdmin = u.role === 'admin' || userIsMasterAccount;
            const searchTerms = `${u.fullName || ''} ${u.email || ''} ${u.cedula || ''}`.toLowerCase();

            return `
            <tr class="user-row" data-search="${searchTerms}" style="border-bottom: 1px solid var(--border-glass);">
              <td style="padding: 1.2rem 1.5rem;">
                <div style="font-weight: 600;">${u.fullName || 'N/A'}</div>
                <div style="font-size: 0.75rem; color: var(--text-dim);">${u.email}</div>
                ${u.cedula ? `<div style="font-size: 0.7rem; color: var(--text-dim); opacity:0.6;">CI: ${u.cedula}</div>` : ''}
              </td>
              <td style="padding: 1.2rem 1.5rem;">
                 ${u.vip ? 
                   '<span style="color: #4ade80; background: rgba(74,222,128,0.1); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.7rem; border: 1px solid rgba(74,222,128,0.2);">VIP</span>' : 
                   (u.role === 'partner' ? 
                    `<span style="color: #c5a059; background: rgba(197,160,89,0.1); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.7rem; border: 1px solid rgba(197,160,89,0.2);">SOCIO (${Math.ceil((new Date(u.subExpires) - new Date()) / (1000*60*60*24))}d)</span>` :
                    '<span style="color: var(--text-dim); font-size: 0.7rem;">Estándar</span>'
                   )
                 }
              </td>
              ${isMaster ? `
                <td style="padding: 1.2rem 1.5rem;">
                  <span style="font-size: 0.75rem; color: ${isAdmin ? 'var(--primary)' : 'var(--text-dim)'}; font-weight: bold;">
                    ${userIsMasterAccount ? 'MASTER' : (isAdmin ? 'ADMINISTRADOR' : 'USUARIO')}
                  </span>
                </td>
              ` : ''}
              <td style="padding: 1.2rem 1.5rem; text-align: right;">
                 <div style="display: flex; gap: 0.5rem; justify-content: flex-end; flex-wrap: wrap;">
                     <!-- VIP Toggle -->
                      <button class="toggle-vip-btn ${u.vip ? 'glass' : 'btn-primary'}" data-uid="${u.uid}" data-current-vip="${!!u.vip}" style="padding: 0.4rem 0.8rem; font-size: 0.7rem;">
                         ${u.vip ? 'Quitar VIP' : '⭐ Activar VIP'}
                      </button>
                       <!-- Partner Toggle (Master only) -->
                       ${isMaster && !userIsMasterAccount ? (() => {
                         const isPartner = u.role === 'partner';
                         return `<button class="activate-partner-btn glass" 
                           data-uid="${u.uid}" 
                           data-name="${u.fullName || u.email}"
                           data-is-partner="${isPartner}"
                           style="padding: 0.4rem 0.8rem; font-size: 0.7rem; border-color: ${isPartner ? '#f87171' : '#c5a059'}; color: ${isPartner ? '#f87171' : '#c5a059'};">
                           ${isPartner ? '🚫 Desactivar Socio' : '💼 Activar Socio ($10)'}
                         </button>`;
                       })() : ''}
                     <!-- Role Toggle (Master only, not on master account) — con separación visual -->
                     ${isMaster && !userIsMasterAccount ? `
                       <button class="toggle-role-btn glass" data-uid="${u.uid}" data-current-role="${u.role || 'user'}" data-name="${u.fullName || u.email}" style="padding: 0.4rem 0.8rem; font-size: 0.7rem; border-color: ${isAdmin ? '#f87171' : 'rgba(197,160,89,0.4)'}; color: ${isAdmin ? '#f87171' : 'var(--text-dim)'}; margin-left: 0.5rem;">
                         ${isAdmin ? '🔒 Quitar Admin' : '🔑 Admin'}
                       </button>
                     ` : ''}
                    <!-- ✏️ Edit Profile (Master + Admin, not on master account) -->
                    ${!userIsMasterAccount ? `
                      <button class="edit-profile-btn glass" 
                        data-uid="${u.uid}" 
                        data-fullname="${u.fullName || ''}" 
                        data-cedula="${u.cedula || ''}"
                        style="padding: 0.4rem 0.8rem; font-size: 0.7rem; border-color: rgba(197,160,89,0.4); color: var(--primary);">
                        ✏️ Editar
                      </button>
                    ` : ''}
                 </div>
              </td>
            </tr>
          `}).join('')}
        </tbody>
      </table>
    </div>
  </div>
</div>
`;
};

export const attachAdminListeners = (onToggleVip, onToggleRole, onClose, onEditProfile) => {
  // Search Filter
  const searchInput = document.getElementById('admin-search-input');
  const userRows = document.querySelectorAll('.user-row');
  const userCount = document.getElementById('user-count');

  searchInput?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    let visibleCount = 0;
    userRows.forEach(row => {
      const text = row.dataset.search;
      if (text.includes(term)) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });
    if (userCount) userCount.innerText = visibleCount;
  });

  // VIP toggle — optimistic DOM update
  document.querySelectorAll('.toggle-vip-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const uid = btn.dataset.uid;
      const currentStatus = btn.dataset.currentVip === 'true';
      const newStatus = !currentStatus;
      btn.disabled = true;
      btn.innerText = '...';
      try {
        await onToggleVip(uid, newStatus);
        // Actualización optimista inmediata
        if (newStatus) {
          btn.innerText = 'Quitar VIP';
          btn.classList.remove('btn-primary');
          btn.classList.add('glass');
          btn.dataset.currentVip = 'true';
          const row = btn.closest('tr');
          if (row) {
            const statusCell = row.querySelector('td:nth-child(2)');
            if (statusCell) statusCell.innerHTML = `<span style="color:#4ade80;background:rgba(74,222,128,0.1);padding:0.3rem 0.8rem;border-radius:20px;font-size:0.7rem;border:1px solid rgba(74,222,128,0.2);">VIP</span>`;
          }
        } else {
          btn.innerText = '⭐ Activar VIP';
          btn.classList.remove('glass');
          btn.classList.add('btn-primary');
          btn.dataset.currentVip = 'false';
        }
        btn.disabled = false;
      } catch(err) {
        btn.disabled = false;
        btn.innerText = currentStatus ? 'Quitar VIP' : '⭐ Activar VIP';
      }
    });
  });

  // Role toggle — inline modal + optimistic DOM update
  document.querySelectorAll('.toggle-role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.uid;
      const currentRole = btn.dataset.currentRole;
      const userName = btn.dataset.name || 'este usuario';
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      const row = btn.closest('tr');

      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);display:grid;place-items:center;z-index:99999;padding:1rem;';
      overlay.innerHTML = `
        <div class="glass" style="max-width:340px;width:100%;padding:2rem;border-radius:16px;border:1px solid rgba(197,160,89,0.4);text-align:center;">
          <div style="font-size:2rem;margin-bottom:1rem;">${newRole === 'admin' ? '🔑' : '🔒'}</div>
          <h3 style="color:#c5a059;margin:0 0 0.5rem;font-size:1rem;">${newRole === 'admin' ? 'Dar acceso de Administrador' : 'Quitar acceso de Administrador'}</h3>
          <p style="color:#a0a0b0;font-size:0.8rem;margin-bottom:1.5rem;">
            ${newRole === 'admin' 
              ? `¿Confirmas dar control del panel a <strong style="color:#fff;">${userName}</strong>?` 
              : `¿Confirmas quitar el rol de administrador a <strong style="color:#fff;">${userName}</strong>?`}
          </p>
          <div style="display:flex;gap:0.8rem;">
            <button id="cancel-role-modal" class="glass" style="flex:1;padding:0.7rem;font-size:0.8rem;">Cancelar</button>
            <button id="confirm-role-modal" class="btn-primary" style="flex:2;padding:0.7rem;font-size:0.85rem;font-weight:bold;">Sí, Confirmar</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      document.getElementById('cancel-role-modal').onclick = () => overlay.remove();
      document.getElementById('confirm-role-modal').onclick = async () => {
        const confirmBtn = document.getElementById('confirm-role-modal');
        confirmBtn.disabled = true;
        confirmBtn.innerText = 'Aplicando...';
        try {
          await onToggleRole(uid, newRole, userName);
          overlay.remove();

          // ✅ Actualización optimista del DOM
          btn.dataset.currentRole = newRole;
          if (newRole === 'admin') {
            btn.innerText = '🔒 Quitar Admin';
            btn.style.borderColor = '#f87171';
            btn.style.color = '#f87171';
            // Actualizar columna de Rol
            if (row) {
              const roleCell = row.querySelector('td:nth-child(3)');
              if (roleCell) roleCell.innerHTML = `<span style="font-size:0.75rem;color:var(--primary);font-weight:bold;">ADMINISTRADOR ✅</span>`;
            }
          } else {
            btn.innerText = '🔑 Admin';
            btn.style.borderColor = 'rgba(197,160,89,0.4)';
            btn.style.color = 'var(--text-dim)';
            if (row) {
              const roleCell = row.querySelector('td:nth-child(3)');
              if (roleCell) roleCell.innerHTML = `<span style="font-size:0.75rem;color:var(--text-dim);font-weight:bold;">USUARIO</span>`;
            }
          }
        } catch(err) {
          confirmBtn.disabled = false;
          confirmBtn.innerText = 'Reintentar';
        }
      };
    });
  });

  // Partner Toggle — Activar o Desactivar Socio con modal de confirmación
  document.querySelectorAll('.activate-partner-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.uid;
      const userName = btn.dataset.name || 'este usuario';
      const isPartner = btn.dataset.isPartner === 'true';
      const row = btn.closest('tr');

      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);display:grid;place-items:center;z-index:99999;padding:1rem;';

      if (!isPartner) {
        // === ACTIVAR SOCIO ===
        overlay.innerHTML = `
          <div class="glass" style="max-width:340px;width:100%;padding:2rem;border-radius:16px;border:1px solid rgba(197,160,89,0.4);text-align:center;">
            <div style="font-size:2rem;margin-bottom:1rem;">💼</div>
            <h3 style="color:#c5a059;margin:0 0 0.5rem;font-size:1rem;">Activar Membresía de Socio</h3>
            <p style="color:#a0a0b0;font-size:0.8rem;margin-bottom:1.5rem;">¿Activar acceso ilimitado (30 días) para <strong style="color:#fff;">${userName}</strong> por $10?</p>
            <div style="display:flex;gap:0.8rem;">
              <button id="cancel-partner-modal" class="glass" style="flex:1;padding:0.7rem;font-size:0.8rem;">Cancelar</button>
              <button id="confirm-partner-modal" class="btn-primary" style="flex:2;padding:0.7rem;font-size:0.85rem;font-weight:bold;">Sí, Activar</button>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('cancel-partner-modal').onclick = () => overlay.remove();
        document.getElementById('confirm-partner-modal').onclick = async () => {
          const confirmBtn = document.getElementById('confirm-partner-modal');
          confirmBtn.disabled = true;
          confirmBtn.innerText = 'Activando...';
          try {
            await onToggleRole(uid, 'partner_sub', userName);
            overlay.remove();
            // ✅ Optimistic DOM: botón → Desactivar
            btn.innerText = '🚫 Desactivar Socio';
            btn.style.borderColor = '#f87171';
            btn.style.color = '#f87171';
            btn.dataset.isPartner = 'true';
            btn.disabled = false;
            if (row) {
              const statusCell = row.querySelector('td:nth-child(2)');
              if (statusCell) statusCell.innerHTML = `<span style="color:#c5a059;background:rgba(197,160,89,0.1);padding:0.3rem 0.8rem;border-radius:20px;font-size:0.7rem;border:1px solid rgba(197,160,89,0.2);">SOCIO (30d)</span>`;
            }
          } catch(err) {
            confirmBtn.disabled = false;
            confirmBtn.innerText = 'Reintentar';
          }
        };

      } else {
        // === DESACTIVAR SOCIO ===
        overlay.innerHTML = `
          <div class="glass" style="max-width:340px;width:100%;padding:2rem;border-radius:16px;border:1px solid rgba(248,113,113,0.4);text-align:center;">
            <div style="font-size:2rem;margin-bottom:1rem;">🚫</div>
            <h3 style="color:#f87171;margin:0 0 0.5rem;font-size:1rem;">Desactivar Membresía de Socio</h3>
            <p style="color:#a0a0b0;font-size:0.8rem;margin-bottom:1.5rem;">¿Revocar el acceso de Socio a <strong style="color:#fff;">${userName}</strong>? El usuario volverá a ser Usuario estándar.</p>
            <div style="display:flex;gap:0.8rem;">
              <button id="cancel-partner-modal" class="glass" style="flex:1;padding:0.7rem;font-size:0.8rem;">Cancelar</button>
              <button id="confirm-partner-modal" style="flex:2;padding:0.7rem;font-size:0.85rem;font-weight:bold;background:#f87171;color:#000;border:none;border-radius:8px;cursor:pointer;">Sí, Desactivar</button>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('cancel-partner-modal').onclick = () => overlay.remove();
        document.getElementById('confirm-partner-modal').onclick = async () => {
          const confirmBtn = document.getElementById('confirm-partner-modal');
          confirmBtn.disabled = true;
          confirmBtn.innerText = 'Desactivando...';
          try {
            await onToggleRole(uid, 'deactivate_partner', userName);
            overlay.remove();
            // ✅ Optimistic DOM: botón → Activar
            btn.innerText = '💼 Activar Socio ($10)';
            btn.style.borderColor = '#c5a059';
            btn.style.color = '#c5a059';
            btn.dataset.isPartner = 'false';
            btn.disabled = false;
            if (row) {
              const statusCell = row.querySelector('td:nth-child(2)');
              if (statusCell) statusCell.innerHTML = `<span style="color:var(--text-dim);font-size:0.7rem;">Estándar</span>`;
            }
          } catch(err) {
            confirmBtn.disabled = false;
            confirmBtn.innerText = 'Reintentar';
          }
        };
      }
    });
  });

  // ✏️ Edit Profile — open modal
  const modal = document.getElementById('edit-profile-modal');
  const editUidInput = document.getElementById('edit-uid');
  const editNameInput = document.getElementById('edit-fullname');
  const editCedulaInput = document.getElementById('edit-cedula');

  document.querySelectorAll('.edit-profile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      editUidInput.value = btn.dataset.uid;
      editNameInput.value = btn.dataset.fullname;
      editCedulaInput.value = btn.dataset.cedula;
      modal.style.display = 'grid';
    });
  });

  document.getElementById('cancel-edit-btn')?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document.getElementById('confirm-edit-btn')?.addEventListener('click', async () => {
    const uid = editUidInput.value;
    const newName = editNameInput.value.trim();
    const newCedula = editCedulaInput.value.trim();
    if (!uid || !newName) return;
    const confirmBtn = document.getElementById('confirm-edit-btn');
    confirmBtn.disabled = true;
    confirmBtn.innerText = 'Guardando...';
    try {
      await onEditProfile(uid, { fullName: newName, cedula: newCedula });
      modal.style.display = 'none';
    } catch (err) {
      confirmBtn.innerText = 'Error — Reintentar';
    } finally {
      confirmBtn.disabled = false;
      if (confirmBtn.innerText === 'Guardando...') {
        confirmBtn.innerText = 'CONFIRMAR CORRECCIÓN';
      }
    }
  });

  document.querySelector('#close-admin-btn')?.addEventListener('click', onClose);
};

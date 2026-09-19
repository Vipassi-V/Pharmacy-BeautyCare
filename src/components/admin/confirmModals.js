// Reusable Confirmation Modals for Delete, Deactivate, Activate, and Unsaved Changes

export function renderConfirmModal(activeModal) {
  if (!activeModal) return '';

  const { type, title, message, itemName, actionLabel, icon } = activeModal;

  let iconName = icon || 'help';
  let iconBg = '#eff4ff';
  let iconColor = 'var(--secondary)';
  let btnClass = 'btn-primary';
  let confirmBtnText = actionLabel || 'Confirm';

  if (type === 'delete') {
    iconName = 'delete_forever';
    iconBg = '#ffdad6';
    iconColor = 'var(--error)';
    btnClass = 'btn-primary';
    confirmBtnText = actionLabel || 'Delete Permanently';
  } else if (type === 'deactivate') {
    iconName = 'visibility_off';
    iconBg = '#fef3c7';
    iconColor = 'var(--tertiary)';
    confirmBtnText = actionLabel || 'Deactivate';
  } else if (type === 'activate') {
    iconName = 'check_circle';
    iconBg = '#f0fdf4';
    iconColor = 'var(--primary-container)';
    confirmBtnText = actionLabel || 'Activate';
  } else if (type === 'unsaved') {
    iconName = 'warning';
    iconBg = '#fef3c7';
    iconColor = 'var(--tertiary)';
    confirmBtnText = 'Discard & Leave';
  }

  return `
    <div class="modal-backdrop" id="genericModalBackdrop">
      <div class="modal-dialog" style="max-width: 460px;">
        <div style="padding: 1.5rem 1.5rem 1.25rem; text-align: center;">
          <div style="width: 52px; height: 52px; border-radius: 50%; background: ${iconBg}; color: ${iconColor}; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.75rem;">
            <span class="material-symbols-outlined" style="font-size: 28px;">${iconName}</span>
          </div>

          <h3 class="font-headline-sm" style="color: var(--on-surface); margin-bottom: 0.35rem;">
            ${title || 'Please Confirm Action'}
          </h3>

          <p class="font-body-md" style="color: var(--on-surface-variant); font-size: 0.9rem; line-height: 1.45; margin-bottom: ${itemName ? '0.5rem' : '1.25rem'};">
            ${message || 'Are you sure you want to proceed with this action?'}
          </p>

          ${itemName ? `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 0.6rem 1rem; font-weight: 700; color: var(--on-surface); font-size: 0.9rem; margin-bottom: 1.25rem; word-break: break-word;">
              ${itemName}
            </div>
          ` : ''}

          <div style="display: flex; gap: 0.75rem;">
            <button type="button" class="btn-ghost" id="genericModalCancelBtn" style="flex: 1; border: 1.5px solid #cbd5e1;">
              Cancel
            </button>
            <button type="button" class="${btnClass}" id="genericModalConfirmBtn" style="flex: 1.2; ${type === 'delete' ? 'background: var(--error); box-shadow: 0 4px 14px rgba(186, 26, 26, 0.25);' : ''}">
              ${confirmBtnText}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Global Toast Renderer
export function renderToast(toast) {
  if (!toast) return '';
  const isError = toast.type === 'error';
  return `
    <div class="toast-container">
      <div class="toast-notification ${isError ? 'error' : 'success'}">
        <span class="material-symbols-outlined" style="font-size: 20px; color: ${isError ? '#ffffff' : 'var(--primary-fixed)'};">
          ${isError ? 'error' : 'check_circle'}
        </span>
        <span>${toast.message}</span>
      </div>
    </div>
  `;
}

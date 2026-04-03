/**
 * Notification System - AppFutbol
 * Centralizes Toasts and Dynamic Modals to replace alert() and confirm()
 */

// Container setup
const getToastContainer = () => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
};

/**
 * Shows a premium toast notification
 * @param {string} message 
 * @param {'success' | 'error' | 'info'} type 
 * @param {number} duration 
 */
export const showToast = (message, type = 'success', duration = 4000) => {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.setProperty('--duration', `${duration}ms`);
    
    // Icon selection
    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'info') icon = 'ℹ️';

    toast.innerHTML = `
        <span class="text-xl">${icon}</span>
        <div class="flex flex-col">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">${type === 'success' ? 'Éxito' : type === 'error' ? 'Error' : 'Aviso'}</span>
            <p class="text-xs font-bold text-white uppercase tracking-tight">${message}</p>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 500);
    }, duration);
};

/**
 * Shows a premium system modal (replaces confirm)
 * @param {Object} options { title, message, confirmText, cancelText, onConfirm, type }
 */
export const showModal = ({ 
    title = 'Confirmar Acción', 
    message = '¿Estás seguro de realizar esta operación?', 
    confirmText = 'CONTINUAR', 
    cancelText = 'CANCELAR', 
    onConfirm = () => {},
    type = 'info' 
}) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-sys-overlay';
    
    overlay.innerHTML = `
        <div class="modal-sys-card">
            <div class="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8 ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-400'}">
                ${type === 'danger' ? '⚠️' : 'ℹ️'}
            </div>
            <h3 class="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">${title}</h3>
            <p class="text-slate-400 text-sm font-medium leading-relaxed mb-10">${message}</p>
            <div class="flex flex-col gap-4">
                <button id="modal-confirm" class="${type === 'danger' ? 'bg-red-500' : 'bg-neon'} text-black py-5 rounded-2xl text-[11px] font-[1000] uppercase italic tracking-widest shadow-2xl hover:scale-105 transition-all">
                    ${confirmText} ➔
                </button>
                <button id="modal-cancel" class="bg-white/5 text-slate-500 py-4 rounded-2xl text-[10px] font-black uppercase italic tracking-widest border border-white/5 hover:text-white transition-all">
                    ${cancelText}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeModal = () => {
        overlay.style.opacity = '0';
        overlay.querySelector('.modal-sys-card').style.transform = 'scale(0.9)';
        setTimeout(() => overlay.remove(), 300);
    };

    overlay.querySelector('#modal-confirm').onclick = () => {
        onConfirm();
        closeModal();
    };

    overlay.querySelector('#modal-cancel').onclick = closeModal;
    overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
};

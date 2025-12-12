// Mobile Menu Controller
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
});

function initMobileMenu() {
    // Crear botón hamburguesa si no existe
    const header = document.querySelector('.header');
    const headerContent = document.querySelector('.header-content');
    
    if (!document.querySelector('.hamburger-btn')) {
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'hamburger-btn';
        hamburgerBtn.innerHTML = '☰';
        hamburgerBtn.setAttribute('aria-label', 'Menú');
        headerContent.insertBefore(hamburgerBtn, headerContent.firstChild);
    }
    
    // Crear overlay si no existe
    if (!document.querySelector('.sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }
    
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const sidebar = document.querySelector('aside');
    const overlay = document.querySelector('.sidebar-overlay');
    
    // Toggle sidebar
    hamburgerBtn.addEventListener('click', () => {
        toggleSidebar();
    });
    
    // Cerrar al hacer clic en overlay
    overlay.addEventListener('click', () => {
        closeSidebar();
    });
    
    // Cerrar al hacer clic en un link del menú
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
    
    // Cerrar sidebar al cambiar de orientación o redimensionar
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeSidebar();
            }
        }, 250);
    });
    
    // Prevenir scroll del body cuando el menú está abierto
    const preventScroll = (e) => {
        if (sidebar.classList.contains('mobile-open')) {
            e.preventDefault();
        }
    };
}

function toggleSidebar() {
    const sidebar = document.querySelector('aside');
    const overlay = document.querySelector('.sidebar-overlay');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    
    if (sidebar.classList.contains('mobile-open')) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    const sidebar = document.querySelector('aside');
    const overlay = document.querySelector('.sidebar-overlay');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
    hamburgerBtn.innerHTML = '✕';
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    const sidebar = document.querySelector('aside');
    const overlay = document.querySelector('.sidebar-overlay');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    hamburgerBtn.innerHTML = '☰';
    document.body.style.overflow = '';
}

// Exportar funciones para uso global
window.toggleSidebar = toggleSidebar;
window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;
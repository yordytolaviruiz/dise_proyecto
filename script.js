// Products Data
const products = [
    {
        id: '1',
        name: 'FRESAS CON DURAZNO',
        description: 'Fresas frescas con crema dulce y deliciosa',
        price: 45,
        image: 'imagen/FresaDurazno.png',
        category: 'Clásicos',
    },
    {
        id: '2',
        name: 'FRESAS CON PIÑA O PURA PIÑA',
        description: 'Fresas cubiertas con piña y crema',
        price: 55,
        image: 'imagen/FresaPiña.png',
        category: 'Premium',
    },
    {
        id: '3',
        name: 'JALEA FRUTILLAS CHOCOLATE',
        description: 'Fresas frescas del día con un toque de crema',
        price: 25,
        image: 'imagen/FresaFrutilla.png',
        category: 'Natural',
    },
    {
        id: '4',
        name: 'FRESAS CON NUTELLA',
        description: 'Capas de fresas, crema y granola con Nutella',
        price: 50,
        image: 'imagen/FresaNutella.png',
        category: 'Especial',
    },
    {
        id: '5',
        name: 'FRESAS CON PLÁTANO',
        description: 'Extra porción de crema para los más golosos',
        price: 60,
        image: 'imagen/FresaPlatano.png',
        category: 'Premium',
    },
    {
        id: '6',
        name: 'FRESAS CON DULCE DE LECHE',
        description: 'Porción pequeña perfecta para una probadita',
        price: 25,
        image: 'imagen/FresaDulceLeche.png',
        category: 'Clásicos',
    },
];

// Cart State
let cart = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupNavigation();
    setupMobileMenu();
    renderAnalytics();
});

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-category">${product.category}</div>
            </div>
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div>
                        <span class="product-price">$${product.price}</span>
                        <span class="product-currency">bs</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                        ➕ Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartBadge();
    renderCart();
    
    // Show feedback
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Agregado';
    btn.style.background = '#10b981';
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 1000);
}

// Update Cart Badge
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    const badgeMobile = document.getElementById('cartBadgeMobile');
    
    if (totalItems > 0) {
        badge.style.display = 'flex';
        badgeMobile.style.display = 'inline';
        badge.textContent = totalItems;
        badgeMobile.textContent = totalItems;
    } else {
        badge.style.display = 'none';
        badgeMobile.style.display = 'none';
    }
}

// Render Cart
function renderCart() {
    const cartContent = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos deliciosos para comenzar tu pedido</p>
            </div>
        `;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    cartContent.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items">
                ${cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-info">
                            <h4 class="cart-item-name">${item.name}</h4>
                            <p class="cart-item-description">${item.description}</p>
                            <div class="cart-item-footer">
                                <div class="quantity-controls">
                                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                                    <span class="quantity-value">${item.quantity}</span>
                                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                </div>
                                <span class="cart-item-price">$${item.price * item.quantity} bs</span>
                            </div>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">🗑️</button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-summary">
                <h4>Resumen del Pedido</h4>
                <div class="summary-line">
                    <span>Subtotal</span>
                    <span>$${subtotal.toFixed(2)} bs</span>
                </div>
                <div class="summary-line">
                    <span>IVA (16%)</span>
                    <span>$${tax.toFixed(2)} bs</span>
                </div>
                <div class="summary-total">
                    <span class="label">Total</span>
                    <span class="value">$${total.toFixed(2)} bs</span>
                </div>
                <button class="checkout-btn" onclick="checkout()">Proceder al Pago</button>
                <button class="continue-btn" onclick="switchView('home')">Continuar Comprando</button>
                <div class="delivery-info">
                    <span class="delivery-icon">🚚</span>
                    <div>
                        <p>Entrega disponible</p>
                        <p style="font-size: 0.75rem;">Recibe tu pedido en 30-45 minutos</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Update Quantity
function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
        }
    }
    updateCartBadge();
    renderCart();
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartBadge();
    renderCart();
}

// Checkout
function checkout() {
    alert('¡Gracias por tu pedido! Procesando pago...');
    cart = [];
    updateCartBadge();
    renderCart();
}

// Navigation
function setupNavigation() {
    // Desktop navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            switchView(view);
            
            // Update active state
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Mobile navigation
    document.querySelectorAll('.nav-btn-mobile').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            switchView(view);
            
            // Update active state
            document.querySelectorAll('.nav-btn-mobile').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Close mobile menu
            document.getElementById('mobileNav').classList.remove('active');
        });
    });
}

// Switch View
function switchView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewName + 'View').classList.add('active');

    // Update navigation active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-view') === viewName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    document.querySelectorAll('.nav-btn-mobile').forEach(btn => {
        if (btn.getAttribute('data-view') === viewName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (viewName === 'cart') {
        renderCart();
    }
}

// Mobile Menu
function setupMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mobileNav');
    
    btn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// Analytics Charts
function renderAnalytics() {
    renderSalesChart();
    renderPieChart();
    renderBarChart();
    renderTopProducts();
}

function renderSalesChart() {
    const canvas = document.getElementById('salesChart');
    const ctx = canvas.getContext('2d');
    
    const data = [
        { day: 'Lun', ventas: 850, pedidos: 24 },
        { day: 'Mar', ventas: 920, pedidos: 28 },
        { day: 'Mié', ventas: 1100, pedidos: 32 },
        { day: 'Jue', ventas: 980, pedidos: 26 },
        { day: 'Vie', ventas: 1350, pedidos: 38 },
        { day: 'Sáb', ventas: 1850, pedidos: 52 },
        { day: 'Dom', ventas: 1620, pedidos: 45 },
    ];

    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = 600;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find max value
    const maxVentas = Math.max(...data.map(d => d.ventas));
    const maxPedidos = Math.max(...data.map(d => d.pedidos));
    const maxValue = Math.max(maxVentas, maxPedidos);

    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Draw axes labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '24px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round(maxValue - (maxValue / 5) * i);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(value, padding - 10, y + 8);
    }

    // Draw x-axis labels
    ctx.textAlign = 'center';
    data.forEach((item, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        ctx.fillText(item.day, x, height - padding + 35);
    });

    // Draw ventas line
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 6;
    ctx.beginPath();
    data.forEach((item, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - (item.ventas / maxValue) * chartHeight;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Draw pedidos line
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 6;
    ctx.beginPath();
    data.forEach((item, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - (item.pedidos / maxValue) * chartHeight;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Draw points for ventas
    data.forEach((item, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - (item.ventas / maxValue) * chartHeight;
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw points for pedidos
    data.forEach((item, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - (item.pedidos / maxValue) * chartHeight;
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}

function renderPieChart() {
    const canvas = document.getElementById('pieChart');
    const ctx = canvas.getContext('2d');
    
    const data = [
        { name: 'Fresas con Crema Clásica', ventas: 145, color: '#ec4899' },
        { name: 'Fresas con Chocolate', ventas: 98, color: '#f43f5e' },
        { name: 'Parfait de Fresa', ventas: 76, color: '#fb7185' },
        { name: 'Fresas con Crema Doble', ventas: 54, color: '#fda4af' },
        { name: 'Otros', ventas: 42, color: '#fecdd3' },
    ];

    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    ctx.clearRect(0, 0, width, height);

    const total = data.reduce((sum, item) => sum + item.ventas, 0);
    let currentAngle = -Math.PI / 2;

    data.forEach(item => {
        const sliceAngle = (item.ventas / total) * Math.PI * 2;
        
        // Draw slice
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        const percent = Math.round((item.ventas / total) * 100);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(percent + '%', labelX, labelY);

        currentAngle += sliceAngle;
    });

    // Render legend
    const legend = document.getElementById('pieLegend');
    legend.innerHTML = data.map(item => `
        <div class="legend-item">
            <div class="legend-color" style="background: ${item.color}"></div>
            <span class="legend-label">${item.name}</span>
            <span class="legend-value">${item.ventas}</span>
        </div>
    `).join('');
}

function renderBarChart() {
    const canvas = document.getElementById('barChart');
    const ctx = canvas.getContext('2d');
    
    const data = [
        { hora: '9am', clientes: 8 },
        { hora: '10am', clientes: 15 },
        { hora: '11am', clientes: 22 },
        { hora: '12pm', clientes: 35 },
        { hora: '1pm', clientes: 42 },
        { hora: '2pm', clientes: 38 },
        { hora: '3pm', clientes: 28 },
        { hora: '4pm', clientes: 32 },
        { hora: '5pm', clientes: 45 },
        { hora: '6pm', clientes: 48 },
        { hora: '7pm', clientes: 40 },
        { hora: '8pm', clientes: 25 },
    ];

    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = 600;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    const maxClientes = Math.max(...data.map(d => d.clientes));
    const barWidth = chartWidth / data.length * 0.8;
    const barGap = chartWidth / data.length * 0.2;

    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Draw bars
    data.forEach((item, i) => {
        const x = padding + (chartWidth / data.length) * i + barGap / 2;
        const barHeight = (item.clientes / maxClientes) * chartHeight;
        const y = padding + chartHeight - barHeight;

        // Gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, '#ec4899');
        gradient.addColorStop(1, '#f43f5e');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [16, 16, 0, 0]);
        ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    data.forEach((item, i) => {
        const x = padding + (chartWidth / data.length) * i + (chartWidth / data.length) / 2;
        ctx.fillText(item.hora, x, height - padding + 35);
    });

    // Draw y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round(maxClientes - (maxClientes / 5) * i);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(value, padding - 10, y + 8);
    }
}

function renderTopProducts() {
    const topProducts = [
        { name: 'Fresas con Crema Clásica', units: 145, revenue: 6525 },
        { name: 'Fresas con Chocolate', units: 98, revenue: 5390 },
        { name: 'Parfait de Fresa', units: 76, revenue: 3800 },
        { name: 'Fresas con Crema Doble', units: 54, revenue: 3240 },
    ];

    const container = document.getElementById('topProducts');
    const maxUnits = Math.max(...topProducts.map(p => p.units));

    container.innerHTML = topProducts.map((product, index) => `
        <div class="top-product">
            <div class="top-product-header">
                <div class="top-product-info">
                    <div class="top-product-rank">${index + 1}</div>
                    <div>
                        <div class="top-product-name">${product.name}</div>
                        <div class="top-product-units">${product.units} unidades vendidas</div>
                    </div>
                </div>
                <div class="top-product-revenue">
                    <div class="top-product-amount">$${product.revenue.toLocaleString()}</div>
                    <div class="top-product-currency">MXN</div>
                </div>
            </div>
            <div class="top-product-bar">
                <div class="top-product-bar-fill" style="width: ${(product.units / maxUnits) * 100}%"></div>
            </div>
        </div>
    `).join('');
}

// Polyfill for roundRect
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radii) {
        if (!Array.isArray(radii)) {
            radii = [radii, radii, radii, radii];
        }
        this.beginPath();
        this.moveTo(x + radii[0], y);
        this.lineTo(x + width - radii[1], y);
        this.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
        this.lineTo(x + width, y + height - radii[2]);
        this.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
        this.lineTo(x + radii[3], y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
        this.lineTo(x, y + radii[0]);
        this.quadraticCurveTo(x, y, x + radii[0], y);
        this.closePath();
        return this;
    };
}

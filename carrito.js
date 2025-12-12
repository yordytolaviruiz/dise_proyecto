// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartBadge();
});

// Update Cart Badge
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    const badgeMobile = document.getElementById('cartBadgeMobile');
    
    if (totalItems > 0) {
        if (badge) {
            badge.style.display = 'flex';
            badge.textContent = totalItems;
        }
        if (badgeMobile) {
            badgeMobile.style.display = 'inline';
            badgeMobile.textContent = totalItems;
        }
    } else {
        if (badge) badge.style.display = 'none';
        if (badgeMobile) badgeMobile.style.display = 'none';
    }
}

// Render Cart
function renderCart() {
    const cartContent = document.getElementById('cartContent');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos deliciosos para comenzar tu pedido</p>
                <button onclick="window.location.href='productos.html'">
                    Ver Productos
                </button>
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
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Crect fill=%22%23ec4899%22 width=%22120%22 height=%22120%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22%3E🍓%3C/text%3E%3C/svg%3E'">
                        <div class="cart-item-info">
                            <h4 class="cart-item-name">${item.name}</h4>
                            <p class="cart-item-description">${item.description}</p>
                            <div class="cart-item-footer">
                                <div class="quantity-controls">
                                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                                    <span class="quantity-value">${item.quantity}</span>
                                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                </div>
                                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)} bs</span>
                            </div>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')" title="Eliminar producto">🗑️</button>
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
                <button class="checkout-btn" onclick="checkout()">
                    💳 Proceder al Pago
                </button>
                <button class="continue-btn" onclick="window.location.href='productos.html'">
                    ← Continuar Comprando
                </button>
                <div class="delivery-info">
                    <span class="delivery-icon">🚚</span>
                    <div>
                        <p>Entrega disponible</p>
                        <p style="font-size: 0.875rem; font-weight: 400; margin-top: 0.25rem;">Recibe tu pedido en 30-45 minutos</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Update Quantity
function updateQuantity(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

// Remove from Cart
function removeFromCart(productId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        renderCart();
    }
}

// Checkout
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    alert('¡Gracias por tu pedido! Procesando pago...\n\nNos pondremos en contacto contigo para confirmar la entrega.');
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartBadge();
    renderCart();
}
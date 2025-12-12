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

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartBadge();
});

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23ec4899%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2224%22 font-weight=%22bold%22%3E🍓%3C/text%3E%3C/svg%3E'">
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
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
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
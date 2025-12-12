// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    renderAnalytics();
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

// Render Analytics
function renderAnalytics() {
    renderSalesChart();
    renderPieChart();
    renderBarChart();
    renderTopProducts();
}

// Sales Chart
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

    ctx.clearRect(0, 0, width, height);

    const maxVentas = Math.max(...data.map(d => d.ventas));
    const maxPedidos = Math.max(...data.map(d => d.pedidos));
    const maxValue = Math.max(maxVentas, maxPedidos);

    // Grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '24px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round(maxValue - (maxValue / 5) * i);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(value, padding - 10, y + 8);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    data.forEach((item, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        ctx.fillText(item.day, x, height - padding + 35);
    });

    // Ventas line
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 6;
    ctx.beginPath();
    data.forEach((item, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - (item.ventas / maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Pedidos line
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 6;
    ctx.beginPath();
    data.forEach((item, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - (item.pedidos / maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Points for ventas
    data.forEach((item, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - (item.ventas / maxValue) * chartHeight;
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
    });

    // Points for pedidos
    data.forEach((item, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = padding + chartHeight - (item.pedidos / maxValue) * chartHeight;
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Pie Chart
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
        
        // Slice
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        // Label
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

    // Legend
    const legend = document.getElementById('pieLegend');
    legend.innerHTML = data.map(item => `
        <div class="legend-item">
            <div class="legend-color" style="background: ${item.color}"></div>
            <span class="legend-label">${item.name}</span>
            <span class="legend-value">${item.ventas}</span>
        </div>
    `).join('');
}

// Bar Chart
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

    // Grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Bars
    data.forEach((item, i) => {
        const x = padding + (chartWidth / data.length) * i + barGap / 2;
        const barHeight = (item.clientes / maxClientes) * chartHeight;
        const y = padding + chartHeight - barHeight;

        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, '#ec4899');
        gradient.addColorStop(1, '#f43f5e');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, barWidth, barHeight, [16, 16, 0, 0]);
        } else {
            ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
    });

    // X-axis labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    data.forEach((item, i) => {
        const x = padding + (chartWidth / data.length) * i + (chartWidth / data.length) / 2;
        ctx.fillText(item.hora, x, height - padding + 35);
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round(maxClientes - (maxClientes / 5) * i);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(value, padding - 10, y + 8);
    }
}

// Top Products
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
                    <div class="top-product-currency">bs</div>
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
// ============================================
// نظام المتجر العام - بدون تسجيل دخول
// ============================================

const db = firebase.database();
const appsRef = db.ref('data2');
let allApps = [];
let searchTimeout;

// تحميل جميع التطبيقات مباشرة
appsRef.on('value', (snapshot) => {
    // إظهار شاشة التحميل
    document.getElementById('loadingOverlay').style.display = 'flex';

    allApps = [];
    snapshot.forEach((child) => {
        allApps.push(child.val());
    });

    renderApps(allApps);

    // إخفاء شاشة التحميل
    document.getElementById('loadingOverlay').style.display = 'none';
});

// البحث المباشر
document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const term = e.target.value.toLowerCase().trim();
        const filtered = allApps.filter((app) =>
            (app.title && app.title.toLowerCase().includes(term)) ||
            (app.dec && app.dec.toLowerCase().includes(term))
        );
        renderApps(filtered);
    }, 300);
});

// عرض التطبيقات
function renderApps(apps) {
    const grid = document.getElementById('appsGrid');
    if (apps.length === 0) {
        grid.innerHTML = '<p class="no-results" style="text-align: center; grid-column: 1/-1;">لم يتم العثور على نتائج</p>';
        return;
    }

    let html = '';
    apps.forEach(app => {
        html += `
            <div class="app-card" onclick='openAppDetails(${JSON.stringify(app)})'>
                <img src="${app.icon || 'default-icon.png'}" class="app-image" alt="${app.title || 'تطبيق'}" onerror="this.src='default-icon.png'">
                <div class="app-content">
                    <h3 class="app-title">${escapeHtml(app.title) || 'بدون عنوان'}</h3>
                    <div class="app-meta">
                        <span>${app.size || 'N/A'}</span>
                        <div class="rating">
                            ${generateRatingStars(app.rating || 4.5)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// توليد نجوم التقييم
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    return `
        ${'<i class="material-icons-round">star</i>'.repeat(fullStars)}
        ${halfStar ? '<i class="material-icons-round">star_half</i>' : ''}
        ${'<i class="material-icons-round">star_border</i>'.repeat(5 - fullStars - halfStar)}
    `;
}

// فتح تفاصيل التطبيق (الحفاظ على الآلية القديمة)
function openAppDetails(app) {
    const params = new URLSearchParams(app);
    window.location.href = `preview.html?${params}`;
}

// دالة بسيطة لمنع XSS
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ===== القائمة الجانبية =====
const sideMenu = document.getElementById('sideMenu');
let isMenuOpen = false;

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    sideMenu.classList.toggle('open', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
}

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
    if (isMenuOpen && !sideMenu.contains(e.target) && !e.target.closest('.toolbar-icon')) {
        toggleMenu();
    }
});
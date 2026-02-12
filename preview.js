// ============================================
// preview.js – صفحة تفاصيل التطبيق (نسخة احترافية)
// ============================================

// استلام المعاملات من الرابط
const urlParams = new URLSearchParams(window.location.search);

// --- تعبئة البيانات الأساسية ---
document.getElementById('appTitle').textContent = urlParams.get('title') || 'بدون عنوان';
document.getElementById('appIcon').src = urlParams.get('icon') || 'default-icon.png';
document.getElementById('description').textContent = urlParams.get('dec') || 'لا يوجد وصف متاح.';

// اسم المطور (يمكن إضافته في الرابط أو استخدام افتراضي)
const developer = urlParams.get('developer') || 'مطور التطبيق';
document.getElementById('developer').innerHTML = `<i class="material-icons-round" style="font-size:16px;">verified</i> ${developer}`;

// --- معالجة التقييم والنجوم ---
const rating = parseFloat(urlParams.get('rating')) || 4.5;
const stars = document.getElementById('ratingStars');
stars.innerHTML = renderStars(rating);
const downloads = urlParams.get('downloads') || '١٠ آلاف+';
document.getElementById('ratingText').textContent = `${rating.toFixed(1)} ★ • ${downloads} تنزيل`;

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}

// --- لقطات الشاشة (دعم حتى 5 صور) ---
const screenshots = [];
for (let i = 1; i <= 5; i++) {
    const sc = urlParams.get(`sc${i}`);
    if (sc) screenshots.push(sc);
}

const container = document.getElementById('screenshots');
if (screenshots.length === 0) {
    // إخفاء القسم بالكامل إذا لا توجد لقطات
    document.querySelector('.screenshots-container').style.display = 'none';
} else {
    screenshots.forEach((src, index) => {
        const img = document.createElement('img');
        img.className = 'screenshot';
        img.src = src;
        img.alt = `لقطة شاشة ${index + 1}`;
        img.loading = 'lazy';
        img.addEventListener('click', () => openModal(index));
        container.appendChild(img);
    });
}

// --- المعلومات الإضافية ---
const details = {
    size: urlParams.get('size') || '١٥ م.ب',
    version: urlParams.get('version') || '١.٠.٠',
    updated: urlParams.get('updated') || '٢٤ مايو ٢٠٢٤',
    requires: urlParams.get('android') || 'أندرويد ٨.٠ أو أعلى',
    contentRating: urlParams.get('contentRating') || '+٣',
    time: urlParams.get('time') || 'غير معروف'
};

const grid = document.getElementById('detailsGrid');
grid.innerHTML = ''; // تنظيف أي محتوى سابق
Object.entries(details).forEach(([key, value]) => {
    const div = document.createElement('div');
    div.className = 'detail-item';
    div.innerHTML = `
        <span class="detail-label">${getLabel(key)}</span>
        <span class="detail-value">${value}</span>
    `;
    grid.appendChild(div);
});

function getLabel(key) {
    const labels = {
        size: '💾 الحجم',
        version: '📦 الإصدار',
        updated: '🔄 آخر تحديث',
        requires: '📱 أندرويد',
        contentRating: '👤 التصنيف العمري',
        time: '⏱️ رفع بتاريخ'
    };
    return labels[key] || key;
}

// --- زر التثبيت ---
const installBtn = document.getElementById('installBtn');
const projectLink = urlParams.get('project');
if (projectLink && projectLink.startsWith('http')) {
    installBtn.addEventListener('click', () => {
        window.open(projectLink, '_blank');
    });
} else {
    installBtn.disabled = true;
    installBtn.style.opacity = '0.6';
    installBtn.style.cursor = 'not-allowed';
    installBtn.innerHTML = '<i class="material-icons-round">block</i> الرابط غير متوفر';
}

// ============================================
// دوال المشاركة – تم إصلاح copyLink بالكامل
// ============================================

// فتح/إغلاق قائمة المشاركة
window.toggleShareMenu = function() {
    const menu = document.getElementById('shareMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
};

// إغلاق القائمة عند النقر خارجها
window.addEventListener('click', function(e) {
    const menu = document.getElementById('shareMenu');
    if (!menu.contains(e.target) && !e.target.closest('.toolbar-icon')) {
        menu.style.display = 'none';
    }
});

// مشاركة عبر واتساب
window.shareViaWhatsApp = function() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${url}`, '_blank');
};

// **دالة نسخ الرابط – مدعومة في جميع المتصفحات (تم الإصلاح)**
window.copyLink = function() {
    const url = window.location.href;

    // الطريقة الحديثة (navigator.clipboard)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            alert('✅ تم نسخ الرابط بنجاح');
        }).catch(() => {
            // فشلت الطريقة الحديثة → استخدم الطريقة القديمة
            fallbackCopyText(url);
        });
    } else {
        // المتصفح لا يدعم clipboard API → استخدم الطريقة القديمة
        fallbackCopyText(url);
    }

    // إغلاق قائمة المشاركة
    toggleShareMenu();
};

// دالة احتياطية للنسخ (تعمل في جميع المتصفحات)
function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';  // تجنب التمرير إلى الأسفل
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert('✅ تم نسخ الرابط بنجاح');
        } else {
            alert('❌ فشل نسخ الرابط، يرجى النسخ يدوياً');
        }
    } catch (err) {
        alert('❌ فشل نسخ الرابط، يرجى النسخ يدوياً');
    }

    document.body.removeChild(textArea);
}

// مشاركة عبر Web Share API (إن وجد)
window.shareNative = function() {
    if (navigator.share) {
        navigator.share({
            title: document.getElementById('appTitle').textContent,
            text: 'تحميل تطبيق ' + document.getElementById('appTitle').textContent,
            url: window.location.href
        }).catch(() => {
            // المستخدم ألغى المشاركة – لا تفعل شيئاً
        });
    } else {
        // إذا لم يكن Web Share مدعوماً، نفتح قائمة المشاركة (موجودة أصلاً)
        // أو يمكن نسخ الرابط مباشرة
        copyLink();
    }
};

// ============================================
// عارض الصور بملء الشاشة (ميزة Google Play)
// ============================================
let currentImageIndex = 0;

// إنشاء عناصر العارض ديناميكياً
const modal = document.createElement('div');
modal.className = 'image-modal';
modal.id = 'imageModal';

modal.innerHTML = `
    <div class="modal-content">
        <span class="close-modal" onclick="closeModal()">&times;</span>
        <button class="nav-btn prev-btn" onclick="changeImage(-1)">&#10094;</button>
        <img class="modal-image" id="modalImage" src="" alt="صورة مكبرة">
        <button class="nav-btn next-btn" onclick="changeImage(1)">&#10095;</button>
    </div>
`;
document.body.appendChild(modal);

// دالة فتح العارض
window.openModal = function(index) {
    if (!screenshots.length) return;
    currentImageIndex = index;
    const modalImg = document.getElementById('modalImage');
    modalImg.src = screenshots[currentImageIndex];
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // منع التمرير خلف العارض
};

// دالة إغلاق العارض
window.closeModal = function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
};

// دالة تغيير الصورة
window.changeImage = function(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) {
        currentImageIndex = screenshots.length - 1;
    } else if (currentImageIndex >= screenshots.length) {
        currentImageIndex = 0;
    }
    const modalImg = document.getElementById('modalImage');
    modalImg.src = screenshots[currentImageIndex];
};

// إغلاق العارض عند النقر خارج الصورة (على الخلفية)
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// منع إغلاق العارض عند النقر على الصورة أو الأزرار
document.querySelector('.modal-content').addEventListener('click', function(e) {
    e.stopPropagation();
});

// ============================================
// التحكم في إظهار/إخفاء الوصف (Toggle)
// ============================================
const toggleBtn = document.getElementById('toggleDescriptionBtn');
const descriptionText = document.getElementById('description');
const toggleIcon = document.getElementById('toggleIcon');

// التأكد من أن الوصف مخفي في البداية
descriptionText.classList.remove('visible');

toggleBtn.addEventListener('click', function() {
    // تبديل كلاس visible للنص
    descriptionText.classList.toggle('visible');
    // تدوير الأيقونة 180 درجة
    toggleIcon.classList.toggle('rotated');
});
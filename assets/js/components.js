(function () {
  'use strict';

  /* =====================================================
     THÔNG TIN CỬA HÀNG: BẠN SỬA TẠI ĐÂY
     (đang là thông tin mẫu, hãy thay bằng thông tin giả lập của nhóm)
     ===================================================== */
  const SITE = {
    name: 'LUNORA',
    description: 'Trang sức bạc 925 thiết kế tinh tế, lấy cảm hứng từ ánh trăng dịu dàng.',
    announcement: 'Miễn phí vận chuyển cho đơn từ 500.000đ  ·  Bảo hành trọn đời',
    address: '123 Đường Mẫu, Quận Mẫu, TP. Mẫu',
    phone: '0900 000 000',
    email: 'hello@lunora.vn',
    hours: '09:00 – 21:00 (Thứ 2 – Chủ nhật)',
    facebook: '#',
    instagram: '#',
    tiktok: '#'
  };

  const NAV = [
    { label: 'Trang chủ', href: 'index.html' },
    { label: 'Sản phẩm', href: 'products.html', sub: true },
    { label: 'Moonlight', href: 'collections.html' },
    { label: 'Về LUNORA', href: 'about.html' },
    { label: 'Liên hệ', href: 'contact.html' }
  ];

  const CATEGORIES = [
    { slug: 'ring', label: 'Nhẫn' },
    { slug: 'necklace', label: 'Dây chuyền' },
    { slug: 'bracelet', label: 'Vòng tay' },
    { slug: 'earrings', label: 'Bông tai' },
    { slug: 'anklet', label: 'Lắc chân' },
    { slug: 'gift-set', label: 'Set quà tặng' }
  ];

  /* ===== Biểu tượng (SVG) ===== */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    bag: '<path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
  };
  const icon = (name) => '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + '</svg>';

  /* ===== Đọc số lượng giỏ hàng và yêu thích từ localStorage ===== */
  function readCount(key, sumQty) {
    try {
      const data = JSON.parse(localStorage.getItem(key)) || [];
      if (!Array.isArray(data)) return 0;
      return sumQty
        ? data.reduce((sum, item) => sum + (Number(item.qty) || 0), 0)
        : data.length;
    } catch (e) {
      return 0;
    }
  }

  function setBadge(id, n) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = n;
    el.dataset.count = n;
  }

  function updateBadges() {
    setBadge('cart-count', readCount('lunora_cart', true));
    setBadge('wishlist-count', readCount('lunora_wishlist', false));
  }

  /* ===== Trang hiện tại (để tô sáng menu) ===== */
  function currentPage() {
    let page = location.pathname.split('/').pop();
    if (!page) return 'index.html';
    if (!page.includes('.')) page += '.html';
    return page;
  }

  /* ===== Header ===== */
  function renderHeader() {
    const target = document.getElementById('site-header');
    if (!target) return;
    const page = currentPage();

    const navItems = NAV.map((item) => {
      const active = item.href === page ? ' active' : '';
      let html = '<li' + (item.sub ? ' class="has-sub"' : '') + '>';
      html += '<a class="nav-link' + active + '" href="' + item.href + '">' + item.label + '</a>';
      if (item.sub) {
        html += '<ul class="sub-menu">';
        html += '<li><a href="products.html">Tất cả sản phẩm</a></li>';
        CATEGORIES.forEach((c) => {
          html += '<li><a href="products.html?category=' + c.slug + '">' + c.label + '</a></li>';
        });
        html += '</ul>';
      }
      return html + '</li>';
    }).join('');

    target.innerHTML =
      '<div class="announce">' + SITE.announcement + '</div>' +
      '<header class="site-header">' +
        '<div class="container header-inner">' +
          '<a class="header-logo" href="index.html" aria-label="LUNORA - Trang chủ">' +
            '<img src="assets/images/logo/logo.png" alt="' + SITE.name + '">' +
          '</a>' +
          '<nav class="nav" id="main-nav" aria-label="Menu chính"><ul>' + navItems + '</ul></nav>' +
          '<div class="header-actions">' +
            '<button class="icon-btn" id="search-open" type="button" aria-label="Tìm kiếm">' + icon('search') + '</button>' +
            '<a class="icon-btn" href="account.html" aria-label="Tài khoản">' + icon('user') + '</a>' +
            '<a class="icon-btn" href="account.html#wishlist" aria-label="Yêu thích">' + icon('heart') +
              '<span class="badge" id="wishlist-count" data-count="0">0</span></a>' +
            '<a class="icon-btn" href="cart.html" aria-label="Giỏ hàng">' + icon('bag') +
              '<span class="badge" id="cart-count" data-count="0">0</span></a>' +
            '<button class="icon-btn menu-toggle" id="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false">' + icon('menu') + '</button>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  /* ===== Footer ===== */
  function renderFooter() {
    const target = document.getElementById('site-footer');
    if (!target) return;

    const shopLinks = CATEGORIES.map((c) =>
      '<li><a href="products.html?category=' + c.slug + '">' + c.label + '</a></li>'
    ).join('');

    target.innerHTML =
      '<footer class="site-footer">' +
        '<div class="container footer-grid">' +
          '<div class="footer-col footer-brand">' +
            '<div class="brand-name">' + SITE.name + '</div>' +
            '<p>' + SITE.description + '</p>' +
            '<form class="newsletter" id="newsletter-form" novalidate>' +
              '<input type="email" id="newsletter-email" placeholder="Email nhận ưu đãi" aria-label="Email">' +
              '<button type="submit">Đăng ký</button>' +
            '</form>' +
            '<div class="newsletter-msg" id="newsletter-msg"></div>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Mua sắm</h4><ul>' + shopLinks +
            '<li><a href="collections.html">Bộ sưu tập Moonlight</a></li></ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Hỗ trợ</h4><ul>' +
              '<li><a href="about.html">Về LUNORA</a></li>' +
              '<li><a href="about.html#size">Hướng dẫn chọn size</a></li>' +
              '<li><a href="about.html#care">Cách bảo quản bạc</a></li>' +
              '<li><a href="about.html#warranty">Chính sách bảo hành</a></li>' +
              '<li><a href="account.html#orders">Tra cứu đơn hàng</a></li>' +
              '<li><a href="contact.html">Liên hệ</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Liên hệ</h4><ul>' +
              '<li>' + SITE.address + '</li>' +
              '<li><a href="tel:' + SITE.phone.replace(/\s/g, '') + '">' + SITE.phone + '</a></li>' +
              '<li><a href="mailto:' + SITE.email + '">' + SITE.email + '</a></li>' +
              '<li>' + SITE.hours + '</li>' +
            '</ul>' +
            '<div class="socials">' +
              '<a href="' + SITE.facebook + '">Facebook</a>' +
              '<a href="' + SITE.instagram + '">Instagram</a>' +
              '<a href="' + SITE.tiktok + '">TikTok</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="container footer-bottom">' +
          '<span>© ' + new Date().getFullYear() + ' ' + SITE.name + ' Silver Jewelry. Website phục vụ mục đích học tập.</span>' +
          '<span>Thanh toán: VietQR · MoMo · Visa · COD</span>' +
        '</div>' +
      '</footer>';
  }

  /* ===== Menu điện thoại ===== */
  function initMenu() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ===== Đăng ký nhận tin (mô phỏng, không gửi đi đâu) ===== */
  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    const input = document.getElementById('newsletter-email');
    const msg = document.getElementById('newsletter-msg');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      msg.style.color = ok ? '#4F7A5A' : 'var(--color-sale)';
      msg.textContent = ok
        ? 'Cảm ơn bạn đã đăng ký! LUNORA sẽ gửi ưu đãi sớm nhất.'
        : 'Vui lòng nhập email hợp lệ.';
      if (ok) form.reset();
    });
  }

  /* ===== Khởi chạy ===== */
  document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    initMenu();
    initNewsletter();
    updateBadges();
  });

  // Cho các file khác (giỏ hàng, yêu thích...) gọi lại sau này
  window.LUNORA = { SITE: SITE, CATEGORIES: CATEGORIES, updateBadges: updateBadges };
})();
// ==================== DADOS EDITÁVEIS DO SITE ====================
const LAUNCH_SLIDES = [
  {
    id: "drop-dupla",
    image: "imagem/slide-1.jpg",
    imageAlt: "Lançamento fenēri 24.11 — Dupla",
    targetSection: "produtos",
  },
  {
    id: "drop-masculino",
    image: "imagem/slide-2.jpg",
    imageAlt: "Lançamento fenēri 24.11 — Masculino",
    targetSection: "produtos",
  },
  {
    id: "drop-feminino",
    image: "imagem/slide-3.jpg",
    imageAlt: "Lançamento fenēri 24.11 — Feminino",
    targetSection: "produtos",
  },
];

const PRODUCTS = [
  {
    id: "jaqueta-recortes",
    name: "Jaqueta com recortes",
    price: 289.9,
    priceFormatted: "R$ 289,90",
    image: "imagem/blusa-masculina.jpg",
    description:
      "Jaqueta estruturada em azul-marinho com recortes geométricos e fechamento frontal em zíper.",
    sizes: ["P", "M", "G", "GG"],
  },
  {
    id: "calca-abertura-ziper",
    name: "Calça com abertura em zíper",
    price: 229.9,
    priceFormatted: "R$ 229,90",
    image: "imagem/calca-masculina.jpg",
    description:
      "Calça reta em azul-marinho com abertura lateral em zíper e contraste interno em bordô.",
    sizes: ["P", "M", "G", "GG"],
  },
  {
    id: "blusa-detalhe-atravessado",
    name: "Blusa com detalhe atravessado",
    price: 139.99,
    priceFormatted: "R$ 139,99",
    image: "imagem/blusa-detalhe.jpg",
    description:
      "Blusa bicolor bordô e marinho com recortes diagonais e alças assimétricas.",
    sizes: ["PP", "P", "M", "G"],
  },
  {
    id: "calca-cos-transpassado",
    name: "Calça de cós transpassado",
    price: 219.99,
    priceFormatted: "R$ 219,99",
    image: "imagem/calca-feminina.jpg",
    description:
      "Calça de modelagem ampla com cós transpassado, amarração frontal e friso lateral bordô.",
    sizes: ["PP", "P", "M", "G"],
  },
];

// ==================== ESTADO & ELEMENTOS ====================
let currentSlideIndex = 0;
let cart = loadCart();
let toastTimer = null;

const siteHeader = document.getElementById("site-header");
const heroVideo = document.getElementById("hero-video");
const heroWrapper = document.querySelector(".hero-media-wrapper");
const togglePlayBtn = document.getElementById("toggle-play-btn");
const toggleMuteBtn = document.getElementById("toggle-mute-btn");

const carouselTrack = document.getElementById("carousel-track");
const carouselDots = document.getElementById("carousel-dots");
const carouselPrevBtn = document.getElementById("carousel-prev");
const carouselNextBtn = document.getElementById("carousel-next");
const launchesCarousel = document.getElementById("launches-carousel");

const productsGrid = document.getElementById("products-grid");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchStatus = document.getElementById("search-status");
const searchStatusText = document.getElementById("search-status-text");
const clearSearchBtn = document.getElementById("clear-search-btn");

const cartBadge = document.getElementById("cart-badge");
const cartDrawer = document.getElementById("cart-drawer");
const drawerBackdrop = document.getElementById("drawer-backdrop");
const openCartBtn = document.getElementById("open-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartTotalValue = document.getElementById("cart-total-value");
const checkoutBtn = document.getElementById("checkout-btn");

const openAccountBtn = document.getElementById("open-account-btn");
const appModal = document.getElementById("app-modal");
const modalContent = document.getElementById("modal-content");
const closeModalBtn = document.getElementById("close-modal-btn");
const toastEl = document.getElementById("toast");

// ==================== 1. NAVEGAÇÃO & VÍDEO ====================
function navigateToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "start" });

  if (sectionId === "inicio" && heroVideo) {
    heroVideo.play().catch(() => {});
    if (heroWrapper) {
      heroWrapper.classList.add("is-focused");
      setTimeout(() => heroWrapper.classList.remove("is-focused"), 900);
    }
  }
}

function initNavigation() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-scroll-target]");
    if (!trigger) return;

    event.preventDefault();
    navigateToSection(trigger.getAttribute("data-scroll-target"));
  });

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = ["inicio", "lancamentos", "produtos", "sobre-nos"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeId = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.dataset.scrollTarget === activeId,
          );
        });
      });
    },
    { rootMargin: "-35% 0px -50% 0px" },
  );

  sections.forEach((section) => observer.observe(section));

  window.addEventListener(
    "scroll",
    () => {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
    },
    { passive: true },
  );
}

function initVideoControls() {
  if (!heroVideo) return;

  togglePlayBtn.addEventListener("click", () => {
    if (heroVideo.paused) {
      heroVideo.play().catch(() => {});
      togglePlayBtn.textContent = "Pausar vídeo";
    } else {
      heroVideo.pause();
      togglePlayBtn.textContent = "Reproduzir vídeo";
    }
  });

  //   toggleMuteBtn.addEventListener("click", () => {
  //     heroVideo.muted = !heroVideo.muted;
  //     toggleMuteBtn.textContent = heroVideo.muted ? "Ativar som" : "Silenciar";
  //   });
}

// ==================== 2. CARROSSEL DE LANÇAMENTOS ====================
function renderCarousel() {
  carouselTrack.innerHTML = LAUNCH_SLIDES.map(
    (slide) => `
      <article class="carousel-slide">
        <a
          href="#${slide.targetSection}"
          class="slide-banner-link"
          data-scroll-target="${slide.targetSection}"
          aria-label="${slide.imageAlt} — Compre agora"
        >
          <img src="${slide.image}" alt="${slide.imageAlt}" class="slide-banner-img" />
        </a>
      </article>
    `,
  ).join("");

  carouselDots.innerHTML = LAUNCH_SLIDES.map(
    (slide, idx) => `
      <button
        type="button"
        class="carousel-dot ${idx === 0 ? "active" : ""}"
        data-slide-index="${idx}"
        aria-label="Ir para o slide ${idx + 1}"
      ></button>
    `,
  ).join("");
}

function goToSlide(index) {
  const total = LAUNCH_SLIDES.length;
  currentSlideIndex = (index + total) % total;
  carouselTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

  carouselDots.querySelectorAll(".carousel-dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentSlideIndex);
  });
}

function initCarousel() {
  renderCarousel();

  carouselPrevBtn.addEventListener("click", () =>
    goToSlide(currentSlideIndex - 1),
  );
  carouselNextBtn.addEventListener("click", () =>
    goToSlide(currentSlideIndex + 1),
  );

  carouselDots.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-slide-index]");
    if (!dot) return;
    goToSlide(Number(dot.dataset.slideIndex));
  });

  launchesCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goToSlide(currentSlideIndex - 1);
    if (event.key === "ArrowRight") goToSlide(currentSlideIndex + 1);
  });

  let touchStartX = 0;
  launchesCarousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true },
  );

  launchesCarousel.addEventListener(
    "touchend",
    (e) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 45) {
        goToSlide(deltaX > 0 ? currentSlideIndex - 1 : currentSlideIndex + 1);
      }
    },
    { passive: true },
  );
}

// ==================== 3. PRODUTOS & BUSCA ====================
function renderProducts(query = "") {
  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(normalized) ||
          (p.collection && p.collection.toLowerCase().includes(normalized)),
      )
    : PRODUCTS;

  if (normalized) {
    searchStatus.hidden = false;
    searchStatusText.textContent =
      filtered.length > 0
        ? `Exibindo ${filtered.length} resultado(s) para "${query.trim()}"`
        : `Nenhum produto encontrado para "${query.trim()}"`;
  } else {
    searchStatus.hidden = true;
  }

  productsGrid.innerHTML = filtered
    .map(
      (product) => `
      <article class="product-card">
        <button
          type="button"
          class="product-image-btn"
          data-product-detail="${product.id}"
          aria-label="Ver detalhes de ${product.name}"
        >
          <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" />
        </button>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-meta">
          <button type="button" class="buy-btn" data-add-to-cart="${product.id}">
            COMPRAR
          </button>
          <span class="product-price">${product.priceFormatted}</span>
        </div>
      </article>
    `,
    )
    .join("");
}

function initProductsAndSearch() {
  renderProducts();

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderProducts(searchInput.value);
    navigateToSection("produtos");
  });

  searchInput.addEventListener("input", () => {
    renderProducts(searchInput.value);
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    renderProducts("");
  });

  productsGrid.addEventListener("click", (event) => {
    const buyBtn = event.target.closest("[data-add-to-cart]");
    if (buyBtn) {
      addToCart(buyBtn.dataset.addToCart);
      return;
    }

    const detailBtn = event.target.closest("[data-product-detail]");
    if (detailBtn) {
      openProductModal(detailBtn.dataset.productDetail);
    }
  });
}

// ==================== 4. SACOLA & MODAIS ====================
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("feneri_cart")) || [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("feneri_cart", JSON.stringify(cart));
}

function formatBRL(value) {
  if (!value || value === 0) return "R$ 00,00";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function addToCart(productId, size = "M") {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find(
    (item) => item.id === productId && item.size === size,
  );
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      qty: 1,
    });
  }

  saveCart();
  updateCartUI();
  showToast(`"${product.name}" adicionado à sacola!`);
}

function updateCartUI() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartBadge.textContent = String(totalQty);
  cartTotalValue.textContent = formatBRL(totalPrice);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="cart-empty">Sua sacola está vazia no momento.</p>`;
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item, idx) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <p class="cart-item-title">${item.name}</p>
          <p class="cart-item-price">Tamanho: ${item.size} · ${formatBRL(item.price)}</p>
          <div class="qty-controls">
            <button type="button" class="qty-btn" data-qty-delta="-1" data-cart-idx="${idx}" aria-label="Diminuir">-</button>
            <span>${item.qty}</span>
            <button type="button" class="qty-btn" data-qty-delta="1" data-cart-idx="${idx}" aria-label="Aumentar">+</button>
          </div>
        </div>
        <button type="button" class="remove-item-btn" data-remove-idx="${idx}">Remover</button>
      </div>
    `,
    )
    .join("");
}

function openCartDrawer() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
}

function closeCartDrawer() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
}

function openProductModal(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  modalContent.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap: 22px; align-items:center;">
      <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius:8px; background:#f5f5f6;" />
      <div>
        <h3 id="modal-title" style="font-size:1.2rem; margin-bottom:6px;">${product.name}</h3>
        <p style="font-weight:700; color:#581820; margin-bottom:12px;">${product.priceFormatted}</p>
        <p style="font-size:0.88rem; color:#4c505e; margin-bottom:16px;">${product.description}</p>
        <label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:6px;">TAMANHO</label>
        <select id="modal-size-select" style="padding:8px 12px; border:1px solid #ccc; border-radius:6px; margin-bottom:16px; width:100%;">
          ${product.sizes.map((s) => `<option value="${s}">${s}</option>`).join("")}
        </select>
        <button type="button" class="buy-btn" id="modal-buy-btn" style="width:100%; padding:11px;">
          ADICIONAR À SACOLA
        </button>
      </div>
    </div>
  `;

  appModal.hidden = false;

  document.getElementById("modal-buy-btn").addEventListener("click", () => {
    const chosenSize = document.getElementById("modal-size-select").value;
    addToCart(product.id, chosenSize);
    appModal.hidden = true;
  });
}

function openAccountModal() {
  modalContent.innerHTML = `
    <div>
      <h3 id="modal-title" style="font-size:1.25rem; color:#1e233b; margin-bottom:8px;">Minha Conta fenēri</h3>
      <p style="font-size:0.88rem; color:#4c505e; margin-bottom:18px;">Entre para acompanhar seus pedidos e lançamentos exclusivos.</p>
      <form id="account-login-form" style="display:flex; flex-direction:column; gap:12px;">
        <input type="email" required placeholder="Seu e-mail" style="padding:10px 12px; border:1px solid #d0d3dc; border-radius:8px;" />
        <input type="password" required placeholder="Sua senha" style="padding:10px 12px; border:1px solid #d0d3dc; border-radius:8px;" />
        <button type="submit" class="checkout-btn">Entrar</button>
      </form>
    </div>
  `;
  appModal.hidden = false;

  document
    .getElementById("account-login-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      appModal.hidden = true;
      showToast("Login realizado com sucesso!");
    });
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("is-visible");
  }, 2400);
}

function initCartAndModals() {
  updateCartUI();

  openCartBtn.addEventListener("click", openCartDrawer);
  closeCartBtn.addEventListener("click", closeCartDrawer);
  drawerBackdrop.addEventListener("click", closeCartDrawer);

  cartItemsContainer.addEventListener("click", (event) => {
    const qtyBtn = event.target.closest("[data-qty-delta]");
    if (qtyBtn) {
      const idx = Number(qtyBtn.dataset.cartIdx);
      const delta = Number(qtyBtn.dataset.qtyDelta);
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
      saveCart();
      updateCartUI();
      return;
    }

    const removeBtn = event.target.closest("[data-remove-idx]");
    if (removeBtn) {
      const idx = Number(removeBtn.dataset.removeIdx);
      cart.splice(idx, 1);
      saveCart();
      updateCartUI();
    }
  });

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Adicione pelo menos um item antes de finalizar.");
      return;
    }
    cart = [];
    saveCart();
    updateCartUI();
    closeCartDrawer();
    showToast("Pedido registrado! Obrigado por comprar na fenēri.");
  });

  openAccountBtn.addEventListener("click", openAccountModal);
  closeModalBtn.addEventListener("click", () => {
    appModal.hidden = true;
  });
  appModal.addEventListener("click", (event) => {
    if (event.target === appModal) appModal.hidden = true;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCartDrawer();
      appModal.hidden = true;
    }
  });
}

function initFooter() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterEmail = document.getElementById("newsletter-email");

  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = newsletterEmail.value.trim();
      if (!email) return;

      newsletterEmail.value = "";
      showToast(`E-mail ${email} cadastrado para novidades!`);
    });
  }
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  //   initVideoControls();
  initCarousel();
  initProductsAndSearch();
  initCartAndModals();
  initFooter();
});

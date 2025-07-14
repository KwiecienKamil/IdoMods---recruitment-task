let currentPage = 1;
let pageSize = 14;
let isMobileView = window.innerWidth <= 1250;

window.addEventListener("resize", () => {
  const nowMobile = window.innerWidth <= 1250;
  if (nowMobile !== isMobileView) {
    isMobileView = nowMobile;
    loadAllProducts();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const featuredContainer = document.getElementById("featured-products-cards");
  const perPageSelect = document.getElementById("products-per-page-select");

  const leftBtn = document.getElementById("slide-left");
  const rightBtn = document.getElementById("slide-right");

  const scrollByAmount = () => featuredContainer.offsetWidth;

  leftBtn.addEventListener("click", () => {
    featuredContainer.scrollBy({ left: -scrollByAmount(), behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    featuredContainer.scrollBy({ left: scrollByAmount(), behavior: "smooth" });
  });

  featuredContainer.addEventListener("scroll", () => {
    const maxScroll =
      featuredContainer.scrollWidth - featuredContainer.clientWidth;
    leftBtn.style.display = featuredContainer.scrollLeft > 0 ? "block" : "none";
    rightBtn.style.display =
      featuredContainer.scrollLeft < maxScroll - 1 ? "block" : "none";
  });

  perPageSelect.addEventListener("change", async () => {
    pageSize = parseInt(perPageSelect.value, 10);
    currentPage = 1;
    await loadAllProducts();
  });

  loadFeaturedProducts();
  loadAllProducts();

  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeBtn = document.getElementById("close-mobile-menu");

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.add("open");

    document.getElementById("overlay").classList.remove("hidden");
    document.getElementById("overlay").classList.add("visible");
  });

  closeBtn.addEventListener("click", closeMobileMenu);
  window.addEventListener("click", (e) => {
    if (e.target === mobileMenu || e.target === overlay) {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    mobileMenu.classList.add("hidden");

    const overlay = document.getElementById("overlay");
    overlay.classList.remove("visible");
    overlay.classList.add("hidden");
  }

  window.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove("open");
      mobileMenu.classList.add("hidden");
    }
  });
});

const sections = [
  { id: "hero", link: document.querySelector('nav ul li a[href="/"]') },
  {
    id: "featured-products",
    link: document.querySelector('nav ul li a[href="#featured-products"]'),
  },
  {
    id: "all-products",
    link: document.querySelector('nav ul li a[href="#all-products"]'),
  },
];

function highlightNav() {
  const scrollPos = window.scrollY + window.innerHeight / 3;

  sections.forEach(({ id, link }) => {
    const section = document.getElementById(id);
    if (!section || !link) return;

    let offsetTop = section.offsetTop;
    offsetTop -= 300;

    if (
      offsetTop <= scrollPos &&
      offsetTop + section.offsetHeight > scrollPos
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", highlightNav);

highlightNav();

window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY + window.innerHeight / 3;

  sections.forEach(({ id, link }) => {
    const section = document.getElementById(id);
    if (!section || !link) return;

    let offsetTop = section.offsetTop;
    if (id === "hero") {
      offsetTop -= 200;
    }

    if (
      offsetTop <= scrollPos &&
      offsetTop + section.offsetHeight > scrollPos
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

async function fetchFeaturedProducts() {
  try {
    const res = await fetch("https://brandstestowy.smallhost.pl/api/random");
    if (!res.ok) throw new Error("Network error");
    return await res.json();
  } catch (err) {
    console.error("Error fetching featured products:", err);
    return { data: [] };
  }
}

async function fetchAllProducts(pageNumber, pageSize) {
  try {
    const res = await fetch(
      `https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    if (!res.ok) throw new Error("Network error");
    const json = await res.json();
    console.log("Fetched products:", json);
    return json;
  } catch (err) {
    console.error("Error fetching all products:", err);
    return { data: [] };
  }
}

function renderProductCards(products, container, cardClass) {
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const rawPrice = Number((Math.random() * (400 - 100) + 100).toFixed(2));
    const formattedPrice = rawPrice.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
    });
    const price = `€ ${formattedPrice} EUR`;

    const card = document.createElement("div");
    card.className = cardClass;
    card.innerHTML = `
      <img src="${product.image}" alt="${product.text}" loading="lazy" />
      <div class="featured-product-info">
      <span>${product.text}</span>
      <p>${price}</p>
      </div>
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

function renderAllProductsWithBanner(products, container) {
  container.innerHTML = "";
  const total = products.length;

  if (total < 6) {
    renderProductCards(products, container, "all-product-card");
    return;
  }

  const firstRow = document.createElement("div");
  firstRow.className = "products-row";
  products
    .slice(0, 4)
    .forEach((p) =>
      firstRow.appendChild(createProductCard(p, "all-product-card"))
    );
  container.appendChild(firstRow);

  const banner = document.createElement("div");
  banner.className = "promo-banner";
  banner.style.backgroundImage = "url('./assets/mini-banner.jpg')";
  banner.style.backgroundSize = "cover";
  banner.style.backgroundPosition = "center";
  banner.style.backgroundRepeat = "no-repeat";
  banner.style.height = "100%";
  banner.style.position = "relative";

  const promoBannerHeading = document.createElement("div");
  promoBannerHeading.className = "promo-banner-heading";

  const promoBannerHeadingPTag = document.createElement("p");
  promoBannerHeadingPTag.textContent = `Forma'Sint.`;
  promoBannerHeading.appendChild(promoBannerHeadingPTag);

  const promoBannerHeadingH4Tag = document.createElement("h4");
  promoBannerHeadingH4Tag.textContent = `You'll look and feel like the champion`;
  promoBannerHeading.appendChild(promoBannerHeadingH4Tag);

  const promoBannerButton = document.createElement("button");
  promoBannerButton.id = "promo-banner-button";
  promoBannerButton.textContent = "CHECK THIS OUT ";

  const promoBannerIcon = document.createElement("span");
  promoBannerIcon.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
  promoBannerButton.appendChild(promoBannerIcon);

  banner.appendChild(promoBannerHeading);
  banner.appendChild(promoBannerButton);

  if (window.innerWidth < 1250) {
    const bannerRow = document.createElement("div");
    bannerRow.className = "products-row";
    bannerRow.appendChild(banner);
    container.appendChild(bannerRow);

    for (let i = 4; i < total; i += 2) {
      const row = document.createElement("div");
      row.className = "products-row";
      products
        .slice(i, i + 2)
        .forEach((p) =>
          row.appendChild(createProductCard(p, "all-product-card"))
        );
      container.appendChild(row);
    }
  } else {
    const secondRow = document.createElement("div");
    secondRow.className = "products-row";

    secondRow.appendChild(createProductCard(products[4], "all-product-card"));
    secondRow.appendChild(banner);
    secondRow.appendChild(createProductCard(products[5], "all-product-card"));

    container.appendChild(secondRow);

    for (let i = 6; i < total; i += 4) {
      const row = document.createElement("div");
      row.className = "products-row";
      products
        .slice(i, i + 4)
        .forEach((p) =>
          row.appendChild(createProductCard(p, "all-product-card"))
        );
      container.appendChild(row);
    }
  }
}

function createProductCard(product, className) {
  const rawPrice = Number((Math.random() * (400 - 100) + 100).toFixed(2));
  const formattedPrice = rawPrice.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
  });

  const formattedId = `ID: ${String(product.id).padStart(2, "0")}`;

  const card = document.createElement("div");
  card.className = className;
  card.innerHTML = `
    <img src="${product.image}" alt="${product.text}" loading="lazy" />
    <span class="product-id">${formattedId}</span>
  `;

  card.addEventListener("click", () => {
    const formattedId = `ID: ${String(product.id).padStart(2, "0")}`;
    openProductModal({
      imageSrc: product.image,
      id: formattedId,
    });
  });
  return card;
}

async function loadFeaturedProducts() {
  const container = document.getElementById("featured-products-cards");
  const spinner = document.getElementById("loading-spinner");

  spinner.classList.remove("hidden");
  container.innerHTML = "";

  const { data } = await fetchFeaturedProducts();
  renderProductCards(data || [], container, "featured-product-card");

  spinner.classList.add("hidden");
}

async function loadAllProducts() {
  const container = document.getElementById("all-products-wrapper");
  const spinner = document.getElementById("loading-spinner");

  spinner.classList.remove("hidden");
  container.innerHTML = "";

  const { data } = await fetchAllProducts(currentPage, pageSize);

  if (data && data.length >= 4) {
    renderAllProductsWithBanner(data, container);
  } else {
    renderProductCards(data || [], container, "all-product-card");
  }

  spinner.classList.add("hidden");
}

const modal = document.getElementById("product-modal");
const overlay = document.getElementById("overlay");
const closeModalBtn = document.getElementById("modal-close");

function openProductModal({ imageSrc, id }) {
  document.getElementById("modal-image").src = imageSrc;
  document.getElementById("modal-id").textContent = id;

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  overlay.classList.add("visible");
}

function closeProductModal() {
  modal.classList.add("hidden");
  overlay.classList.remove("visible");
  overlay.classList.add("hidden");
}

overlay.addEventListener("click", () => {
  if (!modal.classList.contains("hidden")) {
    closeProductModal();
  }
});

closeModalBtn.addEventListener("click", closeProductModal);

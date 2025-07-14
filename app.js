let currentPage = 1;
let pageSize = 14;

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
  });

  closeBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    mobileMenu.classList.add("hidden");
  });

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
    return await res.json();
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
      <h3>${product.text}</h3>
      <span>${price}</span>
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

function renderAllProductsWithBanner(products, container) {
  container.innerHTML = "";

  const total = products.length;
  const isWideScreen = window.innerWidth > 1250;

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

  const secondRow = document.createElement("div");
  secondRow.className = "products-row";

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

  if (isWideScreen) {
    secondRow.appendChild(createProductCard(products[4], "all-product-card"));
    secondRow.appendChild(banner);
  } else {
    secondRow.appendChild(createProductCard(products[4], "all-product-card"));
    secondRow.appendChild(banner);
  }

  if (products[5]) {
    secondRow.appendChild(createProductCard(products[5], "all-product-card"));
  } else {
    const empty = document.createElement("div");
    secondRow.appendChild(empty);
  }

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

function createProductCard(product, className) {
  const rawPrice = Number((Math.random() * (400 - 100) + 100).toFixed(2));
  const formattedPrice = rawPrice.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
  });
  const price = `€ ${formattedPrice} EUR`;

  const card = document.createElement("div");
  card.className = className;
  card.innerHTML = `
    <img src="${product.image}" alt="${product.text}" loading="lazy" style="max-width: 100%;" />
    <h3>${product.text}</h3>
    <span>${price}</span>
  `;
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

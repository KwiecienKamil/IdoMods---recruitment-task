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
      <img src="${product.image}" alt="${product.text}" loading="lazy" style="max-width: 100%;" />
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

  secondRow.appendChild(createProductCard(products[4], "all-product-card"));

  const banner = document.createElement("div");
  banner.className = "promo-banner";
  banner.textContent = "Promotional Banner";
  secondRow.appendChild(banner);

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
  const { data } = await fetchFeaturedProducts();
  const container = document.getElementById("featured-products-cards");
  renderProductCards(data || [], container, "featured-product-card");
}

async function loadAllProducts() {
  const { data } = await fetchAllProducts(currentPage, pageSize);
  const container = document.getElementById("all-products");
  if (data && data.length >= 4) {
    renderAllProductsWithBanner(data, container);
  } else {
    renderProductCards(data || [], container, "all-product-card");
  }
}

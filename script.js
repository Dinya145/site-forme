const cart = [];
const favorites = new Set();

const cartCount = document.getElementById("cartCount");
const cartDialog = document.getElementById("cartDialog");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const products = [...document.querySelectorAll(".product")];
const categoryFilter = document.getElementById("categoryFilter");
const emptyMessage = document.getElementById("emptyMessage");

const searchDialog = document.getElementById("searchDialog");
const searchInput = document.getElementById("searchInput");
const searchHint = document.getElementById("searchHint");
const favoritesDialog = document.getElementById("favoritesDialog");
const favoritesList = document.getElementById("favoritesList");
const favoritesEmpty = document.getElementById("favoritesEmpty");
const favoritesCount = document.getElementById("favoritesCount");

let searchQuery = "";

// Корзина
function updateCart() {
    cartCount.textContent = cart.length;
    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item) => {
        total += item.price;
        const row = document.createElement("div");
        row.className = "cart-item";
        row.textContent = `${item.name} — ${item.price.toLocaleString("ru-RU")} ₽`;
        cartItems.appendChild(row);
    });

    cartTotal.textContent = `${total.toLocaleString("ru-RU")} ₽`;
}

document.querySelectorAll(".add-button").forEach((button) => {
    button.addEventListener("click", () => {
        cart.push({
            name: button.dataset.name,
            price: Number(button.dataset.price)
        });

        updateCart();
        button.textContent = "Добавлено ✓";

        setTimeout(() => {
            button.textContent = "В корзину +";
        }, 1000);
    });
});

document.getElementById("cartButton").addEventListener("click", () => {
    updateCart();
    cartDialog.showModal();
});

document.getElementById("closeCart").addEventListener("click", () => {
    cartDialog.close();
});

// Фильтр категории и поиск работают вместе
function applyProductFilters() {
    const selectedCategory = categoryFilter.value;
    let visibleProducts = 0;

    products.forEach((product) => {
        const categoryMatches = selectedCategory === "all"
            || product.dataset.category === selectedCategory;

        const text = product.textContent.toLocaleLowerCase("ru-RU");
        const searchMatches = !searchQuery || text.includes(searchQuery);

        const isVisible = categoryMatches && searchMatches;
        product.hidden = !isVisible;

        if (isVisible) visibleProducts++;
    });

    emptyMessage.hidden = visibleProducts > 0;
    if (searchHint) {
        searchHint.textContent = visibleProducts
            ? `Найдено товаров: ${visibleProducts}`
            : "По вашему запросу ничего не найдено.";
    }
}

categoryFilter.addEventListener("change", applyProductFilters);

// Поиск
document.getElementById("searchButton").addEventListener("click", () => {
    searchDialog.showModal();
    searchInput.focus();
});

document.getElementById("closeSearch").addEventListener("click", () => {
    searchDialog.close();
});

searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.trim().toLocaleLowerCase("ru-RU");
    applyProductFilters();
});

searchDialog.addEventListener("close", () => {
    // Не сбрасываем запрос при закрытии: результаты остаются на странице.
});

// Избранное
function updateFavorites() {
    favoritesCount.textContent = favorites.size;

    products.forEach((product) => {
        const button = product.querySelector(".favorite-button");
        const isFavorite = favorites.has(product);

        button.classList.toggle("is-active", isFavorite);
        button.setAttribute("aria-pressed", String(isFavorite));
        button.setAttribute(
            "aria-label",
            isFavorite ? "Убрать из избранного" : "Добавить в избранное"
        );
        button.textContent = isFavorite ? "♥" : "♡";
    });

    favoritesList.innerHTML = "";

    const favoriteProducts = products.filter((product) => favorites.has(product));
    favoritesEmpty.hidden = favoriteProducts.length > 0;

    favoriteProducts.forEach((product) => {
        const name = product.querySelector("h3").textContent;
        const price = product.querySelector(".product-info strong").textContent;
        const row = document.createElement("div");
        row.className = "favorite-item";

        const title = document.createElement("span");
        title.textContent = name;

        const cost = document.createElement("strong");
        cost.textContent = price;

        row.append(title, cost);
        favoritesList.appendChild(row);
    });
}

document.querySelectorAll(".favorite-button").forEach((button) => {
    button.addEventListener("click", () => {
        const product = button.closest(".product");

        if (favorites.has(product)) {
            favorites.delete(product);
        } else {
            favorites.add(product);
        }

        updateFavorites();
    });
});

document.getElementById("favoritesButton").addEventListener("click", () => {
    updateFavorites();
    favoritesDialog.showModal();
});

document.getElementById("closeFavorites").addEventListener("click", () => {
    favoritesDialog.close();
});

// Закрытие диалогов по клику на затемнённую область
[cartDialog, searchDialog, favoritesDialog].forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
});

// Мобильное меню
document.getElementById("menuButton").addEventListener("click", () => {
    document.getElementById("mobileNavigation").classList.toggle("open");
});

document.querySelectorAll(".mobile-navigation a").forEach((link) => {
    link.addEventListener("click", () => {
        document.getElementById("mobileNavigation").classList.remove("open");
    });
});

// Форма подписки
document.getElementById("newsletterForm").addEventListener("submit", (event) => {
    event.preventDefault();

    document.getElementById("formMessage").textContent =
        "Спасибо за подписку! Это демонстрационная форма.";

    event.target.reset();
});

updateCart();
updateFavorites();

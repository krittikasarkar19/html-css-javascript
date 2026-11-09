
document.addEventListener("DOMContentLoaded", () => {

    // SELECT ELEMENTS

    const cards = [...document.querySelectorAll(".blog-card")];

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    const savedFilter = document.getElementById("savedFilter");
    const resultCount = document.getElementById("resultCount");
    const emptyMessage = document.getElementById("emptyMessage");

    const blogGrid = document.getElementById("blogGrid");

    // MODAL ELEMENTS

    const modal = document.getElementById("blogModal");
    const closeModal = document.getElementById("closeModal");

    const modalTitle = document.getElementById("modalTitle");
    const modalCategory = document.getElementById("modalCategory");
    const modalDate = document.getElementById("modalDate");
    const modalAuthor = document.getElementById("modalAuthor");
    const modalContent = document.getElementById("modalContent");

    // THEME ELEMENTS

    const themeToggle = document.getElementById("themeToggle");


    // SAVED POSTS

    let savedBlogs = [];

    try {
        const storedBlogs = JSON.parse(
            localStorage.getItem("savedBlogs") || "[]"
        );

        if (Array.isArray(storedBlogs)) {
            savedBlogs = storedBlogs.filter(
                title => typeof title === "string"
            );
        }
    } catch (error) {
        savedBlogs = [];
    }

    let showSavedOnly = false;


    // 1. BOOKMARK FUNCTIONALITY

    cards.forEach(card => {

        const title = card.querySelector(".card-title").textContent.trim();

        const bookmarkButton = card.querySelector(".bookmark-btn");

        function updateBookmark() {

            const isSaved = savedBlogs.includes(title);

            bookmarkButton.textContent = isSaved ? "★" : "☆";

            bookmarkButton.classList.toggle("saved", isSaved);

            bookmarkButton.setAttribute(
                "aria-pressed",
                String(isSaved)
            );

            bookmarkButton.setAttribute(
                "aria-label",
                isSaved ? "Remove bookmark" : "Save bookmark"
            );
        }

        updateBookmark();

        bookmarkButton.addEventListener("click", () => {

            if (savedBlogs.includes(title)) {

                savedBlogs = savedBlogs.filter(
                    blog => blog !== title
                );

            } else {

                savedBlogs.push(title);

            }

            localStorage.setItem(
                "savedBlogs",
                JSON.stringify(savedBlogs)
            );

            updateBookmark();

            filterBlogs();
        });

    });


    // 2. SEARCH AND CATEGORY FILTER

    function filterBlogs() {

        const searchText = searchInput.value.toLowerCase().trim();

        const selectedCategory = categoryFilter.value;

        let visibleCount = 0;

        cards.forEach(card => {

            const title = card.querySelector(".card-title")
                .textContent.toLowerCase();

            const excerpt = card.querySelector(".card-excerpt")
                .textContent.toLowerCase();

            const author = card.querySelector(".author span")
                .textContent.toLowerCase();

            const category = card.dataset.category;

            const matchesSearch =
                title.includes(searchText) ||
                excerpt.includes(searchText) ||
                author.includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            const cardTitle = card.querySelector(".card-title")
                .textContent.trim();

            const matchesSaved =
                !showSavedOnly || savedBlogs.includes(cardTitle);

            const isVisible =
                matchesSearch && matchesCategory && matchesSaved;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }

        });

        resultCount.textContent =
            `Showing ${visibleCount} of ${cards.length} blog posts`;

        emptyMessage.hidden = visibleCount !== 0;
    }

    searchInput.addEventListener("input", filterBlogs);

    categoryFilter.addEventListener("change", filterBlogs);


    // 3. SAVED POSTS FILTER

    savedFilter.addEventListener("click", () => {

        showSavedOnly = !showSavedOnly;

        savedFilter.classList.toggle("active", showSavedOnly);

        savedFilter.textContent = showSavedOnly
            ? "★ Show All Posts"
            : "☆ Saved Posts";

        filterBlogs();

    });


    // 4. SORT POSTS BY DATE

    sortFilter.addEventListener("change", () => {

        const sortedCards = [...cards].sort((a, b) => {

            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);

            return sortFilter.value === "newest"
                ? dateB - dateA
                : dateA - dateB;

        });

        sortedCards.forEach(card => {
            blogGrid.appendChild(card);
        });

    });


    // 5. READ MORE MODAL

    let previouslyFocusedElement = null;

    cards.forEach(card => {

        const readButton = card.querySelector(".read-btn");

        readButton.addEventListener("click", () => {

            previouslyFocusedElement = readButton;

            modalTitle.textContent =
                card.querySelector(".card-title").textContent;

            modalCategory.textContent =
                card.dataset.category;

            modalDate.textContent =
                card.querySelector(".card-meta span").textContent;

            modalAuthor.textContent =
                card.querySelector(".author span").textContent;

            modalContent.textContent =
                card.querySelector(".full-content").textContent.trim();

            modal.classList.add("active");

            modal.setAttribute("aria-hidden", "false");

            document.body.style.overflow = "hidden";

            closeModal.focus();

        });

    });


    // CLOSE MODAL FUNCTION

    function hideModal() {

        modal.classList.remove("active");

        modal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }

    }

    closeModal.addEventListener("click", hideModal);


    // CLOSE WHEN CLICKING OUTSIDE

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            hideModal();
        }

    });


    // CLOSE USING ESCAPE KEY

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {
            hideModal();
        }

    });


    // 6. DARK AND LIGHT MODE

    function updateTheme(isLight) {

        document.body.classList.toggle("light-theme", isLight);

        themeToggle.textContent = isLight
            ? "🌙 Dark Mode"
            : "☀️ Light Mode";

        themeToggle.setAttribute(
            "aria-pressed",
            String(isLight)
        );

    }

    let isLightTheme = localStorage.getItem("blogTheme") === "light";

    updateTheme(isLightTheme);

    themeToggle.addEventListener("click", () => {

        isLightTheme = !isLightTheme;

        localStorage.setItem(
            "blogTheme",
            isLightTheme ? "light" : "dark"
        );

        updateTheme(isLightTheme);

    });


    // INITIAL DISPLAY

    filterBlogs();

});

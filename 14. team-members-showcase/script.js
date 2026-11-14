
const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");
const themeToggle = document.getElementById("themeToggle");
const memberCount = document.getElementById("memberCount");

const teamGrid = document.querySelector(".team-grid");
const teamCards = document.querySelectorAll(".team-card");

// Search and Department Filter
function filterMembers() {

    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedDepartment = departmentFilter.value;

    let visibleCount = 0;

    teamCards.forEach(card => {

        const name = card.querySelector("h3").textContent.toLowerCase();
        const role = card.querySelector(".role").textContent.toLowerCase();
        const department = card.dataset.department;

        const matchesSearch =
            name.includes(searchValue) || role.includes(searchValue);

        const matchesDepartment =
            selectedDepartment === "all" ||
            department === selectedDepartment;

        if (matchesSearch && matchesDepartment) {

            card.classList.remove("hidden");
            visibleCount++;

        } else {

            card.classList.add("hidden");

        }

    });

    memberCount.textContent =
        `Showing ${visibleCount} of ${teamCards.length} team members`;

    // No Results Message
    let noResults = document.querySelector(".no-results");

    if (visibleCount === 0) {

        if (!noResults) {
            noResults = document.createElement("p");
            noResults.className = "no-results";
            noResults.textContent = "No team members found.";
            teamGrid.appendChild(noResults);
        }

    } else if (noResults) {

        noResults.remove();

    }

}

// Search Event
searchInput.addEventListener("input", filterMembers);

// Department Filter Event
departmentFilter.addEventListener("change", filterMembers);


// Dark and Light Theme
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const isLight = document.body.classList.contains("light-theme");

    themeToggle.innerHTML = isLight
        ? '<i class="fas fa-sun"></i> Light'
        : '<i class="fas fa-moon"></i> Dark';

});

// Initial Member Count
filterMembers();

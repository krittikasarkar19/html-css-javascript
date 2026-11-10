
// ========================================
// 1. PARTICIPANT DATA
// ========================================

const defaultUsers = [
    {
        id: 1,
        name: "Emma Wilson",
        username: "@emmaw",
        week: 2850,
        month: 8500,
        allTime: 15000,
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 2,
        name: "James Chen",
        username: "@jchen",
        week: 2540,
        month: 7900,
        allTime: 14000,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 3,
        name: "Sofia Garcia",
        username: "@sofig",
        week: 2210,
        month: 7200,
        allTime: 13000,
        avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
        id: 4,
        name: "Michael Brown",
        username: "@mikeb",
        week: 1890,
        month: 6500,
        allTime: 12000,
        avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
        id: 5,
        name: "Olivia Taylor",
        username: "@oliviat",
        week: 1650,
        month: 5800,
        allTime: 11000,
        avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    {
        id: 6,
        name: "David Kim",
        username: "@dkim",
        week: 1420,
        month: 4900,
        allTime: 10000,
        avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    {
        id: 7,
        name: "Ava Martinez",
        username: "@avam",
        week: 1180,
        month: 4200,
        allTime: 9000,
        avatar: "https://randomuser.me/api/portraits/women/29.jpg"
    },
    {
        id: 8,
        name: "Krittika Sarkar",
        username: "@krittika",
        week: 980,
        month: 3500,
        allTime: 8000,
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        isYou: true
    }
];


// ========================================
// 2. DOM ELEMENTS
// ========================================

const podium = document.getElementById("podium");
const leaderboardList = document.getElementById("leaderboardList");

const searchInput = document.getElementById("searchInput");
const periodFilter = document.getElementById("periodFilter");

const totalUsers = document.getElementById("totalUsers");
const highestScore = document.getElementById("highestScore");
const yourRank = document.getElementById("yourRank");

const participantCount = document.getElementById("participantCount");
const emptyMessage = document.getElementById("emptyMessage");

const addUserForm = document.getElementById("addUserForm");
const formMessage = document.getElementById("formMessage");


// ========================================
// 3. LOAD DATA FROM LOCAL STORAGE
// ========================================

function loadUsers() {
    try {
        const savedUsers = localStorage.getItem("leaderboardUsers");

        if (savedUsers === null) {
            return structuredClone(defaultUsers);
        }

        const parsedUsers = JSON.parse(savedUsers);

        if (
            !Array.isArray(parsedUsers) ||
            parsedUsers.some(user =>
                !user ||
                !Number.isSafeInteger(user.id) ||
                typeof user.name !== "string" ||
                typeof user.username !== "string" ||
                !["week", "month", "allTime"].every(key =>
                    Number.isSafeInteger(user[key]) && user[key] >= 0
                )
            )
        ) {
            return structuredClone(defaultUsers);
        }

        return parsedUsers;

    } catch (error) {
        console.error("Unable to load leaderboard data:", error);
        return structuredClone(defaultUsers);
    }
}

let users = loadUsers();


// ========================================
// 4. SAVE DATA
// ========================================

function saveUsers() {
    try {
        localStorage.setItem("leaderboardUsers", JSON.stringify(users));
    } catch (error) {
        console.error("Unable to save leaderboard data:", error);
        alert("Could not save changes. Check your browser storage.");
    }
}


// ========================================
// 5. GET CURRENT PERIOD SCORE
// ========================================

function getCurrentPeriod() {
    return periodFilter.value;
}

function getScore(user) {
    return user[getCurrentPeriod()];
}


// ========================================
// 6. SORT USERS BY SCORE
// ========================================

function getSortedUsers() {

    return [...users].sort((a, b) => {
        return getScore(b) - getScore(a) || a.id - b.id;
    });

}


// ========================================
// 7. DISPLAY STATISTICS
// ========================================

function updateStatistics() {

    const sortedUsers = getSortedUsers();

    totalUsers.textContent = users.length;

    highestScore.textContent = users.length
        ? getScore(sortedUsers[0]).toLocaleString("en-IN")
        : "0";

    const myPosition = sortedUsers.findIndex(user => user.isYou);

    yourRank.textContent = myPosition === -1
        ? "--"
        : `#${myPosition + 1}`;

}


// ========================================
// 8. ESCAPE USER INPUT
// ========================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });

}


// ========================================
// 9. CREATE ACTION BUTTONS
// ========================================

function createActions(userId) {

    return `
        <div class="actions">

            <button class="increase"
                data-action="increase"
                data-id="${userId}"
                aria-label="Increase score">
                <i class="fa-solid fa-plus"></i>
            </button>

            <button class="decrease"
                data-action="decrease"
                data-id="${userId}"
                aria-label="Decrease score">
                <i class="fa-solid fa-minus"></i>
            </button>

            <button class="delete"
                data-action="delete"
                data-id="${userId}"
                aria-label="Delete participant">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>
    `;
}


// ========================================
// 10. DISPLAY TOP THREE
// ========================================

function displayPodium(sortedUsers) {

    const topThree = sortedUsers.slice(0, 3);

    const medals = ["🥇", "🥈", "🥉"];

    const positions = ["first", "second", "third"];

    podium.innerHTML = topThree.map((user, index) => {

        return `
            <div class="podium-card ${positions[index]}">

                <div class="medal">${medals[index]}</div>

                <img
                    src="${escapeHTML(user.avatar)}"
                    alt="${escapeHTML(user.name)}"
                    class="podium-avatar"
                    loading="lazy"
                >

                <h3>
                    ${escapeHTML(user.name)}
                    ${user.isYou
                        ? '<span class="you-label">YOU</span>'
                        : ""}
                </h3>

                <p>${escapeHTML(user.username)}</p>

                <span class="podium-score">
                    ${getScore(user).toLocaleString("en-IN")} pts
                </span>

                ${createActions(user.id)}

            </div>
        `;

    }).join("");

}


// ========================================
// 11. DISPLAY REMAINING USERS
// ========================================

function displayLeaderboard(sortedUsers) {

    const remainingUsers = sortedUsers.slice(3);

    leaderboardList.innerHTML = remainingUsers.map((user, index) => {

        const rank = index + 4;

        return `
            <div class="item">

                <span class="rank">${rank}</span>

                <div class="user-info">

                    <img
                        src="${escapeHTML(user.avatar)}"
                        alt="${escapeHTML(user.name)}"
                        class="avatar"
                        loading="lazy"
                    >

                    <div class="user-details">

                        <h3>
                            ${escapeHTML(user.name)}

                            ${user.isYou
                                ? '<span class="you-label">YOU</span>'
                                : ""}
                        </h3>

                        <p>${escapeHTML(user.username)}</p>

                    </div>

                </div>

                <span class="score">
                    ${getScore(user).toLocaleString("en-IN")}
                </span>

                ${createActions(user.id)}

            </div>
        `;

    }).join("");

}


// ========================================
// 12. SEARCH PARTICIPANTS
// ========================================

function searchUsers() {

    const searchTerm = searchInput.value
        .trim()
        .toLowerCase();

    const filteredUsers = getSortedUsers().filter(user => {

        return (
            user.name.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm)
        );

    });

    displayPodium(filteredUsers);
    displayLeaderboard(filteredUsers);

    participantCount.textContent =
        `${filteredUsers.length} participants`;

    emptyMessage.hidden = filteredUsers.length !== 0;

}


// ========================================
// 13. MAIN RENDER FUNCTION
// ========================================

function renderLeaderboard() {

    updateStatistics();

    searchUsers();

}


// ========================================
// 14. ADD NEW PARTICIPANT
// ========================================

addUserForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("userName")
        .value.trim();

    let username = document.getElementById("userUsername")
        .value.trim();

    const score = Number(document.getElementById("userScore").value);

    username = username.startsWith("@")
        ? username
        : `@${username}`;

    if (!name || username.length < 2) {
        formMessage.textContent = "Please enter valid details.";
        return;
    }

    if (!Number.isSafeInteger(score) || score < 0 || score > 1000000) {
        formMessage.textContent = "Enter a valid score between 0 and 1,000,000.";
        return;
    }

    const alreadyExists = users.some(user =>
        user.username.toLowerCase() === username.toLowerCase()
    );

    if (alreadyExists) {
        formMessage.textContent = "This username already exists!";
        return;
    }

    const newUser = {

        id: Date.now(),

        name: name,

        username: username,

        week: score,

        month: score,

        allTime: score,

        avatar:
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=243047&color=ffffff&rounded=true`

    };

    users.push(newUser);

    saveUsers();

    addUserForm.reset();

    document.getElementById("userScore").value = 100;

    searchInput.value = "";

    formMessage.textContent = "Participant added successfully!";

    renderLeaderboard();

});


// ========================================
// 15. INCREASE / DECREASE / DELETE
// ========================================

function handleUserAction(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const userId = Number(button.dataset.id);

    const action = button.dataset.action;

    const user = users.find(user => user.id === userId);

    if (!user) return;

    const period = getCurrentPeriod();

    if (action === "increase") {

        if (user[period] > 999999949) {
            alert("Maximum score reached!");
            return;
        }

        user[period] += 50;

    }

    else if (action === "decrease") {

        user[period] = Math.max(0, user[period] - 50);

    }

    else if (action === "delete") {

        const confirmed = confirm(
            `Are you sure you want to delete ${user.name}?`
        );

        if (!confirmed) return;

        users = users.filter(user => user.id !== userId);

    }

    saveUsers();

    renderLeaderboard();

}


// Event delegation for both podium and ranking list

podium.addEventListener("click", handleUserAction);

leaderboardList.addEventListener("click", handleUserAction);


// ========================================
// 16. FILTER BY TIME PERIOD
// ========================================

periodFilter.addEventListener("change", function() {

    renderLeaderboard();

});


// ========================================
// 17. SEARCH EVENT
// ========================================

searchInput.addEventListener("input", function() {

    searchUsers();

});


// ========================================
// 18. INITIALIZE PROJECT
// ========================================

renderLeaderboard();

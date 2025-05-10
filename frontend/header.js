const createLoginheader = () => {
    const loginDiv = document.querySelector("#loginDiv");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return;
    }

    loginDiv.innerHTML = `
        <div class="loggedinUserHeader">
            <button class="user-account-btn" id="profilePage">
                <img src="/login1.png" />
                <span>${user.username}'s konto</span>
            </button>
            <button class="user-account-btn" id="logoutBtn">
                <img src="/logout.png" />
                <span>Logga ut</span>
            </button>
        </div>
    `;

    const logout = document.querySelector("#logoutBtn");
    logout.addEventListener("click", () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        window.location.href = "index.html";
    });

    document.querySelector("#profilePage").addEventListener("click", async () => {
        window.location.href = "profile-page.html";
    });
};

const jwt = localStorage.getItem("jwt");
if (jwt) {
    createLoginheader();
}

const baseUrl = "http://localhost:1337";

const getLoggedInUser = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return null;
    
    const response = await axios.get(`${baseUrl}/api/users/me`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
    return response.data;
};

const createLoginheader = async () => {
    const loginDiv = document.querySelector("#loginDiv");

    const user = await getLoggedInUser();
    if (!user) return;

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

    document.querySelector("#logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("jwt");
        window.location.href = "index.html";
    });

    document.querySelector("#profilePage").addEventListener("click", () => {
        window.location.href = "profile-page.html";
    });
};

const getDisplayColor = async () => {
    const response = await axios.get(`${baseUrl}/api/display-color`);
    const data = response.data;
    console.log(data);

    const colorTheme = data.data.colorTheme;
    console.log(colorTheme);

    document.body.classList.add(colorTheme);
};
  
getDisplayColor();
createLoginheader();

export { baseUrl, getLoggedInUser, createLoginheader, getDisplayColor };
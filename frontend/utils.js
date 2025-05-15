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
                <img src="/login-white.png" />
                <span class="log-span">${user.username}'s konto</span>
            </button>
            <button class="user-account-btn" id="logoutBtn">
                <img src="/logout-white.png" />
                <span class="log-span">Logga ut</span>
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
  
const getAverageRating = async (ratings) => {
    if (!ratings || ratings.length === 0) return null;
    let totalSum = 0;
    for (let i = 0; i < ratings.length; i++) {
      totalSum += ratings[i].value;
    }
    return totalSum / ratings.length;
  };
  
  const getAverageRatingForBook = async (bookId) => {
    try {
        const response = await axios.get(`${baseUrl}/api/ratings?filters[book][id][$eq]=${bookId}`);
        const ratings = response.data.data;
        return await getAverageRating(ratings);
    } catch (error) {
        console.error("Kunde inte hämta betyg för bok:", bookId, error);
        return null;
    }
};

export { baseUrl, getLoggedInUser, createLoginheader, getDisplayColor, getAverageRating, getAverageRatingForBook };
const bookDiv = document.querySelector("#bookDivContainer");

const baseUrl = "http://localhost:1337";

const getData = async () => {
    const respons = await axios.get(`${baseUrl}/api/books?populate=*`);
    const data = respons.data;
    console.log(data);
    return data;
};

const renderPage = async () => {
    let books = await getData();

    books.data.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("bookCard")
        const imgUrl = baseUrl + book.image.url;

        bookCard.innerHTML = `
            <img src="${imgUrl}" alt="Bokomslag" class="bookImg" />
            <h2>${book.title}</h2>
            <p> ${book.author}</p>
            <p>Antal sidor: ${book.pages}</p>
            <p>Utg.datum: ${book.releaseDate}</P>
            <p>Betyg: ${book.rating}</p>
        `;

        bookDiv.append(bookCard);
    });  
};

renderPage();

const getDisplayColor = async () => {
    const response = await axios.get(`${baseUrl}/api/display-color`);
    const data = response.data;
    console.log(data);

    const colorTheme = data.data.colorTheme;
    console.log(colorTheme);

    document.body.classList.add(colorTheme);
};
  
getDisplayColor();

const openModalBtn = document.querySelector("#loginDiv");
const closeModalBtn = document.querySelector("#closeModalBtn");
const loginModal = document.querySelector("#loginModal");

openModalBtn.addEventListener("click", () => {
    loginModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
    loginModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }
});

const loginView = document.querySelector("#loginView");
const registerView = document.querySelector("#registerView");

document.querySelector("#createAccountBtn").addEventListener("click", () => {
    loginView.style.display = "none";
    registerView.style.display = "block";
});

//INLOGGNING

document.querySelector("#loginAccountBtn").addEventListener("click", async () => {
    const loginUsername = document.querySelector("#loginUsername").value;
    const loginPassword = document.querySelector("#loginPassword").value;

    const response = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: loginUsername,
        password: loginPassword
    });

    const jwt = response.data.jwt;
    const user = response.data.user;

    console.log("Inloggad som:", user.username);
    console.log("JWT-token:", jwt);

    localStorage.setItem("jwt", jwt);

    alert("Inloggning lyckades!");
    loginModal.style.display = "none";

    createLoginheader(user);
});

//REGISTRERING

document.querySelector("#saveNewAccountBtn").addEventListener("click", async () => {
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    
    const response = await axios.post("http://localhost:1337/api/auth/local/register", {
    username,
    email,
    password,
});

alert("Konto skapades! Du kan nu logga in.");

registerView.style.display = "none";
loginView.style.display = "block";
});

const createLoginheader = (user) => {
    const loginDiv = document.querySelector("#loginDiv");
    loginDiv.innerHTML = `
    <div class="loggedinUserHeader">
    <button class="user-account-btn">
        <img src="/login1.png" />
        <span>${user.username}'s konto</span>
    </button>
    <button class="user-account-btn">
        <img src="/logout.png" />
        <span>Logga ut</span>
    </button>
    </div>
    `;
    // loginDiv.removeEventListener("click", openModal); // Tar bort möjligheten att öppna modalen
};

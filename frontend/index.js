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
            <div class="heart-and-raiting-container">
                <div class="rating" data-id="${book.id}">
                ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-rating="${i}">&#9733;</span>`).join("")}
                </div>
                <button class="to-read-btn" data-id="${book.id}">
                <img src="/favorite2.png" />
                </button>
            </div>
        `;

        bookDiv.append(bookCard);
    });

    const toReadBtns = document.querySelectorAll(".to-read-btn");

    toReadBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const bookId = Number(btn.getAttribute("data-id"));
            console.log(bookId);

            const jwt = localStorage.getItem("jwt");
            const user = JSON.parse(localStorage.getItem("user"));
            if (!jwt) {
                alert("Du måste vara inloggad för att lägga till i läsa-listan.");
                return;
            }

            // Skickar bok-ID och användar-ID till Strapi
            await axios.post(`${baseUrl}/api/saveds`, {
                data: {
                    book: bookId,
                    users_permissions_user: user.id // Skickar användarens ID
                }
            }, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
        });
    });
};

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

    const response = await axios.post(`${baseUrl}/api/auth/local`, {
        identifier: loginUsername,
        password: loginPassword
    });

    const jwt = response.data.jwt;
    const user = response.data.user;

    console.log("Inloggad som:", user.username);
    console.log("JWT-token:", jwt);

    localStorage.setItem("jwt", jwt);
    localStorage.setItem("user", JSON.stringify(user)); // Spara användaren i localStorage

    alert("Inloggning lyckades!");
    loginModal.style.display = "none";

    createLoginheader(user);
});

//REGISTRERING

document.querySelector("#saveNewAccountBtn").addEventListener("click", async () => {
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    
    const response = await axios.post(`${baseUrl}/api/auth/local/register`, {
        username,
        email,
        password,
    });

    alert("Konto skapades! Du kan nu logga in.");

    registerView.style.display = "none";
    loginView.style.display = "block";
});

renderPage();
getDisplayColor();
createLoginheader();

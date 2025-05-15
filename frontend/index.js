import { baseUrl, getLoggedInUser, createLoginheader, getDisplayColor, getAverageRating, getAverageRatingForBook } from "./utils.js";

const bookDiv = document.querySelector("#bookDivContainer");

const getData = async () => {
    const respons = await axios.get(`${baseUrl}/api/books?populate=*`);
    const data = respons.data;
    return data;
};

const renderPage = async () => {
    let books = await getData();

    for (const book of books.data) {
        const bookCard = document.createElement("div");
        bookCard.classList.add("bookCard");
        const imgUrl = baseUrl + book.image.url;
        const bookId = book.id;
    
        const average = await getAverageRatingForBook(bookId);
    
        bookCard.innerHTML = `
            <img src="${imgUrl}" alt="Bokomslag" class="bookImg" />
            <h2>${book.title}</h2>
            <p>${book.author}</p>
            <p>Antal sidor: ${book.pages}</p>
            <p>Utg.datum: ${book.releaseDate}</p>
            <p>Snittbetyg: ${average !== null ? average.toFixed(1) : "Ej betygsatt"}</p>
            <div class="heart-and-raiting-container">
                <div class="rating" data-id="${book.id}">
                    <span class="fa fa-star" data-rating="1"></span>
                    <span class="fa fa-star" data-rating="2"></span>
                    <span class="fa fa-star" data-rating="3"></span>
                    <span class="fa fa-star" data-rating="4"></span>
                    <span class="fa fa-star" data-rating="5"></span>
                </div>
                <button class="to-read-btn" data-id="${book.id}">
                    <span style='font-size:25px;' class="heart-icon">&#9825;</span>
                </button>
            </div>
        `;
    
        bookDiv.append(bookCard);
    }
    

    const toReadBtns = document.querySelectorAll(".to-read-btn");

    toReadBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const bookId = Number(btn.dataset.id);
            const jwt = localStorage.getItem("jwt");
            const user = await getLoggedInUser();

            if (!jwt) {
                alert("Du måste vara inloggad för att lägga till i läsa-listan.");
                return;
            }

            await axios.post(`${baseUrl}/api/saveds`, {
                data: {
                    book: bookId,
                    user: user.id
                }
            }, {
                headers: { Authorization: `Bearer ${jwt}` }
            });

            const heart = btn.querySelector(".heart-icon");
            heart.style.color = "red";
        });
    });
};

const handleRatings = () => {
    const ratingContainers = document.querySelectorAll(".rating");

    ratingContainers.forEach(container => {
        const stars = container.querySelectorAll(".fa-star");

        stars.forEach(star => {
            star.addEventListener("click", async () => {
                const ratingValue = Number(star.getAttribute("data-rating"));
                console.log(ratingValue)
                const bookId = container.getAttribute("data-id");
                console.log(bookId)
                const jwt = localStorage.getItem("jwt");
                console.log(jwt)
                const user = await getLoggedInUser();

                if (!jwt) {
                    alert("Du måste vara inloggad för att sätta betyg.");
                    return;
                }
                
                await axios.post(`${baseUrl}/api/ratings`, {
                    data: {
                        value: ratingValue,
                        book: bookId,
                        user: user.id
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
                
                star.style.color = "orange";
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

// Inloggning
document.querySelector("#loginAccountBtn").addEventListener("click", async () => {
    const loginUsername = document.querySelector("#loginUsername").value;
    const loginPassword = document.querySelector("#loginPassword").value;

    const response = await axios.post(`${baseUrl}/api/auth/local`, {
        identifier: loginUsername,
        password: loginPassword
    });

    const jwt = response.data.jwt;
    const user = response.data.user;

    localStorage.setItem("jwt", jwt);
    localStorage.setItem("user", JSON.stringify(user));

    alert("Inloggning lyckades!");
    loginModal.style.display = "none";

    createLoginheader(user);
});

// Registrering
document.querySelector("#saveNewAccountBtn").addEventListener("click", async () => {
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const response = await axios.post(`${baseUrl}/api/auth/local/register`, {
        username,
        email,
        password
    });

    alert("Konto skapades! Du kan nu logga in.");
    registerView.style.display = "none";
    loginView.style.display = "block";
});

renderPage().then(() => {
    handleRatings();
});

getAverageRating();
getAverageRatingForBook();
getDisplayColor();
createLoginheader();

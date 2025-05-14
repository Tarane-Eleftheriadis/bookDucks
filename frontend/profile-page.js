import { baseUrl, getLoggedInUser, createLoginheader, getDisplayColor } from "./utils.js";

const savedBooksDiv = document.querySelector("#savedBooksDivContainer");
const sortSavedBooksDropdown = document.querySelector("#sortSavedBooks");

const getDataSavedBooks = async () => {
    const user = await getLoggedInUser();
    const jwt = localStorage.getItem("jwt");

    const respons = await axios.get(
        `${baseUrl}/api/saveds?filters[user][id][$eq]=${user.id}&populate[book][populate]=image`,
        {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }
    );
    console.log("Sparade böcker:", respons.data);
    return respons.data.data;
};

const renderPageSavedBooks = (books) => {
    savedBooksDiv.innerHTML = "";

    books.forEach(item => {
        const book = item.book;
        const imgUrl = baseUrl + book.image.url;

        const savedBookCard = document.createElement("div");
        savedBookCard.classList.add("bookCard", "savedBookCard");

        savedBookCard.innerHTML = `
            <img src="${imgUrl}" alt="Bokomslag" class="bookImg" />
            <h2>${book.title}</h2>
            <p>${book.author}</p>
            <p>Antal sidor: ${book.pages}</p>
            <p>Utg.datum: ${book.releaseDate}</p>
            <p>Betyg: ${book.rating}</p>
            <button class="remove-btn" data-id="${item.id}">
                <img src="/delete_red.png" />
            </button>
        `;

        const deleteBtn = savedBookCard.querySelector(".remove-btn");
        deleteBtn.addEventListener("click", async () => {
            const jwt = localStorage.getItem("jwt");

            try {
                const response = await axios.delete(`${baseUrl}/api/saveds/${item.documentId}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });

                console.log("Boken raderades från API:", response);
                console.log(item.id)
                savedBookCard.remove();
            } catch (error) {
                console.error("Kunde inte radera bok från API:", error.response?.data || error.message);
                
                alert("Det gick inte att radera boken. Kontrollera om du är inloggad och har rätt behörigheter.");
            }
        });

        savedBooksDiv.append(savedBookCard);
    });
};

getDataSavedBooks().then(books => {
    renderPageSavedBooks(books);
});

sortSavedBooksDropdown.addEventListener("change", async () => {
    const selectValue = sortSavedBooksDropdown.value;
    let books = await getDataSavedBooks();

    if (selectValue === "author") {
        books.sort((a, b) => a.book.author.localeCompare(b.book.author));
    } else if (selectValue === "title") {
        books.sort((a, b) => a.book.title.localeCompare(b.book.title));
    }

    renderPageSavedBooks(books);
});

const ratedBooksDiv = document.querySelector("#ratedBooksDivContainer");

const getRatedBooks = async () => {
    const jwt = localStorage.getItem("jwt");
    const user = await getLoggedInUser();


    const raitings = await axios.get(`${baseUrl}/api/ratings?filters[user][id][$eq]=${user.id}&populate[book][populate]=image`, {
        headers: { Authorization: `Bearer ${jwt}` }
    });

    return raitings.data.data;
};

const renderRatedBooks = (raitings) => {
    ratedBooksDiv.innerHTML= "";

    raitings.forEach(item => {
        const book = item.book;
        const imgUrl = baseUrl + book.image.url;

        const ratedBookCard = document.createElement("div");
        ratedBookCard.classList.add("bookCard", "ratedBookCard");

        ratedBookCard.innerHTML = `
            <img src="${imgUrl}" alt="Bokomslag" class="bookImg" />
            <h2>${book.title}</h2>
            <p>${book.author}</p>
            <p>Antal sidor: ${book.pages}</p>
            <p>Utg.datum: ${book.releaseDate}</p>
            <p><strong>Ditt betyg:</strong> ${item.value}&#9734;</p>
        `;

        ratedBooksDiv.append(ratedBookCard);
    });
};
const ratedBooksDropdown = document.querySelector("#sortRatedBooks")

ratedBooksDropdown.addEventListener("change", async () => {
    const ratedBooksvalue = ratedBooksDropdown.value;
    let books = await getRatedBooks();

    if (ratedBooksvalue === "author") {
        books.sort((a, b) => a.book.author.localeCompare(b.book.author));
    } else if (ratedBooksvalue === "title") {
        books.sort((a, b) => a.book.title.localeCompare(b.book.title));
    } else if (ratedBooksvalue === "rating") {
        books.sort((a, b) => b.book.rating - a.book.rating);
    }

    renderRatedBooks(books);
});

getDataSavedBooks().then(books => {
    renderPageSavedBooks(books);
});

getRatedBooks().then(ratings => {
    console.log("Betygsatta böcker:", ratings);
    renderRatedBooks(ratings);
});

getDisplayColor();
createLoginheader();



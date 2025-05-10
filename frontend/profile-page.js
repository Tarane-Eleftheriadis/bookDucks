const savedBooksDiv = document.querySelector("#savedBooksDivContainer");
const sortSavedBooksDropdown = document.querySelector("#sortSavedBooks");
const baseUrl = "http://localhost:1337";

const getDataSavedBooks = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
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
                const response = await axios.delete(`${baseUrl}/api/saveds/${item.id}`, {
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

getDisplayColor();
createLoginheader();



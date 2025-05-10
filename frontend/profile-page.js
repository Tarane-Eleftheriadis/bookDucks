const savedBooksDiv = document.querySelector("#savedBooksDivContainer");
const baseUrl = "http://localhost:1337";

const getDataSavedBooks = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const jwt = localStorage.getItem("jwt");
    
    const respons = await axios.get(`${baseUrl}/api/saveds?filters[user][id][$eq]=${user.id}&populate=*`,
        {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }
    );
    console.log("Sparade böcker:", respons.data);
    return respons.data.data;
};

const renderPageSavedBooks = async () => {
    const books = await getDataSavedBooks();

    books.forEach(item => {
        const book = item.book;

        const savedBookCard = document.createElement("div");
        savedBookCard.classList.add("bookCard", "savedBookCard");

        savedBookCard.innerHTML = `
            <h2>${book.title}</h2>
            <p>${book.author}</p>
            <p>Antal sidor: ${book.pages}</p>
            <p>Utg.datum: ${book.releaseDate}</p>
            <p>Betyg: ${book.rating}</p>
            <button class="remove-btn" data-id="${item.id}">
                <img src="/delete_red.png" />
            </button>
        `;

        savedBooksDiv.append(savedBookCard);
    });
};

renderPageSavedBooks();
getDisplayColor();
createLoginheader();

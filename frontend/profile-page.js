const savedBooksDiv = document.querySelector("#savedBooksDivContainer");
const baseUrl = "http://localhost:1337";

const getDataSavedBooks = async () => {
    const respons = await axios.get(`${baseUrl}/api/saveds?populate=*`);
    const data = respons.data;
    console.log(data);
    return data;
};

const renderPageSavedBooks = async () => {
    let books = await getDataSavedBooks();

    books.data.forEach(item => {
        const savedBookCard = document.createElement("div");
        savedBookCard.classList.add("bookCard", "savedBookCard");

        const book = item.book;
        // const imgUrl = baseUrl + book.image.url;

        savedBookCard.innerHTML = `
            
            <h2>${book.title}</h2>
            <p>${book.author}</p>
            <p>Antal sidor: ${book.pages}</p>
            <p>Utg.datum: ${book.releaseDate}</p>
            <p>Betyg: ${book.rating}</p>
            <button class="remove-btn" id="removeBtn">
            <img src="/delete_red.png" />
            </button>
        `;

        savedBooksDiv.append(savedBookCard);
    });  
};


renderPageSavedBooks();
getDisplayColor();
createLoginheader();
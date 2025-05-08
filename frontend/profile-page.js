const savedBooksDiv = document.querySelector("#savedBooksDivContainer");

const getDataSavedBooks = async () => {
    const respons = await axios.get(`${baseUrl}/api/books?populate=*`);
    const data = respons.data;
    console.log(data);
    return data;
};

const renderPageSavedBooks = async () => {
    let books = await getDataSavedBooks();

    books.data.forEach(book => {
        const savedBookCard = document.createElement("div");
        savedBookCard.classList.add("bookCard")
        savedBookCard.classList.add("savedBookCard")
        const imgUrl = baseUrl + book.image.url;

        savedBookCard.innerHTML = `
            <img src="${imgUrl}" alt="Bokomslag" class="bookImg" />
            <h2>${book.title}</h2>
            <p> ${book.author}</p>
            <p>Antal sidor: ${book.pages}</p>
            <p>Utg.datum: ${book.releaseDate}</P>
            <p>Betyg: ${book.rating}</p>
            <button class="to-read-btn" data-id="${book.id}">
                <img src="/favorite2.png" />
            </button>
        `;

        savedBooksDiv.append(savedBookCard);
    });  
}

renderPageSavedBooks();
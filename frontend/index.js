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
        bookCard.innerHTML = `
            <h2>${book.title}</h2>
            <p><strong>Författare:</strong> ${book.author}</p>
            <p>Antal sidor: ${book.pages}</p>
            <p>Utgivningsdatum: ${book.releaseDate}</P>
            <p>Betyg: ${book.rating}</p>
            

        `;

        bookDiv.append(bookCard);
    });  
};

renderPage();

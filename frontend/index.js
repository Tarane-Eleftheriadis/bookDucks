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
      const response = await axios.get(`${baseUrl}/api/display-colors`);
      const data = response.data;
      console.log(data);
    //   const theme = data.data[0].attributes.theme;
  
    //   document.body.setAttribute("data-theme", theme);
 
  };
  
  getDisplayColor();

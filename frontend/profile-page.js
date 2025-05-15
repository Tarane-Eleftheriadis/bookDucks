import { baseUrl, getLoggedInUser, createLoginheader, getDisplayColor } from "./utils.js";

const savedBooksDiv = document.querySelector("#savedBooksDivContainer");
const sortSavedBooksDropdown = document.querySelector("#sortSavedBooks");

const getAverageRating = async (ratings) => {
  if (!ratings || ratings.length === 0) return null;
  let totalSum = 0;
  for (let i = 0; i < ratings.length; i++) {
    totalSum += ratings[i].value;
  }
  return totalSum / ratings.length;
};

const getAverageRatingForBook = async (bookId) => {
  const jwt = localStorage.getItem("jwt");
  try {
    const response = await axios.get(`${baseUrl}/api/ratings?filters[book][id][$eq]=${bookId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const ratings = response.data.data;
    return await getAverageRating(ratings);
  } catch (error) {
    console.error("Kunde inte hämta betyg för bok:", bookId, error);
    return null;
  }
};

const getDataSavedBooks = async () => {
  const user = await getLoggedInUser();
  const jwt = localStorage.getItem("jwt");

  const response = await axios.get(
    `${baseUrl}/api/saveds?filters[user][id][$eq]=${user.id}&populate[book][populate]=image`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return response.data.data;
};

const renderPageSavedBooks = async (books) => {
  savedBooksDiv.innerHTML = "";

  for (const item of books) {
    const book = item.book;
    const bookId = book.id;
    const imgUrl = baseUrl + book.image.url;

    const average = await getAverageRatingForBook(bookId);

    const savedBookCard = document.createElement("div");
    savedBookCard.classList.add("bookCard", "savedBookCard");

    savedBookCard.innerHTML = `
      <img src="${imgUrl}" alt="Bokomslag" class="bookImg" />
      <h2>${book.title}</h2>
      <p>${book.author}</p>
      <p>Antal sidor: ${book.pages}</p>
      <p>Utg.datum: ${book.releaseDate}</p>
      <p>Betyg: ${average !== null ? average.toFixed(1) : "Ej betygsatt"}</p>
      <button class="remove-btn" data-id="${item.id}">
        <img src="/delete_red.png" />
      </button>
    `;

    const deleteBtn = savedBookCard.querySelector(".remove-btn");
    deleteBtn.addEventListener("click", async () => {
      try {
        const jwt = localStorage.getItem("jwt");
        await axios.delete(`${baseUrl}/api/saveds/${item.id}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        savedBookCard.remove();
      } catch (error) {
        console.error("Kunde inte radera bok från API:", error.response?.data || error.message);
        alert("Det gick inte att radera boken. Kontrollera om du är inloggad och har rätt behörigheter.");
      }
    });

    savedBooksDiv.append(savedBookCard);
  }
};

sortSavedBooksDropdown.addEventListener("change", async () => {
  const selectValue = sortSavedBooksDropdown.value;
  let books = await getDataSavedBooks();

  if (selectValue === "author") {
    books.sort((a, b) => a.book.author.localeCompare(b.book.author));
  } else if (selectValue === "title") {
    books.sort((a, b) => a.book.title.localeCompare(b.book.title));
  }

  await renderPageSavedBooks(books);
});

const ratedBooksDiv = document.querySelector("#ratedBooksDivContainer");
const ratedBooksDropdown = document.querySelector("#sortRatedBooks");

const getRatedBooks = async () => {
  const jwt = localStorage.getItem("jwt");
  const user = await getLoggedInUser();

  const response = await axios.get(`${baseUrl}/api/ratings?filters[user][id][$eq]=${user.id}&populate[book][populate]=image`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return response.data.data;
};

const renderRatedBooks = (ratings) => {
  ratedBooksDiv.innerHTML = "";

  ratings.forEach((item) => {
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
      <p><strong>Ditt betyg:</strong> ${item.value}<span style='font-size:20px;'>&#9734;</span></p>
    `;

    ratedBooksDiv.append(ratedBookCard);
  });
};

ratedBooksDropdown.addEventListener("change", async () => {
  const ratedBooksvalue = ratedBooksDropdown.value;
  let books = await getRatedBooks();

  if (ratedBooksvalue === "author") {
    books.sort((a, b) => a.book.author.localeCompare(b.book.author));
  } else if (ratedBooksvalue === "title") {
    books.sort((a, b) => a.book.title.localeCompare(b.book.title));
  } else if (ratedBooksvalue === "rating") {
    books.sort((a, b) => b.value - a.value);
  }

  renderRatedBooks(books);
});

(async () => {
  const books = await getDataSavedBooks();
  await renderPageSavedBooks(books);

  const ratings = await getRatedBooks();
  renderRatedBooks(ratings);
})();

getDisplayColor();
createLoginheader();



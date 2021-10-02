window.onload = initLibrary();

function initLibrary () {
  let myLibrary = [];
  let myBook = new Book("Harry Lotter", "RK Lawling", "2");
  let myBook2 = new Book("Yay", "Me", 4);
  myLibrary = [myBook, myBook2];

  displayBooks();

  function Book(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read;
  }

  function displayBooks() {
    const container = document.querySelector("#card-container");
    myLibrary.forEach((book) => {
      const bookCard = createBookCard(book);
      container.appendChild(bookCard);
    })
  }

  function createBookCard(book) {
    const bookCard = document.createElement("div");
    bookCard.setAttribute("class", "book-card");
    for (const prop in book) {
      const bookProp = document.createElement("p");
      if(prop === "pages") {
        bookProp.textContent = `${book[prop]} pages`;
      }
      else {
        bookProp.textContent = book[prop];
      }
      bookCard.appendChild(bookProp);
    }
    return bookCard;
  }
}
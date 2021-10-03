window.onload = initLibrary();

function initLibrary () {
  let myLibrary = new Map();
  displayBooks();
  let addBtn = document.querySelector("#add-btn");
  let closeBtn = document.querySelector("#close-btn");
  let submitBtn = document.querySelector("#submit-btn");

  addBtn.addEventListener("click", handleDisplayForm);
  closeBtn.addEventListener("click", closeModal);
  submitBtn.addEventListener("click", handleSubmit);
  window.addEventListener("click", modalFormHandler);

  function Book(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
  }

  function displayBooks() {
    const container = document.querySelector("#card-container");

    //remove current display to update display
    removeChildNodes(container);
    myLibrary.forEach((book) => {
      const bookCard = createBookCard(book);
      container.appendChild(bookCard);
    })
  }

  function removeChildNodes(parent) {
    while(parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  function createBookCard(book) {
    const bookCard = document.createElement("div");
    bookCard.setAttribute("class", "book-card");

    //data-index set to index of book in myLibrary
    bookCard.setAttribute("data-key", book.hash);
    for (const prop in book) {
      const bookProp = document.createElement("p");
      if(prop === "title") {
        bookProp.textContent = `"${book[prop]}"`
      }
      else if(prop === "pages") {
        bookProp.textContent = `${book[prop]} pages`;
      }
      else if(prop !== "hash") {
        bookProp.textContent = book[prop];
      }
      bookCard.appendChild(bookProp);
    }
    bookCard.appendChild(createDeleteButton());
    return bookCard;
  }

  function createDeleteButton() {
    const delButton = document.createElement("button");
    delButton.classList = "del-btn";
    delButton.textContent = "Delete";
    delButton.addEventListener("click", handleDelete);
    return delButton;
  }

  function handleDisplayForm() {
    const modal = document.querySelector(".popup-form");
    modal.style.display = "block";
  }

  function closeModal() {
    const modal = document.querySelector(".popup-form");
    const form = document.querySelector("form");
    modal.style.display = "none";
    form.reset();
  }

  function modalFormHandler(event) {
    const form = document.querySelector("form");
    let modal = document.querySelector(".modal");
    if(event.target == modal) {
      modal.style.display = "none";
      form.reset();
    }
  }

  function handleDelete(event) {
    console.log("test");
    const key =  event.target.parentNode.getAttribute("data-key");
    myLibrary.delete(key);
    displayBooks();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = document.querySelector("form");
    
    //only process form if valid
    if(form.reportValidity()) {
      const formElems = form.elements;
      const propsArr = [];
      for(let i = 0; i < formElems.length; i++) {
        if(formElems[i].nodeName === "INPUT") {
          propsArr.push(formElems[i].value);
        }
      }
      const newBook = new Book(...propsArr);
      const hash = createHash(newBook);
      if(myLibrary.has(hash)) {
        alert("This book has already been added to the library! " +
              "Please only enter new books.");
      }
      else {
        newBook.hash = hash;
        myLibrary.set(hash, newBook);
        closeModal();
        displayBooks();
      }
    }
  }

  function createHash(book) {
    const hashVal = objectHash.sha1(book);
    return hashVal;
  }
}
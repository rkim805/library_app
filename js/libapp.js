window.onload = initLibrary();

function initLibrary () {
  let myLibrary = [];
  displayBooks();
  let addBtn = document.querySelector("#add-btn");
  let closeBtn = document.querySelector("#close-btn");
  let submitBtn = document.querySelector("#submit-btn");

  addBtn.addEventListener("click", handleAddBook);
  closeBtn.addEventListener("click", closeModal);
  submitBtn.addEventListener("click", handleSubmit);
  window.addEventListener("click", modalFormHandler);

  function Book(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read;
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
    for (const prop in book) {
      const bookProp = document.createElement("p");
      if(prop === "title") {
        console.log("test");
        bookProp.textContent = `"${book[prop]}"`
      }
      else if(prop === "pages") {
        bookProp.textContent = `${book[prop]} pages`;
      }
      else {
        bookProp.textContent = book[prop];
      }
      bookCard.appendChild(bookProp);
    }
    return bookCard;
  }

  function handleAddBook() {
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

    function handleSubmit(event) {
      event.preventDefault();
      const form = document.querySelector("form");
      
      //only process form if valid
      if(form.reportValidity()) {
        const formElems = form.elements;
        let propsArr = [];
        for(let i = 0; i < formElems.length; i++) {
          if(formElems[i].nodeName === "INPUT") {
            propsArr.push(formElems[i].value);
          }
        }
        let newBook = new Book(...propsArr);
        myLibrary.push(newBook);
        closeModal();
        displayBooks();
      }
    }
}
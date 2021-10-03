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

  function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.hash = "";
  }

  Book.prototype.toggleRead = function() {
    this.read = !(this.read);
  }

  //ensure property is not displayed when properties are looped through
  Object.defineProperty(Book.prototype, "toggleRead", {
    enumerable: false
  })

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
      else if(prop !== "hash" && prop !== "read") {
        bookProp.textContent = book[prop];
      }
      bookCard.appendChild(bookProp);
    }
    bookCard.appendChild(createToggleReadBtn(book.read));
    bookCard.appendChild(document.createElement("br"));
    bookCard.appendChild(createDeleteBtn());
    return bookCard;
  }

  function createDeleteBtn() {
    const delBtn = document.createElement("Button");
    delBtn.className = "del-btn";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", handleDelete);
    return delBtn;
  }

  function handleDelete(event) {
    const key =  event.target.parentNode.getAttribute("data-key");
    myLibrary.delete(key);
    displayBooks();
  }

  function createToggleReadBtn(readStatus) {
    console.log(readStatus);
    const toggleBtn = document.createElement("Button");
    if(readStatus) {
      toggleBtn.textContent = "Read"
      toggleBtn.className = "read-on";
    }
    else {
      toggleBtn.textContent = "Unread";
      toggleBtn.className = "read-off";
    }
    toggleBtn.addEventListener("click", handleToggle);
    return toggleBtn;
  }
  

  function handleToggle() {
    if(this.textContent === "Unread") {
      this.textContent = "Read"
      this.className = "read-on";
    }
    else {
      this.textContent = "Unread";
      this.className = "read-off";
    }

    //get key from book card, toggle book object related to book card
    const key = this.parentNode.getAttribute("data-key");
    const book = myLibrary.get(key);
    book.toggleRead();
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

  function handleSubmit(event) {
    event.preventDefault();
    const form = document.querySelector("form");
    
    //only process form if valid
    if(form.reportValidity()) {
      const formElems = form.elements;
      const propsArr = [];
      for(let i = 0; i < formElems.length; i++) {
        if(formElems[i].nodeName === "INPUT") {
          if(formElems[i].type === "checkbox") {
            propsArr.push(formElems[i].checked);
          }
          else {
            propsArr.push(formElems[i].value);
          }
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
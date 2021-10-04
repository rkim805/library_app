import _ from "object-hash"
'use strict';

const libModule = (function() {
  
  //let hash = require('object-hash');
  let myLibrary;
  const Book = function(title, author, pages, read, hash="") {
    const book = Object.create(Book.prototype);
    book.title = title;
    book.author = author;
    book.pages = pages;
    book.read = read;
    book.hash = hash;
    return book;
  }
  Book.prototype.toggleRead = function() {
    this.read = !(this.read);
  };

  const displayBooks = function() {
    const container = document.querySelector("#card-container");

    //remove current display to update display
    removeChildNodes(container);
    myLibrary.forEach((book) => {
      const bookCard = createBookCard(book);
      container.appendChild(bookCard);
    })
  }

  const removeChildNodes = function(parent) {
    while(parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  const createBookCard = function(book) {
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

  const createDeleteBtn = function() {
    const delBtn = document.createElement("Button");
    delBtn.className = "del-btn";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", handleDelete);
    return delBtn;
  }

  const handleDelete = function(event) {
    const key =  event.target.parentNode.getAttribute("data-key");
    myLibrary.delete(key);
    displayBooks();
    updateLocalStorage();
  }

  const createToggleReadBtn = function(readStatus) {
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
  

  const handleToggle = function() {
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
    updateLocalStorage();
  }

  const handleDisplayForm = function() {
    const modal = document.querySelector(".popup-form");
    modal.style.display = "block";
  }

  const closeModal = function() {
    const modal = document.querySelector(".popup-form");
    const form = document.querySelector("form");
    modal.style.display = "none";
    form.reset();
  }

  const modalFormHandler = function(event) {
    const form = document.querySelector("form");
    let modal = document.querySelector(".modal");
    if(event.target == modal) {
      modal.style.display = "none";
      form.reset();
    }
  }

  const handleSubmit = function(event) {
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
      const newBook = Book(...propsArr);
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
      updateLocalStorage();
    }
  }

  const createHash = function(book) {
    const hashVal = _.sha1(book);
    return hashVal;
  }

  const localStorageUsable = function() {
    let test = "test";
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch(e) {
      return false;
    }
  }

  const updateLocalStorage = function() {
    if(localStorageUsable()) {
      let libJSON = JSON.stringify([...myLibrary]);
      localStorage.setItem("myLibrary", libJSON);
    }
  }

  const recreateMap = function() {
    let libJSON = localStorage.getItem("myLibrary");
    if(libJSON == undefined) {
      return libJSON;
    }
    let libObj = recreateBooks(JSON.parse(libJSON));
    let retMap = new Map(libObj);
    return retMap;
  }

  /**
   * recreateBooks()
   * 
   * This function is designed to take objects from the parsed JSON
   * and turn them from generic objects to Book objects. This is to
   * re-enable any prototype functions defined on these Book objects.
   * 
   * @param {Object} libObj -- Object obtained from parsing library from
   * localStorage. libObj[i][0] contains key/hash, libObj[i][1] contains
   * object to be converted to a book.
   * 
   * @returns libObj -- Object with Book objects in place of generic objects.
   */
  const recreateBooks = function(libObj) {
    for(let i = 0; i < libObj.length; i++) {
      let objToConvert = libObj[i][1]
      libObj[i][1] = Book(objToConvert.title, objToConvert.author, 
        objToConvert.pages, objToConvert.read, objToConvert.hash);
    }
    return libObj;
  }

  //ensure property is not displayed when properties are looped through
  Object.defineProperty(Book.prototype, "toggleRead", {
    enumerable: false
  })

  return {
    initLibrary: function () {
      myLibrary = recreateMap();
      if(myLibrary == undefined) {
        myLibrary = new Map();
      }

      displayBooks();
      let addBtn = document.querySelector("#add-btn");
      let closeBtn = document.querySelector("#close-btn");
      let submitBtn = document.querySelector("#submit-btn");

      addBtn.addEventListener("click", handleDisplayForm);
      closeBtn.addEventListener("click", closeModal);
      submitBtn.addEventListener("click", handleSubmit);
      window.addEventListener("click", modalFormHandler);
    }
  };
})();

window.onload = libModule.initLibrary();
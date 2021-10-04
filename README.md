# library_app

## Summary
This project is a simple client-sided CRUD application, using Local Storage
to persist state across sessions.

## How I worked on this project:
I first began by creating user stories:
- My app should add books that I want to track to the application.
- The app should track the title, author, number of pages, and whether or not I've read the book.
- I want the app to display books that I've tracked, with cards for each  book.
- I should be able to delete books from the app.
- I should be able to update whether or not a book has been read.
- I want the app to display all previous data in a new session.

I then worked iteratively to fulfill each user story; first creating a skeleton
application that would simply display each book, then creating the ability for
the user to input data, then updating the display with tracked data, etc.

## How to navigate this project:
The handling of the CRUD application is located in `js/libapp.js`.

node_modules contains an imported library to create unique hash identifiers
for the book Objects.

## Why I built this project this way:
This application was a simple test to create a usable client-sided CRUD application. The project was refactored to use module and factory function design patterns in order to comply with the functional, prototypal nature of Javscript as a programming language. 

I had discovered these design patterns after largely finishing many of the features on this project, so major reafactoring had to be done afterwards to follow these design patterns.

A Map was used to relate each book-card DOM reference to each actual tracked
book for constant time lookup and to enforce non-duplicate entries entered by the user. In order to support the use of a Map, I used the [object-hash library](https://www.npmjs.com/package/object-hash).


## If I had more time I would change the following:
I would like to convert the application to be able to persist state by using user authentication.


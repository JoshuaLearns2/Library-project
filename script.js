// TESTING 
const myBtn = document.querySelector('#myBtn');
myBtn.addEventListener('click', addBookToLibrary);

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


let myLibrary = [];

function Book(Title, Author, Pages, Read) {
  this.Title = Title;
  this.Author = Author;
  this.Pages = Pages;
  this.Read = Read;
}

function addBookToLibrary(Title, Author, Pages, Read) {
  let newBook = new Book(Title, Author, Pages, Read);
  myLibrary.push(newBook);
}

function displayBooksOnPage() {
  const books = document.querySelector('.books');

  myLibrary.forEach(myLibrary => {
    const card = document.createElement('div');
    card.classList.add('card');
    books.appendChild(card);
    for (let key in myLibrary) {
      console.log(`${key}: ${myLibrary[key]}`);
      const para = document.createElement('p');
      para.textContent = (`${key}: ${myLibrary[key]}`);
      card.appendChild(para);
    }
  })
}

addBookToLibrary("Test", "Test", "225")
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225")
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225")
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225")

displayBooksOnPage();
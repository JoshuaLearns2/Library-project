let myLibrary = [];

function Book(Title, Author, Pages, Read) {
  this.Title = Title;
  this.Author = Author;
  this.Pages = Pages;
  this.Read = Read;
  // this.info = function() {
      // return title + ' ' + 'by' + ' ' + author + ',' + ' ' + pages + ' ' + 'pages' + ',' + ' ' + read
  // }
}

// const book1 = new Book('The Hobbit', 'J.R.R. Tolkien', '295', 'no');
// console.log(book1.info());

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

addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225", "No")
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225", "No")
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225", "No")
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225", "No")

displayBooksOnPage();
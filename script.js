const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
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

addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225")
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225")
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225")

displayBooksOnPage();
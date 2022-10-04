// Open and close modal features

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

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(title, author, pages, isRead) {
  let newBook = new Book(title, author, pages, isRead);
  myLibrary.push(newBook);
}

function displayBooksOnPage() {
  const books = document.querySelector('.books');
  
  myLibrary.forEach(myLibrary => {
    const card = document.createElement('div');
    card.classList.add('card');
    books.appendChild(card);
    for (let key in myLibrary) {
      console.log(`${myLibrary[key]}`);
      const para = document.createElement('p');
      para.textContent = (`${myLibrary[key]}`);
      card.appendChild(para);
    }
  })
}

const getBookFromInput = () => {
  const title = document.getElementById('title').value
  const author = document.getElementById('author').value
  const pages = document.getElementById('pages').value
  const isRead = document.getElementById('isRead').checked
  return new Book(title, author, pages, isRead)
}

const addBook = (e) => {
  addBookToLibrary(Book())
  displayBooksOnPage()
}

addBookForm.onsubmit = addBook

addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225")
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225")
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", "225")

displayBooksOnPage();
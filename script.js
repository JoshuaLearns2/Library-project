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

// Creates an array
let myLibrary = [];

// Book constructor
function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages + 'pgs';
  this.read = read;
}

// Adds a book to the myLibrary array
function addBookToLibrary(title, author, pages, read) {
  let newBook = new Book(title, author, pages, read);
  myLibrary.splice(0, myLibrary.length);
  myLibrary.push(newBook);
}

// Takes values from form and generates a new book
let submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', function (e) {
  e.preventDefault();
  addBookToLibrary(title.value, author.value, pages.value)
  displayBooks();
  document.getElementById('form').reset();
  closeModal(modal)
});

// Displays books to webpage using DOM manipulation
function displayBooks() {
  const bookGrid = document.querySelector('.book-grid');
  const card = document.createElement('div');
  
  myLibrary.forEach(myLibrary => {
    const bookGrid = document.querySelector('.book-grid');
    const card = document.createElement('div');
    const removeBtn = document.createElement('button')

    card.classList.add('card');
    bookGrid.appendChild(card);
    for (let key in myLibrary) {
      const para = document.createElement('p');
      para.textContent = (`${myLibrary[key]}`);  
      card.appendChild(para);

    }
  })
}
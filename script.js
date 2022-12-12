// Adds functionality to the "Add a book" button by displaying the modal

const addBookBtn = document.querySelector('.add-book-btn')
const modalBackground = document.querySelector('.modal-background')

addBookBtn.onclick = function() {
  modalBackground.style.display = "flex";
}

// Adds functionality to the modal's close button

const closeModal = document.querySelector('.close-modal')

closeModal.onclick = function() {
  modalBackground.style.display = "none";
}

// Adds functionality to the modal's submit button by passing the values into the DOM 

const submitBookBtn = document.querySelector('.submit-book-btn')

submitBookBtn.onclick = function(e) {
  e.preventDefault();

  const cardContainer = document.querySelector('.card-container');
  const createBookCard = document.createElement('div');
  createBookCard.className = "card-div";
  cardContainer.appendChild(createBookCard);
  modalBackground.style.display = "none";

  const bookTitle = document.createElement('h2');
  bookTitle.textContent = document.querySelector('.title').value;
  createBookCard.appendChild(bookTitle);
  console.log(document.querySelector('.title').value)
}
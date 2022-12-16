// Adds functionality to the "Add a book" button by displaying the modal

const addBookBtn = document.querySelector('.add-book-btn')
const modalBackground = document.querySelector('.modal-background')

addBookBtn.onclick = function() {
  modalBackground.style.display = "flex";
}

// Adds functionality to the modal's close button

const closeModal = document.querySelector('.close-modal-btn')

closeModal.onclick = function() {
  document.querySelector('.title').value = '';
  document.querySelector('.author').value = '';
  modalBackground.style.display = "none";
}

// Adds functionality to the modal's submit button by passing the values into the DOM 

const submitBookBtn = document.querySelector('.submit-book-btn')

submitBookBtn.onclick = function(e) {
  e.preventDefault();

  const cardContainer = document.querySelector('.card-container');
  const bookCard = document.createElement('div');
  bookCard.className = 'card-div';
  cardContainer.appendChild(bookCard);

  const cardCoverContainer = document.createElement('div');
  cardCoverContainer.className = 'card-cover-container';
  bookCard.appendChild(cardCoverContainer);
  bookCover = document.createElement('img');
  cardCoverContainer.appendChild(bookCover);

  const cardInfoContainer = document.createElement('div');
  cardInfoContainer.className = 'card-info-container';
  bookCard.appendChild(cardInfoContainer);
  
  const bookTitle = document.createElement('h2');
  bookTitle.className = 'book-heading';
  bookTitle.textContent = document.querySelector('.title').value;
  cardInfoContainer.appendChild(bookTitle);

  const bookAuthor = document.createElement('p');
  bookAuthor.className = 'book-author';
  bookAuthor.textContent = `By ${document.querySelector('.author').value}`;
  cardInfoContainer.appendChild(bookAuthor);

  const cardButtonContainer = document.createElement('div');
  cardButtonContainer.className = 'card-btn-container';
  bookCard.appendChild(cardButtonContainer);

  const readStatusButton = document.createElement('button');
  readStatusButton.id = 'read-status';
  readStatusButton.className = 'unread';
  readStatusButton.textContent = 'Unread';
  cardButtonContainer.appendChild(readStatusButton);

  const editButton = document.createElement('button');
  editButton.className = 'edit-btn';
  editButton.textContent = 'Edit';
  cardButtonContainer.appendChild(editButton);

  const removeButton = document.createElement('button');
  removeButton.className = 'remove-btn';
  removeButton.textContent = 'Remove';
  cardButtonContainer.appendChild(removeButton);

  document.querySelector('.title').value = '';
  document.querySelector('.author').value = '';
  
  modalBackground.style.display = "none";
}

// Book card read/unread toggle status

document.addEventListener('click', e => {
  if (e.target.matches('.unread')) {
    e.target.className = 'read', e.target.textContent = 'Read'
  } else if (e.target.matches('.read')) {
    return e.target.className = 'unread', e.target.textContent = 'Unread'
    console.log(e.target.className)
  } 
  })

// Book card edit button functionality which re-displays the modal with the form filled out with the card's values


// Book card remove button functionality

document.addEventListener('click', e => {
  if (e.target.matches('.remove-btn')) {
    document.querySelector('.card-div').remove()
  }
})
// removeButton.onclick = function() {
//   document.querySelector('.card-div').remove()
// }


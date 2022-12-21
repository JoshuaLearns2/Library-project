// Creates an empty array for book data to be stored in

let library = [];

// Object constructor for the book data

function Book(title, author) {
  this.title = title;
  this.author = author;
}

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

submitBookBtn.addEventListener('click', e => {
  e.preventDefault();

  const book = new Book(document.querySelector('.title').value, document.querySelector('.author').value);

  library.push(book);

  createBookCard(document.querySelector('.title').value, document.querySelector('.author').value);

  document.querySelector('.title').value = '';
  document.querySelector('.author').value = '';
  
  modalBackground.style.display = "none";
})

// DOM book card creation

function createBookCard(title, author) {
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
  bookTitle.textContent = title;
  cardInfoContainer.appendChild(bookTitle);

  const bookAuthor = document.createElement('p');
  bookAuthor.className = 'book-author';
  bookAuthor.textContent = `By ${author}`;
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
}

// Book card read/unread toggle status

document.addEventListener('click', e => {
  if (e.target.matches('.unread')) {
    e.target.className = 'read', e.target.textContent = 'Read'
  } else if (e.target.matches('.read')) {
    return e.target.className = 'unread', e.target.textContent = 'Unread'
  } 
  })

// Book card edit button functionality which re-displays the modal to edit card's values

document.addEventListener('click', e => {
  if (e.target.matches('.edit-btn')) {
    const cardDiv = e.target.parentElement.parentElement;
    const testTitle = e.target.parentElement.parentElement.querySelector('.book-heading').textContent;

    for (let i = 0; i < library.length; i++) {
      const bookCheck = library[i]

      if (bookCheck.title === testTitle) {
        modalBackground.style.display = "flex";
        document.querySelector('.title').value = bookCheck.title;
        document.querySelector('.author').value = bookCheck.author;
        library.splice(library[i], 1);
        (console.log(library[i]))

        submitBookBtn.addEventListener('click', e => {
          e.preventDefault();

          cardDiv.remove();

          let title = e.target.parentElement.parentElement.querySelector('.title').value
          let author = e.target.parentElement.parentElement.querySelector('.author').value
          const book = new Book(title, author);
          
          library.push(book);
          
          createBookCard(title, author);
        
          document.querySelector('.title').value = '';
          document.querySelector('.author').value = '';
          
          modalBackground.style.display = "none";
        })
        
        break;
      }
    }
  }
})

// Book card remove button functionality

document.addEventListener('click', e => {
  if (e.target.matches('.remove-btn')) {
    
    const title = e.target.parentElement.parentElement.querySelector('.book-heading').textContent;

    for (let i = 0; i < library.length; i++) {
      const bookCheck = library[i]

      if (bookCheck.title === title) {
        library.splice(i, 1);
        e.target.parentElement.parentElement.remove()
      }
    }

  }
})


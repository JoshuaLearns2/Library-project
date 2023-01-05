// Creates an empty array for book data to be stored in

library = [];

// Object constructor for the book data

function Book(title, author, imgsrc) {
  this.title = title;
  this.author = author;
  this.imgsrc = imgsrc;

  // create a method that searches for the imgsrc in the API and stores it as imgsrc in the object
}

function newBook(title, author) {
  const book = new Book(title, author);
  library.push(book);
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

  title = document.querySelector('.title').value
  author = document.querySelector('.author').value

  newBook(title, author);
  loopTest();

  document.querySelector('.title').value = '';
  document.querySelector('.author').value = '';
  modalBackground.style.display = "none";
})

// UI

function createBookCard() {
  const cardContainer = document.querySelector('.card-container');
  const bookCard = document.createElement('div');
  bookCard.className = 'card-div';
  cardContainer.appendChild(bookCard);

  const cardCoverContainer = document.createElement('div');
  cardCoverContainer.className = 'card-cover-container';
  bookCard.appendChild(cardCoverContainer);
  bookCover = document.createElement('img');
  bookCover.className = 'book-cover-img';
  bookCover.src = imgsrc;
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
    
    bookTitle = e.target.parentElement.parentElement.querySelector('.book-heading');
    bookAuthor = e.target.parentElement.parentElement.querySelector('.book-author');
    editModalBackground = document.querySelector('.edit-modal-background');
    editCloseBtn = document.querySelector('.close-edit-modal-btn');
    editSubmitBtn = document.querySelector('.edit-submit-book-btn');
    editForm = document.querySelector('.edit-modal-form');
    editTitle = document.querySelector('.edit-title');
    editAuthor = document.querySelector('.edit-author');

    editModalBackground.style.display = 'flex';

    for (i = 0; i < library.length; i++) {
      if (library[i].title == bookTitle.textContent) {
        editTitle.value = bookTitle.textContent;
        editAuthor.value = bookAuthor.textContent;
      }
    }

    editCloseBtn.addEventListener('click', () => {
      editModalBackground.style.display = 'none';
      editTitle.value = '';
      editAuthor.value = '';
    })

    editSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      for (i = 0; i < library.length; i++) {
        if (library[i].title == bookTitle.textContent) {
          library[i].title = editTitle.value;
          library[i].author = editAuthor.value;
          library[i].imgsrc = undefined;
        }
      }
      
      updateBooks();
      editModalBackground.style.display = 'none';
      editTitle.value = '';
      editAuthor.value = '';
    })
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

// Retreive book cover images utilizing Open Library API

// async function updateBooks(book) {
//   const getData = await fetch(`http://openlibrary.org/search.json?q=${book.title.replace(/ /g, '+')}`)
//   .then(res => res.json())
//   .then(data => book.imgsrc = `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`)
// }

async function updateBooks(book) {
  const res = await fetch(`http://openlibrary.org/search.json?q=${book.title.replace(/ /g, '+')}`)
  const data = await res.json()
  return library.forEach(book => book.imgsrc = `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`)
}

newBook('Harry Potter and the Chamber of Secrets', 'J.K. Rowling');
newBook('1984', 'George Orwell');
newBook('Eloquent Javascript', 'Marijn Haverbeke');

window.addEventListener('load', library.forEach(book => updateBooks(book)));
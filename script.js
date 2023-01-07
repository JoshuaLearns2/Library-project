// Creates an empty array for book data to be stored in

library = JSON.parse(localStorage.getItem('books')) || [];

// Factory function for book data

function Book(title, author, imgsrc) {
  this.title = title;
  this.author = author;
  this.imgsrc = imgsrc;
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
  title = document.querySelector('.title')
  author = document.querySelector('.author')

  title.style.border = 'none';
  author.style.border = 'none';
  title.value = '';
  author.value = '';
  modalBackground.style.display = "none";
}

// Add book modal submit button 

const submitBookBtn = document.querySelector('.submit-book-btn')

submitBookBtn.onclick = (e) => {
  e.preventDefault();
  title = document.querySelector('.title')
  author = document.querySelector('.author')

  if (title.value == 0 && author.value == 0) {
    title.style.border = '2px solid red';
    author.style.border = '2px solid red';
  } else if (title.value == 0) {
    title.style.border = '2px solid red';
  } else if (author.value == 0) {
    author.style.border = '2px solid red';
  } else if ((title.value != 0 && author.value != 0)) {
    if (library.length == 0) {
      newBook(title.value, author.value);
      updateBooks();
    } else if (library.length != 0) {
      for (i = 0; i < library.length; i++) {
        if (title.value === library[i].title) {
          console.log('test')
          prompt('This book is already in your library');
        } else {
          newBook(title.value, author.value);
          updateBooks();
        }
      }  
    }
    title.style.border = 'none';
    author.style.border = 'none';
    title.value = '';
    author.value = '';
    modalBackground.style.display = "none";
  }
}

// UI

function createBookCard(title, author, imgsrc) {
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
  
// Book card edit button functionality which displays edit modal
  
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
      if (bookTitle.textContent === library[i].title) {
        editTitle.value = library[i].title;
        editAuthor.value = library[i].author;

        editCloseBtn.addEventListener('click', () => {
          editModalBackground.style.display = 'none';
          editTitle.style.border = 'none';
          editAuthor.style.border = 'none';
        })

        editSubmitBtn.onclick = (e) => {
          e.preventDefault();
          for (const book of library) {
            if (editTitle.value === '' && editAuthor.value === '') {
              editTitle.style.border = '2px solid red';
              editAuthor.style.border = '2px solid red';
            } else if (editTitle.value === '') {
              editAuthor.style.border = 'none';
              editTitle.style.border = '2px solid red';
            } else if (editAuthor.value === '') {
              editTitle.style.border = 'none';
              editAuthor.style.border = '2px solid red';
            } else {
              book.title = editTitle.value;
              book.author = editAuthor.value;
              updateBooks();
              editTitle.style.border = 'none';
              editAuthor.style.border = 'none';
              editModalBackground.style.display = 'none';
            }
          }
        }
      }
    }
  }
})

// Book card remove button

document.addEventListener('click', e => {
  if (e.target.matches('.remove-btn')) {
    
    const title = e.target.parentElement.parentElement.querySelector('.book-heading').textContent;

    for (let i = 0; i < library.length; i++) {
      const bookCheck = library[i]

      if (bookCheck.title === title) {
        library.splice(i, 1);
        e.target.parentElement.parentElement.remove()
        localStorage.setItem('books', JSON.stringify(library))
      }
    }

  }
})

// Updates the library array to contain Open Library API imgsrc for book covers and displays books to the DOM

async function updateBooks() {
  document.querySelector('.card-container').innerHTML = '';
  for (const book of library) {
    const res = await fetch(`http://openlibrary.org/search.json?q=${book.title.replace(/ /g, '+')}`);
    const data = await res.json();
    book.imgsrc = await `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`;
    createBookCard(book.title, book.author, book.imgsrc);
    localStorage.setItem('books', JSON.stringify(library));
  }
}
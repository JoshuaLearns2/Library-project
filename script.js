// Creates an empty array for book data to be stored in

const library = [];

// Factory function for book data

function Book(title, author, imgsrc) {
  this.title = title;
  this.author = author;
  this.imgsrc = imgsrc;
}

function newBook(title, author, imgsrc) {
  const book = new Book(title, author, imgsrc);
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
  modalBackground.style.display = 'none';
}

// Add book modal submit button 

const submitBookBtn = document.querySelector('.submit-book-btn')

submitBookBtn.onclick = (e) => {
  e.preventDefault();
  title = document.querySelector('.title');
  author = document.querySelector('.author');

  if (title.value === '' && author.value === '') {
    title.style.border = '2px solid red';
    author.style.border = '2px solid red';
  } else if (title.value === '') {
    author.style.border = 'none';
    title.style.border = '2px solid red';
  } else if (author.value === '') {
    title.style.border = 'none';
    author.style.border = '2px solid red';
  } else if (library.some(book => book.title === title.value) === true) {
    alert('This book already exists in your library')
    title.style.border = 'none';
    author.style.border = 'none'
    title.value = '';
    author.value = '';
  } else {
    updateBooks(title.value, author.value);
    title.style.border = 'none';
    author.style.border = 'none'
    title.value = '';
    author.value = '';
    modalBackground.style.display = 'none';
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
  bookTitle.className = 'book-title';
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
    
    bookTitle = e.target.parentElement.parentElement.querySelector('.book-title');
    bookAuthor = e.target.parentElement.parentElement.querySelector('.book-author');
    bookCoverImg = e.target.parentElement.parentElement.querySelector('.book-cover-img');
    editModalBackground = document.querySelector('.edit-modal-background');
    editCloseBtn = document.querySelector('.close-edit-modal-btn');
    editSubmitBtn = document.querySelector('.edit-submit-book-btn');
    editForm = document.querySelector('.edit-modal-form');
    editTitle = document.querySelector('.edit-title');
    editAuthor = document.querySelector('.edit-author');
    
    editModalBackground.style.display = 'flex';

    editTitle.value = bookTitle.innerText;
    editAuthor.value = bookAuthor.innerText.replace(/By /g, '');

    editCloseBtn.addEventListener('click', () => {
      editModalBackground.style.display = 'none';
      editTitle.style.border = 'none';
      editAuthor.style.border = 'none';
    })

    editSubmitBtn.addEventListener('click', e => {
      e.preventDefault();
      
      for (let i = 0; i < library.length; i++) {
        if (library[i].title === bookTitle.innerText) {
          imgsrcFinder(editTitle.value);
          editModalBackground.style.display = 'none';
          editTitle.style.border = 'none';
          editAuthor.style.border = 'none';

          async function imgsrcFinder(title) {
            const res = await fetch(`http://openlibrary.org/search.json?q=${title.replace(/ /g, '+')}`);
            const data = await res.json();
            imgsrc = await `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`;
          
            library[i].title = editTitle.value;
            library[i].author = editAuthor.value;
            library[i].imgsrc = imgsrc;

            bookTitle.innerText = editTitle.value;
            bookAuthor.innerText = `By ${editAuthor.value}`;
            bookCoverImg.src = imgsrc;
          }
        }
      }
    })
  }
})

// Book card remove button

document.addEventListener('click', e => {
  if (e.target.matches('.remove-btn')) {
    
    const title = e.target.parentElement.parentElement.querySelector('.book-title').textContent;

    for (let i = 0; i < library.length; i++) {
      const bookCheck = library[i];

      if (bookCheck.title === title) {
        library.splice(i, 1);
        e.target.parentElement.parentElement.remove();
        localStorage.setItem('books', JSON.stringify(library));
      }
    }

  }
})

// Updates the library array to contain Open Library API imgsrc for book covers and displays books to the DOM

async function updateBooks(title, author) {
  const res = await fetch(`http://openlibrary.org/search.json?q=${title.replace(/ /g, '+')}`);
  const data = await res.json();
  imgsrc = await `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`;
  newBook(title, author, imgsrc);
  createBookCard(title, author, imgsrc);
  // localStorage.setItem('books', JSON.stringify(library));
}
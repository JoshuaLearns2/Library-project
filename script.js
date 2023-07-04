const library = JSON.parse(localStorage.getItem('books')) || []

function Book(title, author, imgsrc, readStatus) {
  this.title = title;
  this.author = author;
  this.imgsrc = imgsrc;
  this.readStatus = readStatus;
}

function newBook(title, author, imgsrc, readStatus) {
  const book = new Book(title, author, imgsrc, readStatus);
  library.push(book);
}

const addBookBtn = document.querySelector('.add-book-btn')
const modalBackground = document.querySelector('.modal-background')

addBookBtn.onclick = function() {
  modalBackground.style.display = "flex";
}

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

const submitBookBtn = document.querySelector('.submit-book-btn')

submitBookBtn.onclick = (e) => {
  e.preventDefault();
  title = document.querySelector('.title');
  author = document.querySelector('.author');
  readStatus = false;

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
    updateBooks(title.value, author.value, readStatus);
    localStorage.setItem('books', JSON.stringify(library));
    title.style.border = 'none';
    author.style.border = 'none'
    title.value = '';
    author.value = '';
    modalBackground.style.display = 'none';
  }

} 

function createBookCard(title, author, imgsrc, readStatus) {
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
  if (readStatus === false) {
    readStatusButton.className = 'unread';
    readStatusButton.textContent = 'Unread';
  } 
  if (readStatus === true) {
    readStatusButton.className = 'read';
    readStatusButton.textContent = 'Read';
  } 
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

document.addEventListener('click', e => {
  if (e.target.matches('.unread') || (e.target.matches('.read'))) {
    bookTitle = e.target.parentElement.parentElement.querySelector('.book-title').textContent;
    library.map(book => {
      if (book.title === bookTitle) {
        if (e.target.className === 'unread') {
          e.target.className = 'read';
          e.target.innerText = 'Read';
        } else if (e.target.className === 'read') {
          e.target.className = 'unread';
          e.target.innerText = 'Unread';
        }
        book.readStatus = !book.readStatus;
        localStorage.setItem('books', JSON.stringify(library));
      }
    })
  } 
})
  
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

      if (editTitle.value === '' && editAuthor.value === '') {
        editTitle.style.border = '2px solid red';
        editAuthor.style.border = '2px solid red';
      } else if (editTitle.value === '') {
        editAuthor.style.border = 'none';
        editTitle.style.border = '2px solid red';
      } else if (editAuthor.value === '') {
        editTitle.style.border = 'none';
        editAuthor.style.border = '2px solid red';
      } else if (library.some(book => book.title === editTitle.value) === true) {
        alert('This book already exists in your library');
        editTitle.style.border = 'none';
        editAuthor.style.border = 'none'
        editTitle.value = '';
        editAuthor.value = '';
      } else {
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
              localStorage.setItem('books', JSON.stringify(library));
            }
          }
        }
      }
    })
  }
})

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

async function updateBooks(title, author, readStatus) {
  console.log(readStatus);
  const res = await fetch(`http://openlibrary.org/search.json?q=${title.replace(/ /g, '+')}`);
  const data = await res.json();
  imgsrc = await `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`;
  newBook(title, author, imgsrc, readStatus);
  createBookCard(title, author, imgsrc, readStatus);
  localStorage.setItem('books', JSON.stringify(library));
}

window.addEventListener('load', () => {
  library.forEach(book => createBookCard(book.title, book.author, book.imgsrc, book.readStatus));
})
// Creates an empty array for book data to be stored in

let library = [];

// Object constructor for the book data

function Book(title, author, imgsrc) {
  this.title = title;
  this.author = author;
  this.imgsrc = imgsrc;
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

  bookSearch(title, author);

  document.querySelector('.title').value = '';
  document.querySelector('.author').value = '';
  modalBackground.style.display = "none";
})

// DOM book card creation

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

// Loops through the array and sets title and author for the DOM

function bookCardLoop() {
  for (let i = 0; i < library.length; i++) {
    bookSearch(library[i].title, library[i].author);
  }
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
  
const closeEditModal = document.querySelector('.close-edit-modal-btn');
const editModalBackground = document.querySelector('.edit-modal-background');
const editSubmitBookBtn = document.querySelector('.edit-submit-book-btn');

document.addEventListener('click', e => {
  if (e.target.matches('.edit-btn')) {
    const title = e.target.parentElement.parentElement.querySelector('.book-heading').textContent;
    const author = e.target.parentElement.parentElement.querySelector('.book-author').textContent;
    const divCard = e.target.parentElement.parentElement;
    
    editModalBackground.style.display = "flex";
    
    document.querySelector('.edit-title').value = title;
    document.querySelector('.edit-author').value = author.replace('By ', '');
    
    closeEditModal.onclick = function() {
      editModalBackground.style.display = "none";
    }

    editSubmitBookBtn.addEventListener('click', e => {
      e.preventDefault();

      for (let i = 0; i < library.length; i++) {
        if (library[i].title === title) {

          divCard.remove();

          library.splice(i, 1);

          const editbook = new Book(document.querySelector('.edit-title').value, document.querySelector('.edit-author').value);

          library.push(editbook);
          // localStorage.setItem('books', JSON.stringify(library));

          document.querySelector('.card-container').innerHTML = '';
          bookCardLoop();
          
          editModalBackground.style.display = "none";

          document.querySelector('.edit-title').value = '';
          document.querySelector('.edit-author').value = '';

          break;
        }
      }
      
      
    })
    
  }
})

// Book card remove button functionality

const removeCard = document.addEventListener('click', e => {
  if (e.target.matches('.remove-btn')) {
    
    const title = e.target.parentElement.parentElement.querySelector('.book-heading').textContent;
    // e.target.parentElement.parentElement.remove()

    for (let i = 0; i < library.length; i++) {
      const bookCheck = library[i]

      if (bookCheck.title === title) {
        library.splice(i, 1);
        // localStorage.setItem('books', JSON.stringify(library));
        e.target.parentElement.parentElement.remove()
      }
    }

  }
})

// Retreive book cover images utilizing Open Library API

function bookSearch(title, author) {
  searchTitle = title.replace(/ /g, '+');
  
  let imgFinder =
  fetch('http://openlibrary.org/search.json?q=' + searchTitle)
  .then(res => res.json())
  .then(data => {
    imgsrc = `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`
    return imgsrc;
  }); 
  
  return imgFinder.then(() => {
    const book = new Book(title, author, imgsrc)
    library.push(book)
    createBookCard(title, author, imgsrc)
  })

}

window.addEventListener("load", bookCardLoop);
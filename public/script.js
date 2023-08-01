const library = [];
const userList = JSON.parse(localStorage.getItem('userlist')) || [];
const userLoggedIn = JSON.parse(sessionStorage.getItem('userstatus')) || false;
const signUpBtn = document.querySelector('.signup-button');
const logInBtn = document.querySelector('.login-button');
const signUpForm = document.querySelector('.signup-modal-form');
const signUpFormBtn = document.querySelector('.signup-form-btn');
const logInFormBtn = document.querySelector('.login-form-btn');
const addBookBtn = document.querySelector('.add-book-btn');
const modalBackground = document.querySelector('.modal-background');
const signUpBackground = document.querySelector('.signup-modal-background');
const logInBackground = document.querySelector('.login-modal-background');
const closeModal = document.querySelector('.close-modal-btn');
const closeSignUpModal = document.querySelector('.close-signup-modal-btn');
const closeLogInModal = document.querySelector('.close-login-modal-btn');
const submitBookBtn = document.querySelector('.submit-book-btn');
const authorizedCardContainer = document.querySelector('.authorized-card-container');
const cardContainer = document.querySelector('.card-container');
const url = 'http://localhost:8080/api/library';

async function getData() {
  const response = await fetch(url);
  const data = await response.json();
  data.forEach(book => library.push(book));
  console.log(library)  
}

getData()

function Book(title, author, imgsrc, readStatus) {
  this.title = title;
  this.author = author;
  this.imgsrc = imgsrc;
  this.readStatus = readStatus;
}

function User(username, email, password) {
  this.username = username,
  this.email = email,
  this.password = password
}

const newBook = async (title, author, imgsrc, readStatus, favoriteStatus) => {
  const data = { title, author, imgsrc, readStatus, favoriteStatus }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  }

  fetch('http://localhost:8080/api/library', options)
}

signUpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.querySelector('#signup-username').value;
  const email = document.querySelector('#signup-email').value;
  const password = document.querySelector('#signup-password').value;
  const data = { username, email, password };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  }

  fetch('http://localhost:8080/api/users', options)
})

const loggedIn = () => {
  sessionStorage.setItem('userstatus', JSON.stringify(true));

  signUpBtn.innerText = 'Profile';
  logInBtn.innerText = 'Log out';

  logInBtn.addEventListener('click', () => {
    loggedOut();
  })

  authorizedCardContainer.style.display = 'grid';
  cardContainer.style.display = 'none';
}

const loggedOut = () => {
  logInBackground.style.display = 'none';
  signUpBtn.innerText = 'Sign up';
  logInBtn.innerText = 'Log in';

  logInBtn.addEventListener('click', () => {
    logInBackground.style.display = 'flex';
  })

  authorizedCardContainer.style.display = 'none';
  cardContainer.style.display = 'grid';
}

signUpBtn.addEventListener('click', () => {
  signUpBackground.style.display = "flex";
})

logInBtn.addEventListener('click', (e) => {
  logInBackground.style.display = 'flex';
})

logInFormBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let loginUsername = document.querySelector('#login-username');
  let loginPassword = document.querySelector('#login-password');

  if (loginUsername.value && loginPassword.value) {
    for (let i = 0; i < userList.length; i++) {
      if (loginUsername.value === userList[i].username) {
        if (loginPassword.value === userList[i].password) {
          loginUsername.value = '';
          loginPassword.value = '';
          logInBackground.style.display = "none";
          sessionStorage.setItem('userstatus', JSON.stringify(false));
          loggedIn();
        } else {
          console.log('Incorrect username or password')
        }
      }
    }
  } else {
    console.log('Must include username and password')
  }
})

closeSignUpModal.onclick = function () {
  signUpBackground.style.display = "none";
}

closeLogInModal.onclick = function () {
  logInBackground.style.display = "none";
  loginUsername.value = '';
  loginPassword.value = '';
}

addBookBtn.onclick = function () {
  modalBackground.style.display = "flex";
}

closeModal.onclick = function () {
  title = document.querySelector('.title')
  author = document.querySelector('.author')

  title.style.border = 'none';
  author.style.border = 'none';
  title.value = '';
  author.value = '';
  modalBackground.style.display = 'none';
}

submitBookBtn.addEventListener('click', (e) => {
  e.preventDefault();
  title = document.querySelector('.title');
  author = document.querySelector('.author');
  readStatus = false;
  favoriteStatus = false;

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
    updateBooks(title.value, author.value, readStatus, favoriteStatus);
    title.style.border = 'none';
    author.style.border = 'none'
    title.value = '';
    author.value = '';
    modalBackground.style.display = 'none';
  }
})

function createBookCard(title, author, imgsrc, readStatus) {
  const cardContainer = document.querySelector('.card-container');
  const authCardContainer = document.querySelector('.authorized-card-container');
  const bookCard = document.createElement('div');
  bookCard.className = 'card-div';

  if (userLoggedIn) {
    authCardContainer.appendChild(bookCard);
  } else {
    cardContainer.appendChild(bookCard);
  }

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

              
              // localStorage.setItem('books', JSON.stringify(library));
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
    library.filter(book => {
      if (book.title === title) {
        const options = {
          method: "DELETE",
        }
      
        fetch(`http://localhost:8080/api/library/${book._id}`, options)
        .then(res => res.json())
        .then(data => console.log(data))
        .then(window.location.reload())
      }
    })

    // const options = {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(title),
    // }
  
    // fetch('http://localhost:8080/api/library', options)
    // .then(res => res.json())
    // .then(data => console.log(data))
    // .then(req => req.json())
    // .then(data => console.log(data))
    // for (let i = 0; i < library.length; i++) {
    //   const bookCheck = library[i];

    //   if (bookCheck.title === title) {
    //     library.splice(i, 1);
    //     e.target.parentElement.parentElement.remove();
    //     localStorage.setItem('books', JSON.stringify(library));
    //   }
    // }
  }
})

async function updateBooks(title, author, readStatus) {
  const res = await fetch(`http://openlibrary.org/search.json?q=${title.replace(/ /g, '+')}`);
  const data = await res.json();
  imgsrc = await `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`;
  newBook(title, author, imgsrc, readStatus, favoriteStatus);
  createBookCard(title, author, imgsrc, readStatus);
}

window.addEventListener('load', async () => {
  await fetch('http://localhost:8080/api/library')
  .then(res => res.json())
  .then(library => library.forEach(book => createBookCard(book.title, book.author, book.imgsrc, book.readStatus)))
})
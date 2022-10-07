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
function Book(title, author, pages) {
  this.title = title;
  this.author = author;
  this.pages = pages + 'pgs';
}

// Adds a book to the myLibrary array
function addBookToLibrary(title, author, pages) {
  let newBook = new Book(title, author, pages);
  myLibrary.splice(0, myLibrary.length);
  myLibrary.push(newBook);
}

// Takes values from form and generates a new book
let submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (title.value == false || author.value == false) {
    document.getElementById('title').placeholder='Required'
    document.getElementById('author').placeholder='Required'
    title.classList.add('red')
    author.classList.add('red')
  } else {
  addBookToLibrary(title.value, author.value, pages.value)
  displayBooks();
  closeModal(modal)
  document.getElementById('form').reset();
  title.placeholder='Title'
  author.placeholder='Author'
  clearOtherClasses(title);
  clearOtherClasses(author);
  }

  function clearOtherClasses(element) {
    element.className='';
  }

});

// Displays books to webpage using DOM manipulation
function displayBooks() {
  const bookGrid = document.querySelector('.book-grid');
  const card = document.createElement('div');
  const removeBtn = document.createElement('button')

  const toggleDiv = document.createElement('div')
  const toggleSwitch = document.createElement('label')
  const toggleBtn = document.createElement('input')
  const toggleSlider = document.createElement('span')


  
  myLibrary.forEach(myLibrary => {
    card.classList.add('card');
    bookGrid.appendChild(card);
    for (let key in myLibrary) {
      const para = document.createElement('p');
      para.textContent = (`${myLibrary[key]}`);  
      card.appendChild(para);
    };

    // card.appendChild(toggleBtn)

    toggleDiv.classList.add('ToggleDiv')
    toggleSwitch.classList.add('switch')
    toggleBtn.setAttribute('type', 'checkbox')
    toggleSlider.classList.add('slider-round')

    card.appendChild(toggleDiv)
    toggleDiv.appendChild(toggleSwitch)
    toggleSwitch.appendChild(toggleBtn)
    toggleSwitch.appendChild(toggleSlider)

    removeBtn.classList.add('removeBtn');
    card.appendChild(removeBtn);
    removeBtn.innerHTML = "&times;";
  })

  // function toggleStatus() {
  //   if (toggleBtn.check == false) {
  //     toggleBtn.classList.add('unread');
  //   } else {
  //     toggleBtn.classList.add('read');
  //   }
  // }

  // toggleBtn.addEventListener('click', toggleStatus);

  removeBtn.addEventListener('click', () => {
    card.remove();
  })
}
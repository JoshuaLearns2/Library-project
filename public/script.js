document.querySelector('.add-book-button').addEventListener('click', () => {
  document.querySelector('.add-book-modal-background').style.display = 'flex'
})

document.querySelector('.close-modal-button').addEventListener('click', () => {
  document.querySelector('.add-book-modal-background').style.display = 'none'
})

document.querySelector('.sign-up-button').addEventListener('click', () => {
  document.querySelector('.sign-up-modal-background').style.display = 'flex'
})

document.querySelector('.log-in-button').addEventListener('click', () => {
  document.querySelector('.log-in-modal-background').style.display = 'flex'
})

document.querySelector('.close-sign-up-modal-btn').addEventListener('click', () => {
  document.querySelector('.sign-up-modal-background').style.display = 'none'
})

document.querySelector('.close-log-in-modal-btn').addEventListener('click', () => {
  document.querySelector('.log-in-modal-background').style.display = 'none'
})

document.querySelector('.submit-book-button').addEventListener('click', async (e) => {
  e.preventDefault()
  document.querySelector('.add-book-modal-background').style.display = 'none'
  document.querySelector('.loader').style.display = 'flex'
  let title = document.querySelector('.title').value
  let author = document.querySelector('.author').value
  const cover = await fetchBookCover(title)
  let book = { title, author, cover }
  submitBook(book)
  renderBookCard(book)
  document.querySelector('.title').value = ''
  document.querySelector('.author').value = ''
  document.querySelector('.loader').style.display = 'none'
})

const fetchBookCover = async (title) => {
  const res = await fetch(`http://openlibrary.org/search.json?q=${title.replace(/ /g, '+')}`);
  const data = await res.json();
  if (data.docs[0].cover_i === undefined) {
    return 'https://clipart-library.com/images_k/cross-out-sign-transparent/cross-out-sign-transparent-10.png'
  } else {
    return `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`;
  }
}

const submitBook = async (book) => {
  book.readStatus = false
  book.favoriteStatus = false
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(book)
  }
  const res = fetch('http://localhost:8080/api/library', options)
}

const editBook = async (book) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(book)
  }
  const res = await fetch(`http://localhost:8080/api/library/${book._id}`, options)
}

const removeBook = async (book) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(book)
  }
  const res = await fetch(`http://localhost:8080/api/library/${book._id}`, options)
}

const fetchBooks = async () => {
  const res = await fetch('http://localhost:8080/api/library')
  const data = await res.json()
  return data
}

const renderBookCard = (book) => {
  const cardContainer = document.querySelector('.card-container')
  const bookCard = document.createElement('div')
  const cardCoverContainer = document.createElement('div')
  const coverImage = document.createElement('img')
  const cardInfoContainer = document.createElement('div')
  const bookTitle = document.createElement('h2')
  const bookAuthor = document.createElement('p')
  const cardButtonContainer = document.createElement('div')
  const readStatusButton = document.createElement('button')
  const editButton = document.createElement('button')
  const removeButton = document.createElement('button')

  if (book.readStatus === true) {
    readStatusButton.className = 'read'
    readStatusButton.innerText = 'Read'
  } else if (book.readStatus === false) {
    readStatusButton.className = 'unread'
    readStatusButton.innerText = 'Unread'
  }

  bookCard.className = 'card-div'
  cardCoverContainer.className = 'card-cover-container'
  coverImage.className = 'book-cover-img'
  cardInfoContainer.className = 'card-info-container'
  cardButtonContainer.className = 'card-btn-container'
  bookTitle.className = 'book-title'
  bookAuthor.className = 'book-author'
  editButton.className = 'edit-btn'
  removeButton.className = 'remove-btn'

  coverImage.src = `${book.cover}`
  bookTitle.innerText = `${book.title}`
  bookAuthor.innerText = `${book.author}`

  editButton.innerText = 'Edit'
  removeButton.innerText = 'Remove'

  cardContainer.appendChild(bookCard)
  bookCard.appendChild(cardCoverContainer)
  cardCoverContainer.appendChild(coverImage)
  bookCard.appendChild(cardInfoContainer)
  cardInfoContainer.appendChild(bookTitle)
  cardInfoContainer.appendChild(bookAuthor)
  bookCard.appendChild(cardButtonContainer)
  cardButtonContainer.appendChild(readStatusButton)
  cardButtonContainer.appendChild(editButton)
  cardButtonContainer.appendChild(removeButton)
}

document.addEventListener('click', async (e) => {
  if (e.target.matches('.unread')) {
    let title = e.target.parentElement.parentElement.querySelector('.book-title').innerText
    e.target.className = 'read'
    e.target.innerText = 'Read'
    let book = await fetchBooks().then(books => books.filter(book => book.title === title))
    book[0].readStatus = true
    editBook(book[0])
  } else if (e.target.matches('.read')) {
    let title = e.target.parentElement.parentElement.querySelector('.book-title').innerText
    e.target.className = 'unread'
    e.target.innerText = 'Unread'
    let book = await fetchBooks().then(books => books.filter(book => book.title === title))
    book[0].readStatus = false
    editBook(book[0])
  }
})

document.addEventListener('click', (e) => {
  if (e.target.matches('.edit-btn')) {
    let title = e.target.parentElement.parentElement.querySelector('.book-title').innerText
    let author = e.target.parentElement.parentElement.querySelector('.book-author').innerText
    let cover = e.target.parentElement.parentElement.querySelector('img')
    document.querySelector('.edit-modal-background').style.display = 'flex'
    document.querySelector('.edit-title').value = title
    document.querySelector('.edit-author').value = author
    document.querySelector('.close-edit-modal-btn').addEventListener('click', () => {
      document.querySelector('.edit-modal-background').style.display = 'none'
    })

    document.querySelector('.edit-submit-book-btn').addEventListener('click', async (e) => {
      e.preventDefault()
      document.querySelector('.loader').style.display = 'flex'
      document.querySelector('.edit-modal-background').style.display = 'none'
      let book = await fetchBooks().then(books => books.filter(book => book.title === title))
      newBook = {
        _id: await book[0]._id,
        title: document.querySelector('.edit-title').value,
        author: document.querySelector('.edit-author').value,
        cover: await fetchBookCover(document.querySelector('.edit-title').value),
        readStatus: book[0].readStatus,
        favoriteStatus: book[0].favoriteStatus
      }
      editBook(newBook)
      window.location.reload()
      document.querySelector('.loader').style.display = 'none'
    })
  }
})

document.addEventListener('click', async (e) => {
  if (e.target.matches('.remove-btn')) {
    let title = e.target.parentElement.parentElement.querySelector('.book-title').innerText
    let book = await fetchBooks().then(books => books.filter(book => book.title === title))
    removeBook(book[0])
    e.target.parentElement.parentElement.remove()
  }
})

document.querySelector('.sign-up-form-btn').addEventListener('click', (e) => {
  e.preventDefault()
  // console.log('sign up fired')
})

document.querySelector('.log-in-form-btn').addEventListener('click', (e) => {
  e.preventDefault()
  // console.log('log in fired')
})

fetchBooks().then(books => books.map(book => renderBookCard(book)))
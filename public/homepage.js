const renderWelcomeMessage = () => {
  const welcomeContainer = document.querySelector('.welcome-container')
  const welcomeMessage = document.createElement('h1')

  welcomeContainer.className = 'welcome-container'
  welcomeMessage.innerHTML = '<h1>Your library is empty!</h1><br/>Add a book to get started'
  // welcomeMessage.innerHTML = `Here is your information: ${message}`
  welcomeContainer.appendChild(welcomeMessage)
}

document.querySelector('.add-book-button').addEventListener('click', async () => {
  document.querySelector('.add-book-modal-background').style.display = 'flex'
})

document.querySelector('.close-modal-button').addEventListener('click', () => {
  document.querySelector('.add-book-modal-background').style.display = 'none'
})

document.querySelector('.profile-button').addEventListener('click', async () => {
  fetch('http://127.0.0.1:8080/api/userdata')
  .then(res => res.json())
  .then(data => {
    const body = document.querySelector('body')
    const profileModalBackground = document.createElement('div')
    const profileModal = document.createElement('div')
    const profileModalCloseButton = document.createElement('button')
    profileModalBackground.className = 'profile-modal-background'
    profileModal.className = 'profile-modal'
    profileModalCloseButton.className = 'close-modal-button'
    body.appendChild(profileModalBackground)
    profileModalBackground.appendChild(profileModal)
    profileModal.appendChild(profileModalCloseButton)
    profileModalBackground.style.display = 'flex'

    profileModalCloseButton.addEventListener('click', () => {
      profileModalBackground.style.display = 'none'
    })
  })
})

document.querySelector('.log-out-button').addEventListener('click', () => {
  const options = {
    method: "PUT",
    credentials: 'include',
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
  }
  fetch('http://127.0.0.1:8080/logout', options).then(window.location.href = '/')
})

document.querySelector('.submit-book-button').addEventListener('click', async (e) => {
  e.preventDefault()
  document.querySelector('.add-book-modal-background').style.display = 'none'
  document.querySelector('.loader').style.display = 'flex'
  let title = document.querySelector('.title').value
  let author = document.querySelector('.author').value
  const cover = await fetchBookCover(title)
  let book = { title, author, cover, readStatus: false, favoriteStatus: false }
  await submitBook(book)
  renderBookCard(book)
  document.querySelector('.title').value = ''
  document.querySelector('.author').value = ''
  document.querySelector('.loader').style.display = 'none'
})

const submitBook = (book) => {
  const id = location.pathname.split('/')[2]
  const options = {
    method: "PUT",
    credentials: 'include',
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(book)
  }
  fetch(`http://127.0.0.1:8080/user/${id}/library`, options)
}

const fetchBookCover = async (title) => {
  const res = await fetch(`http://openlibrary.org/search.json?q=${title.replace(/ /g, '+')}`)
  const data = await res.json()
  if (data.docs[0].cover_i === undefined) {
    return 'https://clipart-library.com/images_k/cross-out-sign-transparent/cross-out-sign-transparent-10.png'
  } else {
    return `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`
  }
}

const editUserBook = async (book) => {
  const id = location.pathname.split('/')[2]
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(book)
  }
  const res = await fetch(`http://127.0.0.1:8080/user/${id}/library/book`, options)
}

const removeUserBook = async (book) => {
  const id = location.pathname.split('/')[2]
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(book)
  }
  const res = await fetch(`http://127.0.0.1:8080/user/${id}/library/book/delete`, options)
}

const fetchUserBooks = async () => {
  const res = await fetch('http://127.0.0.1:8080/api/userdata')
  const data = await res.json()
  return data[0].library
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
    let book = await fetchUserBooks().then(books => books.filter(book => book.title === title))
    book[0].readStatus = true
    editUserBook(book[0])
  } else if (e.target.matches('.read')) {
    let title = e.target.parentElement.parentElement.querySelector('.book-title').innerText
    e.target.className = 'unread'
    e.target.innerText = 'Unread'
    let book = await fetchUserBooks().then(books => books.filter(book => book.title === title))
    book[0].readStatus = false
    editUserBook(book[0])
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
      let book = await fetchUserBooks().then(books => books.filter(book => book.title === title))
      newBook = {
        _id: await book[0]._id,
        title: document.querySelector('.edit-title').value,
        author: document.querySelector('.edit-author').value,
        cover: await fetchBookCover(document.querySelector('.edit-title').value),
        readStatus: book[0].readStatus,
        favoriteStatus: book[0].favoriteStatus
      }
      editUserBook(newBook)
      window.location.reload()
      document.querySelector('.loader').style.display = 'none'
    })
  }
})

document.addEventListener('click', async (e) => {
  if (e.target.matches('.remove-btn')) {
    let title = e.target.parentElement.parentElement.querySelector('.book-title').innerText
    let book = await fetchUserBooks().then(books => books.filter(book => book.title === title))
    removeUserBook(book[0])
    e.target.parentElement.parentElement.remove()
  }
})

fetchUserBooks()
.then(library => {
  library.map(book => renderBookCard(book))
})
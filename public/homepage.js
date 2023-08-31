const renderWelcomeMessage = () => {
  const welcomeContainer = document.querySelector('.welcome-container')
  const welcomeMessage = document.createElement('h1')

  welcomeContainer.className = 'welcome-container'
  welcomeMessage.innerHTML = '<h1>Your library is empty!</h1><br/>Add a book to get started'
  welcomeContainer.appendChild(welcomeMessage)
}

document.querySelector('.add-book-button').addEventListener('click', async () => {
  document.querySelector('.add-book-modal-background').style.display = 'flex'
})

document.querySelector('.close-modal-button').addEventListener('click', () => {
  document.querySelector('.add-book-modal-background').style.display = 'none'
})

const renderMessageModal = (dynamicMessage) => {
  const modalBackground = document.querySelector('.modal-background')
  const messageModal = document.createElement('div')
  const closeModalContainer = document.createElement('div')
  const closeModalButton = document.createElement('button')
  const modalMessageContainer = document.createElement('div')
  const message = document.createElement('h2')

  modalBackground.innerHTML = ''
  messageModal.className = 'log-in-success-modal'
  closeModalContainer.className = 'close-modal-container'
  closeModalButton.className = 'close-modal-button'
  modalMessageContainer.className = 'modal-message-container'
  closeModalButton.innerHTML = '&times;'
  message.className = 'log-in-success-message'
  modalBackground.style.display = 'flex'
  message.innerText = `${dynamicMessage}`

  modalBackground.appendChild(messageModal)
  messageModal.appendChild(closeModalContainer)
  messageModal.appendChild(modalMessageContainer)
  closeModalContainer.appendChild(closeModalButton)
  modalMessageContainer.appendChild(message)

  closeModalButton.addEventListener('click', () => {
    modalBackground.style.display = 'none'
  })
}

document.querySelector('.profile-button').addEventListener('click', async (e) => {
  e.preventDefault()
  fetch('http://127.0.0.1:8080/api/userdata')
  .then(res => res.json())
  .then(data => {
    const body = document.querySelector('body')
    const profileModalBackground = document.createElement('div')
    const profileModal = document.createElement('div')
    const profileModalCloseButtonContainer = document.createElement('div')
    const profileModalCloseButton = document.createElement('button')
    const profileModalTitle = document.createElement('h3')
    const profileForm = document.createElement('form')
    const usernameInput = document.createElement('input')
    const emailInput = document.createElement('input')
    const profileUpdateButton = document.createElement('button')
    const changePasswordLink = document.createElement('a')

    profileModalBackground.className = 'profile-modal-background'
    profileModal.className = 'profile-modal'
    profileModalCloseButtonContainer.className = 'close-modal-container'
    profileModalCloseButton.className = 'close-modal-button'
    profileModalTitle.className = 'modal-title'
    profileForm.className = 'profile-modal-form'
    usernameInput.className = 'profile-username'
    emailInput.className = 'profile-email'
    profileUpdateButton.className = 'profile-update-button'
    changePasswordLink.className = 'change-password-link'

    profileModalCloseButton.innerHTML = '&times;'
    profileModalTitle.innerHTML = 'PROFILE'
    usernameInput.value = data[0].username
    emailInput.value = data[0].email
    profileUpdateButton.innerHTML = 'Update Profile'
    changePasswordLink.innerText = 'change password'

    body.appendChild(profileModalBackground)
    profileModalBackground.appendChild(profileModal)
    profileModal.appendChild(profileModalCloseButtonContainer)
    profileModalCloseButtonContainer.appendChild(profileModalCloseButton)
    profileModal.appendChild(profileForm)
    profileForm.appendChild(profileModalTitle)
    profileForm.appendChild(usernameInput)
    profileForm.appendChild(emailInput)
    profileForm.appendChild(profileUpdateButton)
    profileForm.appendChild(changePasswordLink)

    profileModalBackground.style.display = 'flex'

    profileModalCloseButton.addEventListener('click', () => {
      profileModalBackground.style.display = 'none'
    })

    profileUpdateButton.addEventListener('click', (e) => {
      e.preventDefault()
      const id = location.pathname.split('/')[2]
      const username = e.target.parentElement.querySelector('.profile-username').value
      const email = e.target.parentElement.querySelector('.profile-email').value

      const options = {
        method: 'PUT',
        credentials: 'include',
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email })
      }
      fetch(`http://127.0.0.1:8080/user/${id}`, options)
      .then(res => res.json())
      .then(data => {
        usernameInput.value = ''
        emailInput.value = ''
        profileModalBackground.style.display = 'none'
        renderMessageModal(`${data.message}`)
        setTimeout(() => {
          document.querySelector('.modal-background').style.display = 'none'
          
          const options = {
            method: "PUT",
            credentials: 'include',
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            },
          }
          fetch('http://127.0.0.1:8080/logout', options).then(window.location.href = '/')
        }, 2000)
      })
    })
    changePasswordLink.addEventListener('click', () => {
      profileModalBackground.style.display = 'none'
      document.querySelector('.change-password-modal-background').style.display = 'flex'
      document.addEventListener('click', (e) => {
        if (e.target.className === 'close-modal-button') {
          document.querySelector('.change-password-form').reset()
          document.querySelector('.change-password-modal-background').style.display = 'none'
        }
      })
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
  const favoriteStatusButton = document.createElement('button')
  const searchButton = document.createElement('button')
  const editButton = document.createElement('button')
  const removeButton = document.createElement('button')

  if (book.readStatus === true) {
    readStatusButton.className = 'read'
    readStatusButton.innerText = 'Read'
  } else if (book.readStatus === false) {
    readStatusButton.className = 'unread'
    readStatusButton.innerText = 'Unread'
  }

  if (book.favoriteStatus === true) {
    favoriteStatusButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 576 512"><path class="favorited" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>'
  } else if (book.favoriteStatus === false) {
    favoriteStatusButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 576 512"><path class="unfavorited" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>'
  }

  searchButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1.8em" viewBox="0 0 512 512"><path class="search-button" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>'

  bookCard.className = 'card-div'
  cardCoverContainer.className = 'card-cover-container'
  coverImage.className = 'book-cover-img'
  cardInfoContainer.className = 'card-info-container'
  favoriteStatusButton.className = 'favorite-status'
  searchButton.className = 'search-button'
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
  cardInfoContainer.appendChild(favoriteStatusButton)
  cardInfoContainer.appendChild(searchButton)
  bookCard.appendChild(cardButtonContainer)
  cardButtonContainer.appendChild(readStatusButton)
  cardButtonContainer.appendChild(editButton)
  cardButtonContainer.appendChild(removeButton)
}

document.addEventListener('click', async (e) => {
  if (e.target.matches('.favorite-status')) {
    let title = e.target.parentElement.parentElement.querySelector('.book-title').innerText
    let book = await fetchUserBooks().then(books => books.filter(book => book.title === title))
    if (book[0].favoriteStatus === false) {
      book[0].favoriteStatus = true
      e.target.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 576 512"><path class="favorited" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>'
    } else if (book[0].favoriteStatus === true) {
      book[0].favoriteStatus = false
      e.target.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 576 512"><path class="unfavorited" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>'
    }
    editUserBook(book[0])
  }
})

document.addEventListener('click', (e) => {
  if (e.target.matches('.search-button')) {
    let title = e.target.parentElement.parentElement.querySelector('.book-title').innerText
    window.open(`https://www.thriftbooks.com/browse/?b.search=${title.replace(/ /g, '+')}`)
  }
})

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
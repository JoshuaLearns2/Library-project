function Book(title, author, pages, read) {
  this.title = title
  this.author = author
  this.pages = pages
  this.read = read
  this.info = function() {
      return title + ' ' + 'by' + ' ' + author + ',' + ' ' + pages + ' ' + 'pages' + ',' + ' ' + read
  }
}

const book1 = new Book('The Hobbit', 'J.R.R. Tolkien', '295', 'no');
console.log(book1.info());
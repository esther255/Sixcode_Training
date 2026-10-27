const myLibrary = [];


function Book(title, author, pages, read) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}


Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

Book.prototype.info = function () {
  const status = this.read ? "read" : "not read yet";
  return `${this.title} by ${this.author}, ${this.pages} pages, ${status}`;
};


function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
  return book;
}

function removeBook(id) {
  const index = myLibrary.findIndex((book) => book.id === id);
  if (index !== -1) myLibrary.splice(index, 1);
}

const libraryEl = document.getElementById("library");
const emptyMessage = document.getElementById("empty-message");
const dialog = document.getElementById("book-dialog");
const form = document.getElementById("book-form");

function createCard(book) {
  const card = document.createElement("article");
  card.classList.add("card");
  if (book.read) card.classList.add("read");
  card.dataset.id = book.id;

  const title = document.createElement("h2");
  title.textContent = book.title;

  const author = document.createElement("p");
  author.classList.add("author");
  author.textContent = `by ${book.author}`;

  const pages = document.createElement("p");
  pages.classList.add("pages");
  pages.textContent = `${book.pages} pages`;

  const status = document.createElement("p");
  status.textContent = book.read ? "Status: Read ✔" : "Status: Not read yet";

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.dataset.action = "toggle";
  toggleBtn.textContent = book.read ? "Mark unread" : "Mark read";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.dataset.action = "remove";
  removeBtn.classList.add("remove");
  removeBtn.textContent = "Remove";

  buttons.append(toggleBtn, removeBtn);
  card.append(title, author, pages, status, buttons);
  return card;
}

function displayBooks() {
  libraryEl.replaceChildren(...myLibrary.map(createCard));
  emptyMessage.hidden = myLibrary.length > 0;
}


document.getElementById("new-book-btn").addEventListener("click", () => {
  form.reset();
  dialog.showModal();
});

document.getElementById("cancel-btn").addEventListener("click", () => {
  dialog.close();
});

form.addEventListener("submit", () => {
  const data = new FormData(form);
  addBookToLibrary(
    data.get("title").trim(),
    data.get("author").trim(),
    Number(data.get("pages")),
    form.elements.read.checked
  );
  displayBooks();
});


libraryEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.closest(".card").dataset.id;

  if (button.dataset.action === "remove") {
    removeBook(id);
  } else if (button.dataset.action === "toggle") {
    const book = myLibrary.find((b) => b.id === id);
    book.toggleRead();
  }
  displayBooks();
});


addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, true);
addBookToLibrary("Clean Code", "Robert C. Martin", 464, false);
displayBooks();
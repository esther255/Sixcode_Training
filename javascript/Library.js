
// 1. ARRAY TO STORE ALL BOOKS

const myLibrary = [];

// 2. BOOK CLASS

class Book {
  constructor(title, author, pages, read, id = crypto.randomUUID()) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  toggleRead() {
    this.read = !this.read;
  }

  info() {
    const status = this.read ? "read" : "not read yet";

    return `${this.title} by ${this.author}, ${this.pages} pages, ${status}`;
  }
}

// 3. SAVE LIBRARY TO LOCAL STORAGE

function saveLibrary() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

// 4. LOAD LIBRARY FROM LOCAL STORAGE

function loadLibrary() {
  const savedBooks = localStorage.getItem("myLibrary");

  if (savedBooks === null) {
    return false;
  }

  try {
    const books = JSON.parse(savedBooks);

    if (!Array.isArray(books)) {
      return false;
    }

    books.forEach((book) => {
      myLibrary.push(
        new Book(
          book.title,
          book.author,
          book.pages,
          book.read,
          book.id
        )
      );
    });

    return true;

  } catch (error) {
    console.error("Could not load saved books:", error);
    return false;
  }
}

// 5. ADD BOOK TO LIBRARY

function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);

  myLibrary.push(book);

  saveLibrary();

  return book;
}

// 6. REMOVE BOOK FROM LIBRARY

function removeBook(id) {
  const index = myLibrary.findIndex(
    (book) => book.id === id
  );

  if (index !== -1) {
    myLibrary.splice(index, 1);

    saveLibrary();
  }
}

// 7. DOM ELEMENTS

const libraryEl = document.getElementById("library");
const emptyMessage = document.getElementById("empty-message");
const dialog = document.getElementById("book-dialog");
const form = document.getElementById("book-form")

// 8. CREATE BOOK CARD

function createCard(book) {
  const card = document.createElement("article");

  card.classList.add("card");

  if (book.read) {
    card.classList.add("read");
  }

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

  status.textContent = book.read
    ? "Status: Read ✔"
    : "Status: Not read yet";

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const toggleBtn = document.createElement("button");

  toggleBtn.type = "button";
  toggleBtn.dataset.action = "toggle";

  toggleBtn.textContent = book.read
    ? "Mark unread"
    : "Mark read";

  const removeBtn = document.createElement("button");

  removeBtn.type = "button";
  removeBtn.dataset.action = "remove";
  removeBtn.classList.add("remove");

  removeBtn.textContent = "Remove";

  buttons.append(toggleBtn, removeBtn);

  card.append(title, author, pages, status, buttons);

  return card;
}

// 9. DISPLAY BOOK

function displayBooks() {
  libraryEl.replaceChildren(...myLibrary.map(createCard));

  emptyMessage.hidden = myLibrary.length > 0;
}

// 10. OPEN DIALOG

document
  .getElementById("new-book-btn")
  .addEventListener("click", () => {
    form.reset();

    dialog.showModal();
  });

// 11. CLOSE DIALOG

document
  .getElementById("cancel-btn")
  .addEventListener("click", () => {
    dialog.close();
  });

// 12. ADD BOOK WHEN FORM IS SUBMITTED

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

// 13. HANDLE REMOVE AND TOGGLE BUTTONS

libraryEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = button.closest(".card").dataset.id;

  if (button.dataset.action === "remove") {
    removeBook(id);

  } else if (button.dataset.action === "toggle") {
    const book = myLibrary.find((b) => b.id === id);

    if (book) {
      book.toggleRead();

      saveLibrary();
    }
  }

  displayBooks();
});

// 14. INITIALIZE LIBRARY

// First, load previously saved books
const hasSavedLibrary = loadLibrary();

// Only add example books if this is the first visit
if (!hasSavedLibrary) {
  addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, true);

  addBookToLibrary("Clean Code", "Robert C. Martin", 464, false);
}

// Display books on the page
displayBooks();

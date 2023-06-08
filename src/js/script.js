const localStorageKey = "BOOK_SHELF";

let checkInput = [];
let checkTitle = null;
let checkAuthor = null;
let checkYear = null;

window.addEventListener("load", function () {
  if (localStorage.getItem(localStorageKey) !== null) {
    const booksData = getData();
    showData(booksData);
  }
});

const title = document.querySelector("#inputBookTitle");
const errorTitle = document.querySelector("#errorTitle");
const sectionTitle = document.querySelector("#secTitle");

const author = document.querySelector("#inputBookAuthor");
const errorAuthor = document.querySelector("#errorAuthor");
const sectionAuthor = document.querySelector("#secAuthor");

const year = document.querySelector("#inputBookYear");
const errorYear = document.querySelector("#errorYear");
const sectionYear = document.querySelector("#secYear");

const readed = document.querySelector("#inputBookIsComplete");

const btnSubmit = document.querySelector("#bookSubmit");

btnSubmit.addEventListener("click", function () {
  if (btnSubmit.value == "") {
    checkInput = [];

    title.classList.remove("error");
    author.classList.remove("error");
    year.classList.remove("error");

    errorTitle.classList.add("error-display");
    errorAuthor.classList.add("error-display");
    errorYear.classList.add("error-display");

    if (title.value == "") {
      checkTitle = false;
    } else {
      checkTitle = true;
    }

    if (author.value == "") {
      checkAuthor = false;
    } else {
      checkAuthor = true;
    }

    if (year.value == "") {
      checkYear = false;
    } else {
      checkYear = true;
    }

    checkInput.push(checkTitle, checkAuthor, checkYear);
    let resultCheck = validation(checkInput);

    if (resultCheck.includes(false)) {
      return false;
    } else {
      const bookContent = {
        id: +new Date(),
        title: title.value.trim(),
        author: author.value.trim(),
        year: year.value,
        isCompleted: readed.checked,
      };
      insertData(bookContent);

      title.value = "";
      author.value = "";
      year.value = "";
      readed.checked = false;
    }
  } else {
    const bookDatas = getData().filter((a) => a.id != btnSubmit.value);
    localStorage.setItem(localStorageKey, JSON.stringify(bookDatas));

    const bookContent = {
      id: btnSubmit.value,
      title: title.value.trim(),
      author: author.value.trim(),
      year: year.value,
      isCompleted: readed.checked,
    };
    insertData(bookContent);
    btnSubmit.innerHTML = "Enter the Book title";
    btnSubmit.value = "";
    title.value = "";
    author.value = "";
    year.value = "";
    readed.checked = false;
    alert("The book was edited successfully");
  }
});

const searchValue = document.querySelector("#searchBookTitle");
const btnSearch = document.querySelector("#searchSubmit");

btnSearch.addEventListener("click", function (e) {
  e.preventDefault();
  if (localStorage.getItem(localStorageKey) == null) {
    return alert("There is no book data");
  } else {
    const getByTitle = getData().filter(
      (a) => a.title == searchValue.value.trim()
    );
    if (getByTitle.length == 0) {
      const getByAuthor = getData().filter(
        (a) => a.author == searchValue.value.trim()
      );
      if (getByAuthor.length == 0) {
        const getByYear = getData().filter(
          (a) => a.year == searchValue.value.trim()
        );
        if (getByYear.length == 0) {
          alert(`Book Not Found ${searchValue.value}`);
        } else {
          showSearchResult(getByYear);
        }
      } else {
        showSearchResult(getByAuthor);
      }
    } else {
      showSearchResult(getByTitle);
    }
  }

  searchValue.value = "";
});

function validation(check) {
  let resultCheck = [];

  check.forEach((a, i) => {
    if (a == false) {
      if (i == 0) {
        title.classList.add("error");
        errorTitle.classList.remove("error-display");
        resultCheck.push(false);
      } else if (i == 1) {
        author.classList.add("error");
        errorAuthor.classList.remove("error-display");
        resultCheck.push(false);
      } else {
        year.classList.add("error");
        errorYear.classList.remove("error-display");
        resultCheck.push(false);
      }
    }
  });

  return resultCheck;
}

function insertData(book) {
  let bookDatas = [];

  if (localStorage.getItem(localStorageKey) === null) {
    localStorage.setItem(localStorageKey, 0);
  } else {
    bookDatas = JSON.parse(localStorage.getItem(localStorageKey));
  }

  bookDatas.unshift(book);
  localStorage.setItem(localStorageKey, JSON.stringify(bookDatas));

  showData(getData());
}

function getData() {
  return JSON.parse(localStorage.getItem(localStorageKey)) || [];
}

function showData(books = []) {
  const inCompleted = document.querySelector("#incompleteBookshelfList");
  const completed = document.querySelector("#completeBookshelfList");

  inCompleted.innerHTML = "";
  completed.innerHTML = "";

  books.forEach((book) => {
    if (book.isCompleted == false) {
      let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>
                <div class="action">
                    <button class="green" onclick="readedBook('${book.id}')">Selesai dibaca</button>
                    <button class="yellow" onclick="editBook('${book.id}')">Edit Buku</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;

      inCompleted.innerHTML += el;
    } else {
      let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>
                <div class="action">
                    <button class="green" onclick="unreadedBook('${book.id}')">Belum selesai di Baca</button>
                    <button class="yellow" onclick="editBook('${book.id}')">Edit Buku</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;
      completed.innerHTML += el;
    }
  });
}

function showSearchResult(books) {
  const searchResult = document.querySelector("#searchResult");

  searchResult.innerHTML = "";

  books.forEach((book) => {
    let el = `
        <article class="book_item">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <p>${book.isCompleted ? "Already read" : "Not read yet"}</p>
        </article>
        `;

    searchResult.innerHTML += el;
  });
}

function readedBook(id) {
  let confirmation = confirm("Move to finished reading?");

  if (confirmation == true) {
    const bookDataContent = getData().filter((a) => a.id == id);
    const bookContent = {
      id: bookDataContent[0].id,
      title: bookDataContent[0].title,
      author: bookDataContent[0].author,
      year: bookDataContent[0].year,
      isCompleted: true,
    };

    const bookDatas = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookDatas));

    insertData(bookContent);
  } else {
    return 0;
  }
}

function unreadedBook(id) {
  let confirmation = confirm("Move to unfinished reading?");

  if (confirmation == true) {
    const bookDataContent = getData().filter((a) => a.id == id);
    const bookContent = {
      id: bookDataContent[0].id,
      title: bookDataContent[0].title,
      author: bookDataContent[0].author,
      year: bookDataContent[0].year,
      isCompleted: false,
    };

    const bookDatas = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookDatas));

    insertData(bookContent);
  } else {
    return 0;
  }
}

function editBook(id) {
  const bookDataContent = getData().filter((a) => a.id == id);
  title.value = bookDataContent[0].title;
  author.value = bookDataContent[0].author;
  year.value = bookDataContent[0].year;
  bookDataContent[0].isCompleted
    ? (readed.checked = true)
    : (readed.checked = false);

  btnSubmit.innerHTML = "Edit the book";
  btnSubmit.value = bookDataContent[0].id;
}

function deleteBook(id) {
  let confirmation = confirm("Do you want to delete this book?");

  if (confirmation == true) {
    confirmation = confirm("Are you sure you want to delete this book?");
  } else {
    return 0;
  }

  if (confirmation == true) {
    const bookDataContent = getData().filter((a) => a.id == id);
    const bookDatas = getData().filter((a) => a.id != id);
    localStorage.setItem(localStorageKey, JSON.stringify(bookDatas));
    showData(getData());
    alert(`The Book ${bookDataContent[0].title} has been deleted`);
  } else {
    return 0;
  }
}

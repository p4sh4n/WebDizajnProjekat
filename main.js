const BASE_URL = "https://ptf-web-dizajn-2022.azurewebsites.net/";

let books = [];
let authors = [];

const fetchBooks = () => {
    fetch(`${BASE_URL}/books`)
    .then(res => {
        return res.json();
    })
    .then(data => {
        books = data;
        renderBooks(data);
    });
}

fetchBooks();

fetch(`${BASE_URL}/authors`)
    .then(res => {
        return res.json();
    })
    .then(data => {
        authors = data;
    });


const renderBooks = (books) => {
    const booksRow = document.getElementById('booksRow');

    let resultBooksHtml = '';

    books.forEach(book => {
        resultBooksHtml += `
        <div class="card mx-2 my-2" style="width: 18rem;">
            <img src="${book.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${book.name}</h5>
                <p class="card-text">${book.genre}</p>
                <p class="card-text">Author: ${book.author.name}</p>
                <button type="button" onclick="fillEditData('${book.id}')" class="btn btn-light fillData" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap">Edit</button>
                <button type="button" onclick="buyBook('${book.id}')"class="btn btn-warning deleteData">Buy</button>
            </div>
        </div>
        `;

    });

    booksRow.innerHTML = resultBooksHtml;
}

const fillEditData = (bookId) => {
    const book = books.find(book => book.id === bookId);
    const bookFormId = document.getElementById('book-id');
    const bookFormName = document.getElementById('book-name');
    const bookFormImage = document.getElementById('book-image');
    const bookFormGenre = document.getElementById('book-genre');
    const bookFormAuthor = document.getElementById('book-author');

    bookFormId.value = book.id;
    bookFormName.value = book.name;
    bookFormImage.value = book.image;
    bookFormGenre.value = book.genre;
    bookFormAuthor.value = book.author.id;
}

const editbook = () => { 
    const bookFormId = document.getElementById('book-id').value;
    const bookFormName = document.getElementById('book-name').value;
    const bookFormImage = document.getElementById('book-image').value;
    const bookFormGenre = document.getElementById('book-genre').value;
    const bookFormAuthor = document.getElementById('book-author').value;

    fetch(`${BASE_URL}/books`, {
        method: 'PUT', 
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
            bookId: bookFormId,
            name: bookFormName,
            image: bookFormImage,
            genre: bookFormGenre,
            authorId: bookFormAuthor
        })
    })
    .then(res => {
        if(!res.ok){
            alert('Error');
        }
    })
}

const buyBook = (id) => {
    fetch(`${BASE_URL}/books/{${id}}`, {
        method: "DELETE",
    }).then((res) => {
        if(!res.ok){
            alert('Error');
        }
    })
    books = books.slice(id);
    renderBooks(books);
}


const postBook = () => {
    const bookFormName = document.getElementById('bookName').value;
    const bookFormGenre = document.getElementById('bookGenre').value;
    const bookFormImage = document.getElementById('bookImage').value;
    const bookFormAuthor = document.getElementById('bookAuthor').value;
    let bookAuthorId;
    let authorExists = false;

    authors.forEach(author =>{
        if(author.name===bookFormAuthor){
            bookAuthorId = author.id;
            authorExists = true;
        } 
    })

    if(!authorExists){
        postAuthor(bookFormAuthor);
    }

    fetch(`${BASE_URL}/books`, {
        method: 'POST', 
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
            name: bookFormName,
            genre: bookFormGenre,
            image: bookFormImage,
            authorId: bookAuthorId
        })
    })
    .then(res => {
        if(!res.ok){
            alert('Error');
        }
    })
}

const BASE_URL = "https://ptf-web-dizajn-2022.azurewebsites.net/";

let books = [];

fetch(`${BASE_URL}/books`)
    .then(res => {
        return res.json();
    })
    .then(data => {
        books = data;
        renderBooks(data);
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
                <button type="button" onclick="fillEditData(${book.id})" class="btn btn-light fillData" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap">Edit</button>
                <button type="button" onclick="buyBook(${book.id})"class="btn btn-warning deleteData">Buy</button>
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

    console.log("ID: "+ book.id);
    console.log("Name: "+ book.name);
    console.log("Image: "+ book.image);
    console.log("Genre: "+ book.genre);

    bookFormId.value = book.id;
    bookFormName.value = book.name;
    bookFormImage.value = book.imageUrl;
    bookFormGenre.value = book.genre;
}

const editbook = () => { 
    const bookFormId = document.getElementById('book-id').value;
    const bookFormName = document.getElementById('book-name').value;
    const bookFormImage = document.getElementById('book-image').value;
    const bookFormGenre = document.getElementById('book-genre').value;

    fetch(`${BASE_URL}/books`, {
        method: 'PUT', 
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
            id: bookFormId,
            name: bookFormName,
            image: bookFormImage,
            genre: bookFormGenre
        })
    })
    .then(res => {
        if(!res.ok){
            alert('Error');
        }
    })
}

const buyBook = (id) => {
    fetch(`${BASE_URL}/books/${id}`, {
        method: "DELETE",
    }).then((res) => {
        if(!res.ok){
            alert('Error');
        }
    })
    books = books.slice(id)
    renderBooks (books)
}

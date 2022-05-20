const BASE_URL = "https://ptf-web-dizajn-2022.azurewebsites.net/";

let books = [];
let authors = [];

const forms = document.querySelectorAll('.needs-validation')


Array.from(forms).forEach(form => { //Validacija forme za post
    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }
        form.classList.add('was-validated')
    }, false)
})

const fetchBooks = () => { //Get unutar funkcije radi kasnijih poziva nakon put-a, post-a i delete-a
    fetch(`${BASE_URL}/books`)
    .then(res => {
        return res.json();
    })
    .then(data => {
        books = data;
        renderBooks(data);
    });
}

fetch(`${BASE_URL}/authors`) //Get autora za post metodu i search
    .then(res => {
        return res.json();
    })
    .then(data => {
        authors = data;
    });

fetchBooks(); //Pocetni fetch prilikom loadanja stranice

const renderBooks = (books) => { //Render knjiga koje su dobivene get-om
    const booksRow = document.getElementById('booksRow');
    const booksSearch = document.getElementById('datalistOptions');

    let resultBooksHtml = '';
    let resultSearchHtml = '';

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
        resultSearchHtml += `
        <option value="${book.name}">
        `;
    });

    
    booksRow.innerHTML = resultBooksHtml;
    booksSearch.innerHTML = resultSearchHtml;
}

const fillEditData = (bookId) => { //Upis podataka u modal za put metodu
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

const editbook = async () => { //Put metoda, nakon fetcha ponovo renderuje content stranice
    const bookFormId = document.getElementById('book-id').value;
    const bookFormName = document.getElementById('book-name').value;
    const bookFormImage = document.getElementById('book-image').value;
    const bookFormGenre = document.getElementById('book-genre').value;
    const bookFormAuthor = document.getElementById('book-author').value;

    await fetch(`${BASE_URL}/books`, {
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

    fetchBooks();
    renderBooks(books);
}

const buyBook = async (id) => {
    await fetch(`${BASE_URL}/books/{${id}}`, {
        method: "DELETE",
    }).then((res) => {
        if(!res.ok){
            alert('Error');
        }
    })
    fetchBooks();
    renderBooks(books);
}

const postBook = async () => { //Post metoda, nakon fetcha ponovo renderuje content stranice
    const bookFormName = document.getElementById('bookName').value;
    const bookFormGenre = document.getElementById('bookGenre').value;
    const bookFormImage = document.getElementById('bookImage').value;
    const bookFormAuthor = document.getElementById('bookAuthor').value;
    let bookAuthorId;
    let authorExists = false;

    //Rjesenje za ponavljanje koda ispod je da se post-a svaki uneseni author
    //i ne izbacuje error na svakom post-u gdje je bad req radi postojeceg autora,
    // ali onda postoji bad req na svakom postojecem autoru sto takodjer nije optimalno
    authors.forEach(author =>{
        if(author.name===bookFormAuthor){
            bookAuthorId = author.id;
            authorExists = true;
        } 
    })

    if(!authorExists){  //Posto unosimo ime autora, za slucaj da ne postoji autor prvo ga post-am na api,
                        // pa ponovo get-am da dobijem njegov id da mogu post-at knjigu sa novim autorom
        await fetch(`${BASE_URL}/authors`, {
            method: 'POST', 
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({
                name: bookFormAuthor
            })
        })
        .then(res => {
            if(!res.ok){
                alert('Error');
            }
        })
    }

    await fetch(`${BASE_URL}/authors`)  //svaka get  i post metoda ovdje nazalost ne moze biti u zasebnoj funkciji
                                        // jer await ne funkcionise na pozivu druge funckije
        .then(res => {
            return res.json();
        })
        .then(data => {
            authors = data;
        });

    authors.forEach(author =>{
        if(author.name===bookFormAuthor){
            bookAuthorId = author.id;
        } 
    })

    await fetch(`${BASE_URL}/books`, {
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

    fetchBooks();
    renderBooks(books);
}


const searchBooks = () => {//Live search na osnovu imena knjiga
    const searchTerm = document.getElementById("bookSearch").value.toLowerCase();

    let filteredBooks = [];

    books.forEach(book => {
        if(book.name.toLowerCase().includes(searchTerm)){
            filteredBooks.push(book);
        }
    })

    renderBooks(filteredBooks);
}

const bookDuplicate = (filteredBooks, checkBook) => { //Provjera da li vec postoji knjiga unutar niza
    filteredBooks.forEach(book =>{
        if(book.name===checkBook.name){
            console.log("POSTOJI!");
            return true;
        }
    })
}

const allFilters = () => { //Filtriranje za slucaj kad su svi filteri aktivni
    const authorFilterInput = document.getElementById('authorFilter').value.toLowerCase();
    const genreFilterInput = document.getElementById('genreFilter').value.toLowerCase();

    let filteredBooks = [];

    books.forEach(book => {
        if(book.genre.toLowerCase().includes(genreFilterInput) && book.author.name.toLowerCase().includes(authorFilterInput)){
            if(!bookDuplicate(filteredBooks, book)){
                filteredBooks.push(book);
            }
        }
    })
    return filteredBooks;
}

const filterBooks = () => { //Kreiranje novog niza knjiga na osnovu filtera, pokusao uraditi da izbacujem elemente na osnovu filtera ali iz nekog razloga nije funkcionisalo
    const authorFilterInput = document.getElementById('authorFilter').value.toLowerCase();
    const genreFilterInput = document.getElementById('genreFilter').value.toLowerCase();

    let filteredBooks = [];
    
    if(genreFilterInput!="" && authorFilterInput!=""){ //Posto sam kreirao novi niz morao sam imati funkcije za svaku kombinaciju filtera (glup nacin iskreno ali jedini radio)
        renderBooks(allFilters());
        return;
    }

    if(genreFilterInput=="" && authorFilterInput==""){ //Kada se obrisu filteri da ponovo vrati sve knjige
        renderBooks(books);
        return;
    }

    books.forEach(book => {
        if(genreFilterInput!="") {
            if(book.genre.toLowerCase().includes(genreFilterInput)){
                if(!bookDuplicate(filteredBooks, book)){
                    filteredBooks.push(book);
                }
            }
        }
        if(authorFilterInput!="") { //Authors api ima mogucnost da vrati knjige na osnovu id-a autora, ali je ovo jednostavniji nacin za filtriranje
            if(book.author.name.toLowerCase().includes(authorFilterInput)){
                if(!bookDuplicate(filteredBooks, book)){
                    filteredBooks.push(book);
                }
            }
        }
    })

    renderBooks(filteredBooks);
}
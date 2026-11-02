
const express = require("express");

const app = express();
const PORT = 3000;


app.use(express.json());

let books = [
    {
        id: 101,
        title: "JAVA Programming",
        author: "Herbert Schildt",
        category: "Programming",
        quantity: 5,
        available: 5
    },
    {
        id: 102,
        title: "Programming with Cpp",
        author: "Bjarne Stroustrup",
        category: "Programming",
        quantity: 3,
        available: 3
    }
];

let nextId = 3;

app.post("/api/books", (req, res) => {
    const { title, author, category, quantity } = req.body;

    if (!title || !author || !category ||
        !Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
            message: "Enter valid title, author, category and quantity"
        });
    }

    const newBook = {
        id: nextId++,
        title,
        author,
        category,
        quantity,
        available: quantity
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});


app.get("/api/books", (req, res) => {
    res.status(200).json(books);
});
app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// 4. SEARCH BOOK BY ID
app.get("/api/books/search/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json({
        message: "Book found successfully",
        book: book
    });
});

// 5. UPDATE BOOK USING ID
app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, category, quantity, available } = req.body;

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (category !== undefined) book.category = category;

    if (quantity !== undefined) {
        if (!Number.isInteger(quantity) || quantity < book.quantity - book.available) {
            return res.status(400).json({
                message: "Invalid quantity. It cannot be less than issued copies."
            });
        }
        book.quantity = quantity;
    }

    if (available !== undefined) {
        if (!Number.isInteger(available) ||
            available < 0 || available > book.quantity) {
            return res.status(400).json({
                message: "Invalid available quantity"
            });
        }
        book.available = available;
    }

    res.status(200).json({
        message: "Book updated successfully",
        book: book
    });
});

// 6. DELETE BOOK USING ID
app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook[0]
    });
});

app.post("/api/books/:id/issue", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.available <= 0) {
        return res.status(400).json({
            message: "Book is currently unavailable"
        });
    }

    book.available--;

    res.status(200).json({
        message: "Book issued successfully",
        book: book
    });
});


app.post("/api/books/:id/return", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.available >= book.quantity) {
        return res.status(400).json({
            message: "No issued copies to return"
        });
    }

    book.available++;

    res.status(200).json({
        message: "Book returned successfully",
        book: book
    });
});


app.listen(PORT, () => {
    console.log(`Library API running at http://localhost:${PORT}`);
});

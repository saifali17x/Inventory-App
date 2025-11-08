import "dotenv/config";
import express from "express";
import expressLayouts from "express-ejs-layouts";

// Import routes
import indexRouter from "./routes/index.js";
import booksRouter from "./routes/books.js";
import authorsRouter from "./routes/authors.js";
import categoriesRouter from "./routes/categories.js";
import membersRouter from "./routes/members.js";

const app = express();

// Set EJS as template engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));

// Routes
app.use("/", indexRouter);
app.use("/books", booksRouter);
app.use("/authors", authorsRouter);
app.use("/categories", categoriesRouter);
app.use("/members", membersRouter);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).render("error", {
    error: "Page not found",
    title: "404 - Not Found",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    error: "Something went wrong!",
    title: "Error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

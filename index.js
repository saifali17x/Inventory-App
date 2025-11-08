import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import expressLayouts from "express-ejs-layouts";
import { initializeDatabase, isDatabaseInitialized } from "./db/init.js";

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

// Request logging for Railway debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint for Railway
app.get("/health", (req, res) => {
  console.log("💚 Health check accessed");
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString(), port: process.env.PORT });
});

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

// Initialize database and start server
async function startServer() {
  try {
    // Check if we should force initialize or if database needs initialization
    const shouldForceInit = process.env.FORCE_DB_INIT === "true";
    const dbInitialized = await isDatabaseInitialized();

    if (shouldForceInit || !dbInitialized) {
      console.log(
        shouldForceInit
          ? "🔄 Force initializing database..."
          : "📦 Database not found, initializing..."
      );
      await initializeDatabase();
    } else {
      console.log("✅ Database already initialized");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("💥 Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

import * as queries from "../db/queries.js";

// HOME CONTROLLER
export const getHome = async (req, res) => {
  try {
    console.log("🏠 Loading dashboard...");
    const stats = await queries.getDashboardStats();
    const recentTransactions = await queries.getActiveTransactions();
    const overdueBooks = await queries.getOverdueTransactions();

    console.log("✅ Dashboard data loaded successfully");
    res.render("index", {
      stats,
      recentTransactions: recentTransactions.slice(0, 5),
      overdueBooks: overdueBooks.slice(0, 5),
    });
  } catch (error) {
    console.error("❌ Error loading dashboard:", error);
    console.error("Error details:", error.message);

    // Fallback for Railway deployment issues
    res.render("index", {
      stats: {
        totalBooks: 0,
        totalMembers: 0,
        activeTransactions: 0,
        overdueCount: 0,
      },
      recentTransactions: [],
      overdueBooks: [],
      error: "Dashboard data temporarily unavailable",
    });
  }
};

// BOOKS CONTROLLERS
export const getAllBooks = async (req, res) => {
  try {
    const books = await queries.getAllBooks();
    res.render("books/list", { books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).render("error", { error: "Failed to fetch books" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await queries.getBookById(req.params.id);
    if (!book) {
      return res.status(404).render("error", { error: "Book not found" });
    }
    res.render("books/detail", { book });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).render("error", { error: "Failed to fetch book" });
  }
};

export const getCreateBookForm = async (req, res) => {
  try {
    const authors = await queries.getAllAuthors();
    const categories = await queries.getAllCategories();
    const publishers = await queries.getAllPublishers();
    res.render("books/create", { authors, categories, publishers });
  } catch (error) {
    console.error("Error loading form:", error);
    res.status(500).render("error", { error: "Failed to load form" });
  }
};

export const createBook = async (req, res) => {
  try {
    await queries.createBook(req.body);
    res.redirect("/books");
  } catch (error) {
    console.error("Error creating book:", error);
    const authors = await queries.getAllAuthors();
    const categories = await queries.getAllCategories();
    const publishers = await queries.getAllPublishers();
    res.render("books/create", {
      authors,
      categories,
      publishers,
      error: "Failed to create book",
      formData: req.body,
    });
  }
};

export const getEditBookForm = async (req, res) => {
  try {
    const book = await queries.getBookById(req.params.id);
    const authors = await queries.getAllAuthors();
    const categories = await queries.getAllCategories();
    const publishers = await queries.getAllPublishers();

    if (!book) {
      return res.status(404).render("error", { error: "Book not found" });
    }

    res.render("books/edit", { book, authors, categories, publishers });
  } catch (error) {
    console.error("Error loading edit form:", error);
    res.status(500).render("error", { error: "Failed to load edit form" });
  }
};

export const updateBook = async (req, res) => {
  try {
    await queries.updateBook(req.params.id, req.body);
    res.redirect(`/books/${req.params.id}`);
  } catch (error) {
    console.error("Error updating book:", error);
    const book = await queries.getBookById(req.params.id);
    const authors = await queries.getAllAuthors();
    const categories = await queries.getAllCategories();
    const publishers = await queries.getAllPublishers();
    res.render("books/edit", {
      book,
      authors,
      categories,
      publishers,
      error: "Failed to update book",
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    await queries.deleteBook(req.params.id);
    res.redirect("/books");
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).render("error", {
      error: "Failed to delete book. It may be currently borrowed.",
    });
  }
};

// AUTHORS CONTROLLERS
export const getAllAuthors = async (req, res) => {
  try {
    const authors = await queries.getAllAuthors();
    res.render("authors/list", { authors });
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).render("error", { error: "Failed to fetch authors" });
  }
};

export const getAuthorById = async (req, res) => {
  try {
    const { author, books } = await queries.getAuthorWithBooks(req.params.id);
    if (!author) {
      return res.status(404).render("error", { error: "Author not found" });
    }
    res.render("authors/detail", { author, books });
  } catch (error) {
    console.error("Error fetching author:", error);
    res.status(500).render("error", { error: "Failed to fetch author" });
  }
};

export const getCreateAuthorForm = (req, res) => {
  res.render("authors/create");
};

export const createAuthor = async (req, res) => {
  try {
    await queries.createAuthor(req.body);
    res.redirect("/authors");
  } catch (error) {
    console.error("Error creating author:", error);
    res.render("authors/create", {
      error: "Failed to create author",
      formData: req.body,
    });
  }
};

export const getEditAuthorForm = async (req, res) => {
  try {
    const author = await queries.getAuthorById(req.params.id);
    if (!author) {
      return res.status(404).render("error", { error: "Author not found" });
    }
    res.render("authors/edit", { author });
  } catch (error) {
    console.error("Error loading edit form:", error);
    res.status(500).render("error", { error: "Failed to load edit form" });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    await queries.updateAuthor(req.params.id, req.body);
    res.redirect(`/authors/${req.params.id}`);
  } catch (error) {
    console.error("Error updating author:", error);
    const author = await queries.getAuthorById(req.params.id);
    res.render("authors/edit", {
      author,
      error: "Failed to update author",
    });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    await queries.deleteAuthor(req.params.id);
    res.redirect("/authors");
  } catch (error) {
    console.error("Error deleting author:", error);
    res.status(500).render("error", {
      error: "Failed to delete author. They may have books in the system.",
    });
  }
};

// CATEGORIES CONTROLLERS
export const getAllCategories = async (req, res) => {
  try {
    const categories = await queries.getAllCategories();
    res.render("categories/list", { categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).render("error", { error: "Failed to fetch categories" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { category, books } = await queries.getCategoryWithBooks(
      req.params.id
    );
    if (!category) {
      return res.status(404).render("error", { error: "Category not found" });
    }
    res.render("categories/detail", { category, books });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).render("error", { error: "Failed to fetch category" });
  }
};

export const getCreateCategoryForm = (req, res) => {
  res.render("categories/create");
};

export const createCategory = async (req, res) => {
  try {
    await queries.createCategory(req.body);
    res.redirect("/categories");
  } catch (error) {
    console.error("Error creating category:", error);
    res.render("categories/create", {
      error: "Failed to create category",
      formData: req.body,
    });
  }
};

export const getEditCategoryForm = async (req, res) => {
  try {
    const category = await queries.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).render("error", { error: "Category not found" });
    }
    res.render("categories/edit", { category });
  } catch (error) {
    console.error("Error loading edit form:", error);
    res.status(500).render("error", { error: "Failed to load edit form" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    await queries.updateCategory(req.params.id, req.body);
    res.redirect(`/categories/${req.params.id}`);
  } catch (error) {
    console.error("Error updating category:", error);
    const category = await queries.getCategoryById(req.params.id);
    res.render("categories/edit", {
      category,
      error: "Failed to update category",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { category, books } = await queries.getCategoryWithBooks(
      req.params.id
    );

    if (books.length > 0) {
      return res.status(400).render("error", {
        error: `Cannot delete category "${category.category_name}" because it has ${books.length} books. Please reassign or delete the books first.`,
      });
    }

    await queries.deleteCategory(req.params.id);
    res.redirect("/categories");
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).render("error", { error: "Failed to delete category" });
  }
};

// MEMBERS CONTROLLERS
export const getAllMembers = async (req, res) => {
  try {
    const members = await queries.getAllMembers();
    res.render("members/list", { members });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).render("error", { error: "Failed to fetch members" });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const member = await queries.getMemberById(req.params.id);
    if (!member) {
      return res.status(404).render("error", { error: "Member not found" });
    }
    res.render("members/detail", { member });
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).render("error", { error: "Failed to fetch member" });
  }
};

export const getCreateMemberForm = (req, res) => {
  res.render("members/create");
};

export const createMember = async (req, res) => {
  try {
    await queries.createMember(req.body);
    res.redirect("/members");
  } catch (error) {
    console.error("Error creating member:", error);
    res.render("members/create", {
      error: "Failed to create member",
      formData: req.body,
    });
  }
};

export const getEditMemberForm = async (req, res) => {
  try {
    const member = await queries.getMemberById(req.params.id);
    if (!member) {
      return res.status(404).render("error", { error: "Member not found" });
    }
    res.render("members/edit", { member });
  } catch (error) {
    console.error("Error loading edit form:", error);
    res.status(500).render("error", { error: "Failed to load edit form" });
  }
};

export const updateMember = async (req, res) => {
  try {
    await queries.updateMember(req.params.id, req.body);
    res.redirect(`/members/${req.params.id}`);
  } catch (error) {
    console.error("Error updating member:", error);
    const member = await queries.getMemberById(req.params.id);
    res.render("members/edit", {
      member,
      error: "Failed to update member",
    });
  }
};

export const deleteMember = async (req, res) => {
  try {
    await queries.deleteMember(req.params.id);
    res.redirect("/members");
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).render("error", {
      error: "Failed to delete member. They may have active transactions.",
    });
  }
};

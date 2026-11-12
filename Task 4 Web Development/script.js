
"use strict";

// =====================================
// HELPER: LOCAL STORAGE
// =====================================

function loadData(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    alert("Data save nahi ho paya. Browser storage check karo.");
    return false;
  }
}

// =====================================
// 1. TASK MANAGER
// =====================================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskSearch = document.getElementById("taskSearch");
const taskFilter = document.getElementById("taskFilter");
const taskList = document.getElementById("taskList");

let tasks = loadData("harshTasks");

function renderTasks() {
  const search = taskSearch.value.trim().toLowerCase();
  const filter = taskFilter.value;

  const filtered = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(search);
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);

    return matchesSearch && matchesFilter;
  });

  taskList.replaceChildren();

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = tasks.length === 0
      ? "Abhi koi task nahi hai. Apna pehla task add karo!"
      : "Koi matching task nahi mila.";
    taskList.appendChild(empty);
  }

  filtered.forEach(task => {
    const item = document.createElement("div");
    item.className = `task-item${task.completed ? " done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task complete");

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      if (saveData("harshTasks", tasks)) renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const edit = document.createElement("button");
    edit.className = "small-btn";
    edit.textContent = "Edit";

    edit.addEventListener("click", () => {
      const updated = prompt("Edit your task:", task.text);
      if (updated === null) return;

      if (!updated.trim()) {
        alert("Task khali nahi ho sakta.");
        return;
      }

      task.text = updated.trim();
      if (saveData("harshTasks", tasks)) renderTasks();
    });

    const remove = document.createElement("button");
    remove.className = "small-btn delete-btn";
    remove.textContent = "Delete";

    remove.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      if (saveData("harshTasks", tasks)) renderTasks();
    });

    actions.append(edit, remove);
    item.append(checkbox, text, actions);
    taskList.appendChild(item);
  });

  document.getElementById("totalTasks").textContent = tasks.length;
  document.getElementById("completedTasks").textContent =
    tasks.filter(task => task.completed).length;
  document.getElementById("activeTasks").textContent =
    tasks.filter(task => !task.completed).length;
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({
    id: Date.now() + Math.random(),
    text,
    completed: false
  });

  if (saveData("harshTasks", tasks)) {
    taskInput.value = "";
    renderTasks();
    taskInput.focus();
  }
});

taskSearch.addEventListener("input", renderTasks);
taskFilter.addEventListener("change", renderTasks);
renderTasks();

// =====================================
// 2. NOTES APP
// =====================================

const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteBody = document.getElementById("noteBody");
const notesList = document.getElementById("notesList");

let notes = loadData("harshNotes");

function renderNotes() {
  notesList.replaceChildren();

  if (notes.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Your saved notes will appear here.";
    notesList.appendChild(empty);
    return;
  }

  notes.forEach(note => {
    const card = document.createElement("article");
    card.className = "note-card";

    const title = document.createElement("h3");
    title.textContent = note.title;

    const body = document.createElement("p");
    body.textContent = note.body;

    const remove = document.createElement("button");
    remove.className = "small-btn delete-btn";
    remove.textContent = "Delete Note";

    remove.addEventListener("click", () => {
      notes = notes.filter(item => item.id !== note.id);
      if (saveData("harshNotes", notes)) renderNotes();
    });

    card.append(title, body, remove);
    notesList.appendChild(card);
  });
}

noteForm.addEventListener("submit", event => {
  event.preventDefault();

  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();

  if (!title || !body) return;

  notes.unshift({
    id: Date.now() + Math.random(),
    title,
    body
  });

  if (saveData("harshNotes", notes)) {
    noteForm.reset();
    renderNotes();
  }
});

renderNotes();

// =====================================
// 3. PRODUCTS WITH REAL IMAGE URLS
// =====================================

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "electronics",
    price: 2499,
    rating: 4.8,
    emoji: "🎧",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    description: "Enjoy your favourite music."
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "electronics",
    price: 1899,
    rating: 4.5,
    emoji: "⌚",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    description: "A smart everyday companion."
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    category: "electronics",
    price: 799,
    rating: 4.3,
    emoji: "🔊",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
    description: "Portable sound for your day."
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    category: "accessories",
    price: 3299,
    rating: 4.9,
    emoji: "⌨️",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    description: "A comfortable typing experience."
  },
  {
    id: 5,
    name: "Wireless Mouse",
    category: "accessories",
    price: 499,
    rating: 4.2,
    emoji: "🖱️",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80",
    description: "Simple and smooth navigation."
  },
  {
    id: 6,
    name: "Classic Backpack",
    category: "fashion",
    price: 999,
    rating: 4.4,
    emoji: "🎒",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    description: "Carry your everyday essentials."
  },
  {
    id: 7,
    name: "Sports Shoes",
    category: "fashion",
    price: 1799,
    rating: 4.6,
    emoji: "👟",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    description: "Comfort for everyday movement."
  },
  {
    id: 8,
    name: "Desk Lamp",
    category: "accessories",
    price: 399,
    rating: 4.1,
    emoji: "💡",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    description: "A little light for your workspace."
  },
  {
    id: 9,
    name: "USB-C Hub",
    category: "accessories",
    price: 1299,
    rating: 4.7,
    emoji: "🔌",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=600&q=80",
    description: "Connect more of your devices."
  }
];

const productSearch = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const sortProducts = document.getElementById("sortProducts");
const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");

function renderProducts() {
  const search = productSearch.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const price = priceFilter.value;
  const sort = sortProducts.value;

  let result = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    const matchesCategory =
      category === "all" || product.category === category;

    let matchesPrice = true;

    if (price === "under500") {
      matchesPrice = product.price < 500;
    } else if (price === "500to2000") {
      matchesPrice = product.price >= 500 && product.price <= 2000;
    } else if (price === "over2000") {
      matchesPrice = product.price > 2000;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (sort === "price-low") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === "rating-high") {
    result.sort((a, b) => b.rating - a.rating);
  }

  productGrid.replaceChildren();

  productCount.textContent =
    `Showing ${result.length} of ${products.length} products`;

  if (result.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No products found. Try changing your filters.";
    productGrid.appendChild(empty);
    return;
  }

  result.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const visual = document.createElement("div");
    visual.className = "product-visual";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    image.decoding = "async";

    // Image load na ho to emoji fallback
    image.addEventListener("error", () => {
      const fallback = document.createElement("span");
      fallback.className = "image-fallback";
      fallback.textContent = product.emoji;
      fallback.setAttribute("aria-label", product.name);
      visual.replaceChildren(fallback);
    }, { once: true });

    visual.appendChild(image);

    const details = document.createElement("div");
    details.className = "product-details";

    const categoryLabel = document.createElement("span");
    categoryLabel.className = "product-category";
    categoryLabel.textContent = product.category;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const priceLabel = document.createElement("span");
    priceLabel.className = "product-price";
    priceLabel.textContent =
      `₹${product.price.toLocaleString("en-IN")}`;

    const rating = document.createElement("span");
    rating.className = "product-rating";
    rating.textContent = `★ ${product.rating.toFixed(1)}`;

    bottom.append(priceLabel, rating);
    details.append(categoryLabel, title, description, bottom);
    card.append(visual, details);
    productGrid.appendChild(card);
  });
}

productSearch.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
priceFilter.addEventListener("change", renderProducts);
sortProducts.addEventListener("change", renderProducts);

renderProducts();

// =====================================
// 4. CONTACT FORM
// =====================================

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !email || !message) return;

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );

  window.location.href =
    `mailto:harshkumar041120049@gmail.com?subject=${subject}&body=${body}`;
});



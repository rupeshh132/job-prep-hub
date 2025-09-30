// ------------------------
// Show Register / Login Toggle
// ------------------------
function showLogin() {
  document.getElementById("registerSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
}
function showRegister() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("registerSection").style.display = "block";
}

// ------------------------
// Show Section
// ------------------------
function showSection(section) {
  // Hide all
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("resourcesSection").style.display = "none";
  document.getElementById("profileSection").style.display = "none";

  // Show chosen
  if (section === "home") document.getElementById("homeSection").style.display = "block";
  if (section === "resources") {
    document.getElementById("resourcesSection").style.display = "block";
    loadResources();
  }
  if (section === "profile") {
    document.getElementById("profileSection").style.display = "block";
    document.getElementById("profileInfo").innerText = "Logged in as: " + localStorage.getItem("username");
  }
}

// ------------------------
// Register
// ------------------------
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  const res = await fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  alert(data.message);

  if (data.message.includes("successfully")) {
    showLogin();
  }
});

// ------------------------
// Login
// ------------------------
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.token) {
    // Save token locally
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);

    // Hide forms
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("registerSection").style.display = "none";

    // Show navbar + home
    document.getElementById("navbar").style.display = "block";
    showWelcome(data.username);
    showSection("home");
  } else {
    alert(data.message);
  }
});

// ------------------------
// Show Welcome Message
// ------------------------
function showWelcome(username) {
  const welcomeDiv = document.getElementById("welcomeMessage");
  welcomeDiv.style.display = "block";
  welcomeDiv.innerText = `Welcome ${username} ✅`;
}

// ------------------------
// Load Resources
// ------------------------
async function loadResources() {
  const res = await fetch("http://localhost:5000/api/resources");
  const data = await res.json();

  const list = document.getElementById("resourcesList");
  list.innerHTML = "";

  data.forEach(r => {
    const li = document.createElement("li");
    li.innerHTML = `📘 <a href="${r.link}" target="_blank">${r.title}</a>`;
    list.appendChild(li);
  });
}

// ------------------------
// Logout
// ------------------------
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");

  // Hide sections + navbar
  document.getElementById("navbar").style.display = "none";
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("resourcesSection").style.display = "none";
  document.getElementById("profileSection").style.display = "none";

  // Show register form again
  showRegister();
}

// ------------------------
// Auto-Login (when refresh)
// ------------------------
window.onload = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (token && username) {
    document.getElementById("registerSection").style.display = "none";
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("navbar").style.display = "block";

    showWelcome(username);
    showSection("home");
  }
};

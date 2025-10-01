// ------------------------
// Toggle Register / Login
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

  if (data.message.includes("successfully")) showLogin();
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
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);

    document.getElementById("registerSection").style.display = "none";
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    document.getElementById("welcomeMessage").innerText = `Welcome ${data.username} 🚀`;
    loadResources();
  } else {
    alert(data.message);
  }
});

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

  document.getElementById("dashboard").style.display = "none";
  showRegister();
}

// ------------------------
// Auto-login on refresh
// ------------------------
window.onload = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (token && username) {
    document.getElementById("registerSection").style.display = "none";
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    document.getElementById("welcomeMessage").innerText = `Welcome ${username} 🚀`;
    loadResources();
  }
};

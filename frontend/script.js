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
    // Register complete → show login form
    document.getElementById("registerSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
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

    // Hide login form & show welcome
    document.getElementById("loginSection").style.display = "none";
    showWelcome(data.username);

    // Show logout button
    document.getElementById("logoutSection").style.display = "block";
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
// Logout
// ------------------------
function logout() {
  // Clear local storage
  localStorage.removeItem("token");
  localStorage.removeItem("username");

  // Hide welcome & logout
  document.getElementById("welcomeMessage").innerText = "";
  document.getElementById("welcomeMessage").style.display = "none";
  document.getElementById("logoutSection").style.display = "none";

  // Show forms again
  document.getElementById("registerSection").style.display = "block";
  document.getElementById("loginSection").style.display = "none";
}

if (getCookieValue("token")){
  alert("Logout from current user required befor loggin in.");
  window.location.href = "/index";
}

const loginForm = document.getElementById("login-form");
var serverUrl = "http://localhost:3000";
loginForm.addEventListener("submit", async (event) => {
  // Show the loading icon
  var loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style.display = "block";

  event.preventDefault();

  const username = loginForm.username.value;
  const password = loginForm.password.value;

  const exists = await checkUsername(username);

  if (!exists) {
    alert("Username does not exist. Please sign up first.");
    window.location.href = "/signup";
    return;
  }

  const salt = await getSalt(username);
  const hashedPassword = hashPassword(password, salt);
  const match = await checkPassword(username, hashedPassword);

  if (match) {
    let token = getCookieValue("token");
    if (token == null || token == "") {
      token = await newToken();
    }
    // Store the token in cookies
    document.cookie = `token=${token}; path=/`;
    window.location.href = "/index";
  } else {
    // Hide the loading icon
    loadingIcon.style.display = "none";
    alert("Incorrect password. Please try again.");
    document.getElementById("password").value = "";
  }
});

async function checkUsername(username) {
  const response = await fetch(serverUrl + "/molecule/signup/check-username", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  const data = await response.json();
  return data.exists;
}
function getCookieValue(cookieName) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0] === cookieName) {
      return cookie[1];
    }
  }
  return null;
}
async function getSalt(username) {
  const response = await fetch(serverUrl + "/molecule/login/get-salt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  const data = await response.json();
  return data.salt;
}

function hashPassword(password, salt) {
  const hashedPassword = CryptoJS.SHA256(password + salt).toString();
  return hashedPassword;
}

async function checkPassword(username, hashedPassword) {
  const response = await fetch(serverUrl + "/molecule/login/check-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, hashedPassword }),
  });
  const data = await response.json();
  return data;
}

async function newToken() {
  const user = username.value;
  const response = await fetch(serverUrl + "/molecule/api/new-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user }),
  });
  const data = await response.json();
  return data.token;
}

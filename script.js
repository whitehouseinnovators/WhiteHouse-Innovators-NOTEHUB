// --- Register new user ---
async function register() {
  const user = {
    name: document.getElementById("regName").value.trim(),
    email: document.getElementById("regEmail").value.trim(),
    password: document.getElementById("regPassword").value.trim(),
    course: document.getElementById("regCourse").value,
    semester: document.getElementById("regSemester").value
  };

  if (!user.name || !user.email || !user.password || !user.course || !user.semester) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    const msg = await res.text();
    alert(msg);

    if (res.ok) {
      toggleForms(); // switch to login after registration
    }
  } catch (err) {
    alert("Registration failed. Please try again.");
    console.error(err);
  }
}

// --- Login existing user ---
async function login() {
  const creds = {
    email: document.getElementById("loginEmail").value.trim(),
    password: document.getElementById("loginPassword").value.trim()
  };

  if (!creds.email || !creds.password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds)
    });

    if (res.ok) {
      const user = await res.json();

      // ✅ Store user info in localStorage for next page
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      // Optional: small delay for UX
      setTimeout(() => {
        window.location.href = "select_course.html"; // redirect
      }, 100);

    } else {
      const errorMsg = await res.text();
      alert(errorMsg);
    }
  } catch (err) {
    alert("Login failed. Please try again.");
    console.error(err);
  }
}

// --- Toggle between login and register forms ---
function toggleForms() {
  document.querySelector(".form-card").classList.toggle("hidden");
  document.getElementById("registerForm").classList.toggle("hidden");
}

const signupForm = document.getElementById("signup-form");
const otpForm = document.getElementById("otp-form");
const loginForm = document.querySelector('.login-form');
const otpFormContainer = document.getElementById("otp-form-container");
const cancelBtn = document.getElementById("cancel-btn");
const otpEmail = document.getElementById("otp-email");

// Handle signup form submission
signupForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname, email, password }),
    });

    const text = await response.text();


    if (response.ok) {
        otpEmail.value = email;
        signupForm.style.display = "none";
        otpFormContainer.style.display = "block";
    } else {
        alert("Registration failed: " + text);
    }
});

loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    });

    const text = await response.text();

    if (response.ok) {
        window.location.href = '/';
    } else {
        alert('Login failed: ' + text);
    }
})

otpForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const response = await fetch('/account-activation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    });

    const text = await response.text();

    if (response.ok) {
        window.location.href = '/login.html';
    } else {
        alert('OTP authentication failed: ' + text);
    }
})

// Handle cancel button click in OTP form
cancelBtn?.addEventListener("click", () => {
    otpFormContainer.style.display = "none";
    signupForm.style.display = "block";
});
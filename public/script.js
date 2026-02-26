async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password })
    });

    const data = await res.json();
    document.getElementById("message").innerText = data.message;

    if (res.ok) {
        document.getElementById("message").style.color = "green";
    } else {
        document.getElementById("message").style.color = "red";
    }
}

async function verifyOtp() {

    const email = document.getElementById("email").value;
    const otp = document.getElementById("otp").value;

    const res = await fetch("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp: otp })
    });

    const data = await res.json();
    document.getElementById("message").innerText = data.message;

    if (res.ok) {
        document.getElementById("message").style.color = "green";
        alert("Login Successful 🎉");
    } else {
        document.getElementById("message").style.color = "red";
    }
}
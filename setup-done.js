// SETUP
// user tries to access setup page explicitly but he already completed, redirect him to login
if (JSON.parse(localStorage.getItem("setup")) === "completed") {
	window.location.href = "login.html"
}
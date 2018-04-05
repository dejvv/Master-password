// LOGIN
// loads either setup.index or login.index
// depends if there is something in local storage or not

// if master password does not exists, 
// user should setup one
if (localStorage.getItem("master-password") === null) {
	window.location.href = "setup.html"
}
// MAIN
// if user tried to access main.html without log in redirect him
if (JSON.parse(localStorage.getItem("validation")) !== "passed") {
	window.location.href = "login.html"
}

window.onbeforeunload = function (e) {
  // Check browser support
    if (typeof(Storage) !== "undefined") {
        // Store
        const store = JSON.stringify("notpassed");
        localStorage.setItem("validation", store);
        console.log("[local storage] Storing to local storage,", name);
    } else {
    	return false;
    }
    return true;
};
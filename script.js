// disable button
try{
	document.getElementById("login-button").disabled = true; 
} catch (err) {
	console.log(err.message);
}

// Login input, do something on new input
$('#login-input').on('input',function(e){
	// if input is empty, make button unclickable
	if($(this).val() === ""){
		$("#login-button").removeClass("active");
		document.getElementById("login-button").disabled = true; 
		console.log("empty")
		return
	}
	// if value has changed, make button clickable(active class)
	if($(this).data("lastval")!= $(this).val()){
	     $(this).data("lastval",$(this).val());
	     $("#login-button").addClass("active");
	     document.getElementById("login-button").disabled = false; 
	};
});

// LOGIN
// when link for password setup is clicked, ask user to type old password
$('#setup-password').on('click',function(e){
	let password = prompt("To continue type your current password");
	if (password === getFromLocal("master-password")){
		// password is ok, so let's reset setup in local storage and let user do it again
		storeToLocal("notcompleted", "setup");
	} else {
		alert("Incorrect password")
	}
});

// LOGIN
// get password from local storage
function comparePassword() {
	try {
		// password entered by user
		let password = $("#login-input").val()
		console.log("[login] password entered:",$("#login-input").val());
		// password stored in local storage
		let correct = getFromLocal("master-password");
		console.log(correct,password)
		if (password !== correct){
			document.getElementById("error").innerHTML = "Error: Incorrect password";
			return false;
		}
		// passwords matching
		// prevent access directly to main.html
		storeToLocal("passed", "validation");
		window.location.href = "main.html"
	} catch (err) {
		document.getElementById("error").innerHTML = err.message;
		return false;
	}
}

// SETUP
// set password - save it to local storage
function setPassword() {
	try {
		let password = $("#login-input").val()
		storeToLocal(password, "master-password")
		console.log("[setup] password set");
	} catch (err) {
		document.getElementById("error").innerHTML = err.message;
		return false;
	}
	storeToLocal("completed", "setup");
	alert("Setup successful! You will be redirected to login page")
	window.location.href = "login.html"
}


// MAIN
// save user data for new password to local storage
function addPassword() {
	document.getElementById("error").innerHTML = "";
	document.getElementById("win").innerHTML = "";
	let all_passwords = {};
	try {
		let identifier = $("#add-pw-name").val()
		let password = $("#add-pw-password").val()
		resetValue("add-pw-name");
		resetValue("add-pw-password");
		// get dictionary of existing passwords
		all_passwords = getFromLocal("all_passwords");
		if(isEmpty(all_passwords) === false){
			console.log(all_passwords, "is not empty")
			if(checkDouble(all_passwords, identifier) !== undefined){
				document.getElementById("error").innerHTML = "You already have password with that name";
				return false
			}
		} else {
			all_passwords = {};
		}
		all_passwords[identifier] = password;
		storeToLocal(all_passwords, "all_passwords");
		console.log("[main] add identifier-password successful");
		console.log("[",identifier,"]", password, "stored")
		document.getElementById("win").innerHTML = "Password successfuly stored!";
		// recreate table
		resetTable();
		loadsTable();
	} catch (err) {
		document.getElementById("error").innerHTML = err.message;
		return false;
	}
}

// checks if data is already in dictionary
function checkDouble(dictionary, data){
	return dictionary[data];
}

// checks if array is empty
function isEmpty(array){
	for(let item in array)
		return false;
	return true;
}

function resetValue(object) {
	document.getElementById(object).value = "";
}


// MAIN
// loads all stored passwords
function loadsAll(){
	// item does not exists, so that means user haven't stored any passwords yet
	if (localStorage.getItem("all_passwords") === null) {
		document.getElementById("test").innerHTML = "No passwords stored"
		return false;
	}
	document.getElementById("test").innerHTML = "there is something"
	$('#test').remove();
	loadsTable();
}

function removePassword(event) {
    const tr = event.target;
    
	let remove_text = $(tr).text();
	console.log(remove_text);
    console.log(event.target.parentElement)
    if(confirm("Do you want to delete this password?")){
        const table = tr.parentElement;
        all_passwords = getFromLocal("all_passwords")
        // simulate remove and store back
        all_passwords[remove_text] = undefined;
        storeToLocal(all_passwords, "all_passwords")
        //all_passwords
        table.remove(tr);
    }
}

function display(){
	resetOnePasswordTable();
	displayPassword();
}

function displayPassword(event) {
	const tr1 = event.target;
    
	let remove_text = $(tr1).text();
	all_passwords = getFromLocal("all_passwords")
    let display = all_passwords[remove_text];
    const table = document.getElementById("one-password-table");

    let tr = document.createElement("tr");
	table.appendChild(tr);
	let td = document.createElement("td");
	td.innerText = remove_text;
	tr.appendChild(td);
	td = document.createElement("td");
	td.innerText = display;
	tr.appendChild(td);
}

function loadsTable() {
	let all_passwords = getFromLocal("all_passwords");
	console.log(all_passwords);

    const table = document.getElementById("passwords-table");
    

    keys = Object.keys(all_passwords);
    // go through keys, which are names of passwords
    for (name in keys) {
    	console.log(keys[name]);
    	let tr = document.createElement("tr");
    	tr.ondblclick = removePassword;
    	tr.onclick = display
    	table.appendChild(tr);
    	let td = document.createElement("td");
    	td.class = "heheh"
    	td.innerText = keys[name];
    	tr.appendChild(td);
    }
}

// finds index of item with @name in dictionary
function findIndex(name) {
	all_passwords = getFromLocal("all_passwords")
	let i = 0;
	for (a in Object.keys(all_passwords)){
		if (all_passwords[a] === name)
			return i;
		i++;
	}
	return false;
}

// removes all elements, but first
function resetTable(){
	$('#passwords-table tr').slice(1).remove();
}

function resetOnePasswordTable(){
	$('#one-password-table tr').slice(1).remove();
}

// function stores to local storage
// @object  list, string to be stored
// @name    name of object in local storage
// @returns true if successful, false otherwise
function storeToLocal(object, name){
    // Check browser support
    if (typeof(Storage) !== "undefined") {
        // Store
        const store = JSON.stringify(object);
        localStorage.setItem(name, store);
        console.log("[local storage] Storing to local storage,", name);
    } else {
    	document.getElementById("error").innerHTML = "Error: Your browser does not support local storage, try different browser";
    	return false;
    }
    return true;
}

// returns object value from local storage
// @name    name of object in local storage
// @returns false if problem occur, object otherwise
function getFromLocal(name){
	let object = null;
    // Check browser support
    if (typeof(Storage) !== "undefined") {
        object = JSON.parse(localStorage.getItem(name));
        console.log("[local storage] Retriving from local storage,", object);
    } else {
        document.getElementById("error").innerHTML = "Error: Your browser does not support local storage, try different browser";
        return false;
    }
    return object;
}



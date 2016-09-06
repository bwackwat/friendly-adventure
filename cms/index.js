
window.onload = function() {

var localStorageLoginUsernameKey = "USERNAME_KEY";
var localStorageLoginTokenKey = "TOKEN_KEY";
var apiUrl = "https://" + window.location.hostname + "/api";

var status = document.getElementById("status");

var username = document.getElementById("usernameField");
var password = document.getElementById("passwordField");
var email = document.getElementById("emailField");
var firstName = document.getElementById("firstNameField");
var lastName = document.getElementById("lastNameField");

var loginButton = document.getElementById("loginButton");
var registerButton = document.getElementById("registerButton");
var logoutButton = document.getElementById("logoutButton");

function callAPI(route, data, callback){
	var sendData = JSON.stringify(data);

	var http = new XMLHttpRequest();
	http.open("POST", apiUrl + route, true);
	http.setRequestHeader("Content-type", "application/json");
	http.onreadystatechange = function(){
		if(http.responseText === ""){
			//Bloody OPTIONS pre-flight...
			//return;
		}
		console.log("RECV: " + http.responseText);
		if(http.readyState == 4){
			if(http.status == 200){
				callback(JSON.parse(http.responseText));
			}else{
				callback({"error":"Bad response from server."})
			}
		}else if(http.readyState == 3){
			//Bogus OPTIONS response...
			
			//0: request not initialized
			//1: server connection established
			//2: request received
			//3: processing request
			//4: request finished and response is ready
		}else if(http.readyState == 2){
			callback({"error":"Could not receive data."})
		}else if(http.readyState == 1){
			callback({"error":"Could not establish connection."})
		}else if(http.readyState == 0){
			callback({"error":"Did not start connection."})
		}else{
			//Invalid API usage...
			alert("HTTP ERROR!");
		}
	};
	http.send(sendData);
}

function checkLogin(){
	if(localStorage.getItem(localStorageLoginTokenKey) === null){
		status.innerHTML = "Not logged in.";
	
		logoutButton.style.display = "none";
	}else{
		status.innerHTML = "Logged in as " + localStorage.getItem(localStorageLoginUsernameKey);

		logoutButton.style.display = "inline";
	}
}

if(loginButton !== null && loginButton !== "undefined"){
	loginButton.onclick = function() {
		callAPI("/login", {"username": username.value, "password": password.value}, function(response){
			if(typeof(response.error) === 'undefined'){
				localStorage.setItem(localStorageLoginUsernameKey, username.value);
				localStorage.setItem(localStorageLoginTokenKey, response.result.token);
			}else{
				status.innerHTML = response.error;
			}
		});
	};
}

if(registerButton !== null && registerButton !== "undefined"){
	registerButton.onclick = function() {
		callAPI("/register", {"username": username.value, "password": password.value, "email": email.value, "first_name": firstName.value, "last_name": lastName.value}, function(response){
			if(typeof(response.error) === 'undefined'){
				username.value = "";
				password.value = "";
				email.value = "";
				firstName.value = "";
				lastName.value = "";
				status.innerHTML = "You signed up successfully!";
			}else{
				status.innerHTML = response.error;
			}
		});
	};
}

if(logoutButton !== null && logoutButton !== "undefined"){
	logoutButton.onclick = function() {
		localStorage.removeItem(localStorageLoginTokenKey);
		window.reload();
	};
}

checkLogin();

}



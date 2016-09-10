window.onload = function() {

var apiUrl = "https://" + window.location.hostname + "/api";

var content = document.getElementById("content");

function callAPI(route, data, callback){
	var sendData = JSON.stringify(data);

	var http = new XMLHttpRequest();
	http.open("POST", apiUrl + route, true);
	http.setRequestHeader("Content-type", "application/json");
	http.onreadystatechange = function(){
		if(http.responseText === ""){
			//Bloody OPTIONS pre-flight...
			return;
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

if(content !== null && content !== "undefined"){
	callAPI("/blog", {"username": "bwackwat"}, function(response){
		if(typeof(response.error) === 'undefined'){
			var newhtml = "<div id='posts'>";
			for(var i = 0, len = response.result.length; i < len; i++){
				newhtml += "<div id='post'><div id='posttitle'>" + response.result[i].title;
				newhtml += "</div><div id='postdate'>" + response.result[i].created_on;
				newhtml += "</div><br><div id='posttext'>" + response.result[i].content;
				newhtml += "</div></div><hr>";
			}
			newhtml += "</div>";
			content.innerHTML = newhtml;
		}else{
			content.innerHTML = response.error;
		}
	});
}

}

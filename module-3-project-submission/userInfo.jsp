<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>

<style>

p{
margin: 0;
}

.label{
font-weight: 600;
margin-right: 4px;
}
.info-div{

display: inline-flex;
width: 100%;
margin: 8px 0;
}
</style>

</head>
<body>

<h2>User Information</h2>
<div style="margin-bottom: 12px;">
	<img id="id-profile" width="240px" height="240px" alt="profile picture!"/>
	<i>Saved successfully <b><%= request.getAttribute("fileName") %></b> </i>	
</div>
<div class="info-div"><p class="label">Name: </p> <p id="id-name"><%= request.getAttribute("name")%></p></div>
<div class="info-div"><p class="label">Email: </p> <p id="id-email"> <%= request.getAttribute("email") %> </p></div>
<div class="info-div"><p class="label">Location: </p> <p id="id-location"> <%= request.getAttribute("location") %> </p></div>
<div class="info-div"><p class="label">Gender: </p> <p id="id-gender"><%= request.getAttribute("gender") %></p></div>
<div class="info-div"><p class="label">Experience: </p> <p id="id-experience"> <%= request.getAttribute("experience") %></p></div>

<p>If you don't see your image. Please click button below to load page again.</p>
<button id="refresh">Refresh image</button>
<a href="/CSC7510Mod3/html/index.html">Register new user</a>
</body>

<script>

const file = '/CSC7510Mod3<%=request.getAttribute("fileNamePath")%>'
console.log("image: ", file);
const element = document.getElementById("id-profile");
if(element != null){
	element.src = file;
};

const btn = document.getElementById("refresh");
if(btn != null){

	btn.addEventListener("click", function(){
		window.location.reload();
	});
}
</script>
</html>
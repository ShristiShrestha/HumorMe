<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<h5>Missing or Invalid information</h5>
<div>Name: <p id="id-name"><%= request.getAttribute("name")%></p></div>
<div>Email: <p id="id-email"> <%= request.getAttribute("email") %> </p></div>
<div>Location: <p id="id-location"> <%= request.getAttribute("location") %> </p></div>
<div>Gender: <p id="id-gender"><%= request.getAttribute("gender") %></p></div>
<div>Experience: <p id="id-experience"> <%= request.getAttribute("experience") %></p></div>
<div>Filename: <p id="id-fileName"><%= request.getAttribute("fileName") %></p></div>
<div>File uploaded: <p id="id-file"><%= request.getAttribute("file") %></p></div>
<a href="/CSC7510Mod3/html/index.html">Try again</a>
</body>
</html>
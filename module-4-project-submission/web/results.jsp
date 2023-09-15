<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<h1>Search results</h1>
    <ul>
        <c:forEach var="user" items="${users}">
            <li>
            	<div>
            	  <p>Name: ${user.name}</p>
            	  <p>Email: ${user.email}</p>
            	  <p>Gender: ${user.gender}</p>
            	  <p>Location: ${user.location}</p>
            	  <p>Experience: ${user.experience}</p>
            	</div>
            	<br/>
            </li>
        </c:forEach>
    </ul>
    
    <a href="/CSC7510Mod4/html/index.html">Back to home</a>
    
    <script>
    	console.log(<%= request.getAttribute("errorMsg") %>);
    </script>
</body>
</html>
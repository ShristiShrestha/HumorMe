import java.io.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.AsyncContext;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

/**
 * Servlet implementation class UserRegistrationServlet
 */
@WebServlet(value="/register")
@MultipartConfig
public class UserRegistrationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private MySqlDb db;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserRegistrationServlet() {
        super();
        this.db = new MySqlDb("cloud");
        db.connect();
        
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String location = request.getParameter("location");
        String gender = request.getParameter("gender");
        String experience = request.getParameter("experience");
        
        System.out.println(name + email + location+ gender+ experience);
        
         boolean validStrInput = true;
    	 HashMap<String, String> hashMap = new HashMap<String, String>();
    	 HashMap<String, String> resHashMap = new HashMap<String, String>();

         if(!validateNonEmpty(name)) {
        	 validStrInput = false;
        	 hashMap.put("name", name);
         }else {
        	 resHashMap.put("name", name);
         }
         if(!validateEmail(email)) {
        	 validStrInput = false;
        	 hashMap.put("email", "Invalid email provided: " + email);
         }else {
        	 resHashMap.put("email", email);
         }
         if(!validateNonEmpty(location)) {
        	 validStrInput = false;
        	 hashMap.put("location", "Invalid location provided: " +  location);
         }else {
        	 resHashMap.put("location", location);
         }
         if(!validateNonEmpty(gender)) {
        	 validStrInput = false;
        	 hashMap.put("gender", "Invalid gender provided: " +  gender);
         }else {
        	 resHashMap.put("gender", gender);
         }
         if(!validateNonEmpty(experience)) {
        	 validStrInput = false;
        	 hashMap.put("experience", "Invalid experience provided: " +  experience);
         }else {
        	 resHashMap.put("experience", experience);
         }
         
         // if user request fields are invalid
         // display error message
         if(!validStrInput) {
        	 RequestDispatcher dispatcher = request.getRequestDispatcher("/html/error.jsp");
        	 Iterator< Map.Entry<String, String>> mapIterator = hashMap.entrySet().iterator();
        	 while(mapIterator.hasNext()) {
        		 Map.Entry<String, String> entry = (Map.Entry<String, String>) mapIterator.next();
        		 System.out.println("Error response: " + entry.getKey() + " : " + entry.getValue());
        		 request.setAttribute(entry.getKey(), entry.getValue());
        	 }
        	 request.setAttribute("labels", String.join(",", hashMap.keySet()));
        	 dispatcher.forward(request, response);
        	 return;
         }
         
         // else, user request is valid, create a user
         // and save user to database
         User user = new User(name, email, location, gender, experience);
         boolean userAdded = db.insert(user);
         
         // if user is added, show user info in a page
         if(userAdded) {
              RequestDispatcher dispatcher = request.getRequestDispatcher("/html/userInfo.jsp");
         	 Iterator< Map.Entry<String, String>> mapIterator = resHashMap.entrySet().iterator();
         	 while(mapIterator.hasNext()) {
         		 Map.Entry<String, String> entry = (Map.Entry<String, String>) mapIterator.next();
         		 System.out.println("Userinfo response: " + entry.getKey() + " : " + entry.getValue());
         		 request.setAttribute(entry.getKey(), entry.getValue());
         	 }
         	 request.setAttribute("labels", String.join(",", resHashMap.keySet()));
         	 dispatcher.forward(request, response);
         }
      
         // if user is not added, ask them to try again.
         else {
        	 RequestDispatcher dispatcher = request.getRequestDispatcher("/html/error.jsp");
        	 request.setAttribute("errorMsg", "Failed to save your details. Please try again.");
        	 dispatcher.forward(request, response);
         }
 
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }
    
    private boolean validateNonEmpty(String value) {
    	if(value == null) {
    		return false;
    	}
    	
    	return value.length() > 0;
    }
    
    private boolean validateEmail(String email) {
    	if(validateNonEmpty(email)) {
    		return email.contains("@");
    	}
    	return false;
    }
   
}
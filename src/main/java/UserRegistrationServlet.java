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
@WebServlet(value="/register", asyncSupported = true)
@MultipartConfig
public class UserRegistrationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserRegistrationServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub

        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String location = request.getParameter("location");
        String gender = request.getParameter("gender");
        String experience = request.getParameter("experience");
        String fileName = request.getParameter("fileName");
        

        /*
         * Write your code here
         * Step 1: check whether the client's inputs are complete or not; if anything is missing, 
         * return a web page that contains a link to go back to the registration page (e.g., UserRegistration.html)*/
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
         if(!validateFileName(fileName)) {
        	 validStrInput = false;
        	 hashMap.put("fileName", "Invalid filename provided: " +  fileName);
         }
         
         
         /*
         * Step 2: save the uploaded picture under your project WebContent directory, for example, mine is "F:\workspace\UserRegistrationProject\WebContent".
         * 
         */
         
         // request.getPart is to get the uploaded file handler.
          // You can use filePart.getInputStream() to read the streaming data from client, for example:
          // InputStream fileContent = filePart.getInputStream();
          
         Part filePart = request.getPart("file");
         InputStream fileContent = filePart.getInputStream();
         int fileSize = (int) filePart.getSize();
         
         if(fileSize < 1) {
        	 validStrInput = false;
        	 hashMap.put("file", "Invalid file uploaded: " +  fileName);;
         }
         
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
         }
         
         String outputFilepath = getServletContext().getRealPath("/html/uploads/" + fileName);
         File outputFile = new File(outputFilepath);
         try {
        	 OutputStream fileOut = new FileOutputStream(outputFile);
        	 
             // Read the contents from the InputStream and write them to the OutputStream
            
             final byte[] bytes = new byte[1024];
             
             int read;
        	 while ((read = fileContent.read(bytes)) != -1) {
                 fileOut.write(bytes, 0, read);
                 
             }
        	
        	 fileOut.flush();
       	
        	 // Close streams
             fileContent.close();
             fileOut.close();
             
            
         }catch(Exception err) {
        	 System.out.println("File save error: " + err.getLocalizedMessage());
        	 err.printStackTrace();
         }
         
         System.out.println("outputFilePath: " + outputFile.getAbsolutePath());
         System.out.println("outputFile exists: " + outputFile.exists());        
         resHashMap.put("fileNamePath" , "/html/uploads/" + fileName);
         resHashMap.put("fileName" , fileName);


         /*
         * Step 3: send back the client's registration information to the client, remember, 
         * the client should be able to see all the information, including the profile picture.
         * */
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

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub
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
    
    private boolean validateFileName(String filename) {
    	if(validateNonEmpty(filename)) {
    		return filename.contains(".");
    	}
    	return false;
    }

}
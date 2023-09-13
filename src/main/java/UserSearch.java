import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

@WebServlet(value="/search", asyncSupported = true)
public class UserSearch {
	private static final long serialVersionUID = 2L;
	private MySqlDb db;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserSearch() {
        super();      
        this.db = new MySqlDb("cloud");
        db.connect();
    }
    
    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	 String query = request.getParameter("query");
    	 ArrayList<User> users = db.select(query);
    	 RequestDispatcher dispatcher = request.getRequestDispatcher("/html/results.jsp");
    	 request.setAttribute("users", users);
    	 dispatcher.forward(request, response);
    }
    
    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

}

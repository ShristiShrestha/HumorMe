import java.sql.*;
import java.util.ArrayList;

public class MySqlDb {
	private String database;
	private String user;
	private String password;
	private String connectUrl;
	private Connection conn;
	
	
	MySqlDb(String database){
		this.database = database;
		this.user = "root";
		this.password = "password";
		this.connectUrl = "jdbc:mysql://localhost:3306/" + this.database;
	}
	
	public boolean connect() {
		try {
			Class.forName("com.mysql.jdbc.Driver");
			this.conn = DriverManager.getConnection(connectUrl, this.user, this.password);
			System.out.println("Connected to db: " + this.database);
			return true;
		}
		catch(Exception err) {
			System.out.println("[CONNECT]" +  err.getLocalizedMessage());
			err.printStackTrace();
		}
		return false;
	}
	
	public boolean insert(User user) {
		try {
			if(this.conn == null) {
				this.connect();
			}
			if(this.conn != null) {
				String sql = "insert into users values(?, ?, ?, ?, ?, ?)";
				PreparedStatement stmt = this.conn.prepareStatement(sql);
				stmt.setString(1, user.getUuid());
				stmt.setString(2, user.getName());
				stmt.setString(3, user.getEmail());
				stmt.setString(4, user.getLocation());
				stmt.setString(5, user.getGender());
				stmt.setString(6, user.getExperience());
				int rowCount = stmt.executeUpdate();
				return rowCount == 1;
			}
		}
		catch(Exception err) {
			System.out.println("[INSERT]" +  err.getLocalizedMessage());
			err.printStackTrace();
		}
		
		return false;
	}
	
	public ArrayList<User> select(String query) {
		ArrayList<User> users = new ArrayList<User>();
		
		try {
			if(this.conn == null) {
				this.connect();
			}
			
			if(this.conn != null) {
				String sql = "select * from " + this.database + ".users where name like ?";
				PreparedStatement stmt = this.conn.prepareStatement(sql);
				stmt.setString(1, "%" + query + "%");
				
				ResultSet resultSet = stmt.executeQuery();
				while(resultSet.next()) {
					String uuid = resultSet.getString("uuid");
					String name = resultSet.getString("name");
					String email = resultSet.getString("email");
					String location = resultSet.getString("location");
					String gender = resultSet.getString("gender");
					String experience = resultSet.getString("experience");
					User user = new User(uuid, name, email, location, gender, experience);
					users.add(user);
				}
			}
			
		}
		catch(Exception err) {
			System.out.println("[SELECT]" +  err.getLocalizedMessage());
			err.printStackTrace();
		}
		
		return users;
	}

	

}

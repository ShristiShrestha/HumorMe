import java.util.UUID;


public class User {
	private String uuid;
	private String name;
	private String email;
	private String location;
	private String gender;
	private String experience;
	
	
	User(String name, String email, String location, String gender, String experience){
		this.uuid = UUID.randomUUID().toString();
		this.name =name;
		this.email = email;
		this.location = location;
		this.gender = gender;
		this.experience = experience;
	}
	
	User(String uuid, String name, String email, String location, String gender, String experience){
		this.uuid = uuid;
		this.name =name;
		this.email = email;
		this.location = location;
		this.gender = gender;
		this.experience = experience;
	}
	
	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	
	public String getName() {
		return this.name;
	}
	
	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getExperience() {
		return experience;
	}

	public void setExperience(String experience) {
		this.experience = experience;
	}	
}

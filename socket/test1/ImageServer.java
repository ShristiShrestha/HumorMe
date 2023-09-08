package socket.test1;

import java.io.*;
import java.net.*;

public class ImageServer {
    public static void main(String[] args) {
        try {
            ServerSocket server = new ServerSocket(8008);
            String imageName = "Koala.png";
            String inputDir = "socket/test1/";

            while (true) {
                System.out.println("server is waiting for connection request from clients");
                Socket s = server.accept();
                BufferedReader in = new BufferedReader(new InputStreamReader(
                        s.getInputStream()));
                DataOutputStream out = new DataOutputStream (s.getOutputStream());

                /* Detailed requirement below*/

                //Step one: check the picture name sent from the client,
                String clientInput;
                while((clientInput = in.readLine()) != null){
                    System.out.println("[SERVER] received: " + clientInput);

                    // if the picture name equals "Koala.jpg", go to step two, otherwise go to step three
                    Boolean clientReqMatch = clientInput.equals(imageName);

                    //Step two, read the picture "Koala.jpg" from the local disk, and send the content back to the client.
                    if(clientReqMatch){
                        // init image as file
                        String imageNamePath = inputDir + clientInput;
                        File imageFile = new File(imageNamePath);

                        if(!imageFile.exists()){
                            throw new Exception("Failed to load image as File object.");
                        }

                        // read bytes from file
                        FileInputStream fis = new FileInputStream(imageFile);
                        byte[] imageData = new byte[(int) imageFile.length()];
                        fis.read(imageData);
                        fis.close();

                        // send the image bytes
                        out.writeChar('C');
                        out.writeInt(imageData.length);
                        out.write(imageData);
                        out.flush();
                        System.out.println("[SERVER] sending bytes: " + imageData.length + " : for image: " + clientInput);
                    }

                    //step three, then reply to the client with "Sorry, no such picture",
                    else{
                        String resMessage = "Sorry, no such picture as " + clientInput;
                        out.writeChar('M');
                        out.writeUTF(resMessage);
                        out.flush();
                        System.out.println("[SERVER] sending error msg: " + resMessage);
                    }
                    break;
                }

                //step four, close the input/output streams, close the socket.
                in.close();
                out.close();
                s.close();
            }
        } catch (Exception e) { e.printStackTrace(); }
    }
}
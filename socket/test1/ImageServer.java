package socket.test1;


import java.io.*;
import java.net.*;
public class ImageServer {
    public static void main(String[] args) {
        try {
            ServerSocket server = new ServerSocket(8008);

            while (true) {
                System.out.println("server is waiting for connection request from clients");
                Socket s = server.accept();
                BufferedReader in = new BufferedReader(new InputStreamReader(
                        s.getInputStream()));
                DataOutputStream  out = new DataOutputStream (s.getOutputStream());

                /* Detailed requirement below*/

                //Step one: check the picture name sent from the client, if the picture name equals "Koala.jpg", go to step two, otherwise go to step three
                //Step two, read the picture "Koala.jpg" from the local disk, and send the content back to the client.
                //step three, then reply to the client with "Sorry, no such picture",
                //step four, close the input/output streams, close the socket.
            }
        } catch (Exception e) { e.printStackTrace(); }
    }
}
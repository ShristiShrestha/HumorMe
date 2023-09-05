package socket.test1;

import java.io.*;
import java.net.*;

public class ImageClient {
    public static void main(String[] args) {
        String host = "localhost";
        String imageName = "socket/test1/Koala.png";

        try {
            Socket socket = new Socket(host, 8008);
            // read data from the server from this
            BufferedInputStream in = new BufferedInputStream(
                    socket.getInputStream());
            // write data to the server using this
            PrintWriter out = new PrintWriter(new OutputStreamWriter(
                    socket.getOutputStream()));

            /* Detailed requirement below*/

            // Step one: send the picture name "Koala.jpg" to the server
            out.println(imageName);
            out.flush(); // ensure imageName is written immediately

            // Step two: write the response from the server to a local file "Koala-1.jpg";
            while(true){

                DataInputStream reader = new DataInputStream(in);
                char serverData = reader.readChar();

                System.out.println("[CLIENT] server first response: " + serverData);
                if(serverData == 'M'){
                    String charData = reader.readUTF();
                    System.out.println("[CLIENT] server err message: " + charData);
                    reader.close();
                    break;
                }
                else if(serverData == 'C'){
                    int byteSize = reader.readInt();
                    byte[] byteData = reader.readAllBytes();
                    System.out.println("[CLIENT] server responded with byteSize: "
                            + byteSize + " and byteData: " + byteData.length);

                    String fileExt = "png";
                    String outputImgName  = imageName.replace("." + fileExt, "-1." + fileExt);
                    try{
                        FileOutputStream fos = new FileOutputStream(outputImgName);
                        fos.write(byteData);

                        // close file and buffer readers
                        fos.close();
                        reader.close();

                        System.out.println("[CLIENT] success saving server bytes to file: " +  outputImgName);
                        break;

                    }catch (Exception err){
                        System.out.println("[CLIENT] client fail to save server bytes to file: " + outputImgName);
                        err.printStackTrace();
                    }
                }
            }

            // Step three: close all the input/output streams and socket.
            out.close();
            in.close();
            socket.close();

            // Step four: try to read the file "Desert-1.jpg" using any picture viewer.
            // If you can view the picture correctly, your download of picture is correct.

            // run the client code again and try to send a wrong picture name "Koala-wrong.jpg"
            // you will create a Koala-1.jpg again, this time use a normal text editor to open it,
            // if you see "Sorry, no such picture", then your program is correct.

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
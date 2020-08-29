package com.company;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class ClientThread extends Thread {
    public void run(){
        System.out.println("MyThread running");

        try {
            Socket s = new Socket("localhost", 6666);

            OutputStreamWriter out = new OutputStreamWriter(s.getOutputStream(), StandardCharsets.UTF_8);

            InputStream input = s.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(input));

            System.out.println("For the list of possible command, please type \"help\".\n");

            while (true) {
                Scanner sc = new Scanner(System.in);
                String commandLine = sc.nextLine();
                String[] splitCommand = commandLine.split(" ");

               switch (splitCommand[0]) {
                   case "help":
                       System.out.println("z");
                       break;
                   case "create_account":

                       try {
                           if (splitCommand[1] != null && splitCommand[2] != null) {
                               out.write(commandLine);
                               out.flush();

                               String line = reader.readLine();
                               System.out.println(line + "\n");
                           }

                       } catch (Exception e) {
                           System.out.println("Please choose a username and a password for your account!\n");
                       }
                       break;


                   case "login":
                       try {
                           if (splitCommand[1] != null && splitCommand[2] != null) {
                               out.write(commandLine);
                               out.flush();

                               String line = reader.readLine();
                               System.out.println(line + "\n");
                           }
                       } catch (Exception e) {
                           System.out.println("Please enter your username and password!");
                       }
                       break;

                   case "send":
                       try {
                           if (splitCommand[1] != null && splitCommand[2] != null) {
                               out.write(commandLine);
                               out.flush();

                               String line = reader.readLine();
                               System.out.println(line + "\n");
                           }
                       } catch (Exception e) {
                           System.out.println("Please enter your username and password!");
                       }
                       break;
                    default:
                        System.out.println("no match");
                }

            }

        } catch (Exception e) {
            System.out.println(e);

        }
    }
}

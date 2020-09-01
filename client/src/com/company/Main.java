package com.company;

import java.io.*;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) throws IOException {

        try {
            Socket s = new Socket("localhost", 6666);

            OutputStreamWriter out = new OutputStreamWriter(s.getOutputStream(), StandardCharsets.UTF_8);

            Scanner sc = new Scanner(System.in);

            System.out.println("For the list of possible command, please type \"help\".\n");

            InputStream input = s.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(input));

            Thread readingThread = new Thread(() -> {
                while (true) {
                    String line = null;
                    try {
                        line = reader.readLine();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    System.out.println(line + "\n");
                }
            });

            readingThread.start();

            Thread writingThread = new Thread(() -> {
                while (s.isConnected()) {

                    String commandLine = sc.nextLine();
                    String[] splitCommand = commandLine.split(" ");

                    switch (splitCommand[0]) {
                        case "help":
                            System.out.println("Create a new user account            :  create_account username password");
                            System.out.println("Log in an existing account           :  login username password");
                            System.out.println("Logout from your current account     :  logout");
                            System.out.println("Send a message to one or more users  :  send user1 user2 user3 ... mesaj");
                            System.out.println("Check your messages in the mailbox   :  read_mailbox");
                            System.out.println("Read one particular message          :  read_msg id");

                            break;
                        case "create_account":

                            try {
                                if (splitCommand[1] != null && splitCommand[2] != null) {
                                    out.write(commandLine);
                                    out.flush();
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
                                }
                            } catch (Exception e) {
                                System.out.println("Please enter your username and password!\n");
                            }
                            break;

                        case "logout":
                            try {
                                out.write(commandLine);
                                out.flush();

                            } catch (Exception e) {
                                System.out.println("Something went wrong! We couldn't log you out!\n");
                            }
                            break;

                        case "send":
                            try {
                                if (splitCommand[1] != null && splitCommand[2] != null) {
                                    out.write(commandLine);
                                    out.flush();
                                }
                            } catch (Exception e) {
                                System.out.println("Please enter a list of recipients and a message!\n");
                            }
                            break;

                        case "read_mailbox":
                            try {
                                out.write(commandLine);
                                out.flush();
                            } catch (Exception e) {
                                System.out.println("We couldn't open your mailbox!\n");
                            }
                            break;

                        case "read_msg":
                            try {
                                if (splitCommand[1] != null) {
                                    out.write(commandLine);
                                    out.flush();
                                }
                            } catch (Exception e) {
                                System.out.println("Please enter the ID of a message you want to read!\n");
                            }
                            break;
                        default:
                            System.out.println("Please enter a valid command! User \"help\" for a list of them.\n");
                    }
                }
            });
            writingThread.start();
        } catch(Exception e) {
            System.out.println(e);
        }
    }
}



package com.company;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class ClientThread extends Thread {
    public void run() {

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
                        System.out.println("create_account username password");
                        System.out.println("login username password");
                        System.out.println("logout");
                        System.out.println("send user1 user2 user3 ... mesaj");
                        System.out.println("read_mailbox");
                        System.out.println("read_msg id");
                        System.out.println("\n");

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
                            System.out.println("Please enter your username and password!\n");
                        }
                        break;

                    case "logout":
                        try {
                            out.write(commandLine);
                            out.flush();

                            String line = reader.readLine();
                            System.out.println(line + "\n");
                        } catch (Exception e) {
                            System.out.println("Something went wrong! We couldn't log you out!\n");
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
                            System.out.println("Please enter a list of recipients and a message!\n");
                        }
                        break;

                    case "read_mailbox":
                        try {
                            out.write(commandLine);
                            out.flush();

                            String line = reader.readLine();
                            System.out.println(line + "\n");
                        } catch (Exception e) {
                            System.out.println("We couldn't open your mailbox!\n");
                        }
                        break;

                    case "read_msg":
                        try {
                            if (splitCommand[1] != null) {
                                out.write(commandLine);
                                out.flush();

                                String line = reader.readLine();
                                System.out.println(line + "\n");
                            }
                        } catch (Exception e) {
                            System.out.println("Please enter the ID of a message you want to read!\n");
                        }
                        break;
                    default:
                        System.out.println("Please enter a valid command! User \"help\" for a list of them.\n");
                }

            }

        } catch (
                Exception e) {
            System.out.println(e);

        }
    }
}

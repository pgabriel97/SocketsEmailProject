package com.company;

import java.io.*;

public class Main {

    public static void main(String[] args) throws IOException {
        ClientThread clientThread = new ClientThread();
        clientThread.start();
    }
}




# -*- conding: utf-8 -*-

import socket
from random import randint
from time import sleep

# address and port is arbitrary
def client(host="127.0.0.1", port=8001):
  with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.connect((host, port))
    i = 1
    while True:
      data = '{},{},{}'.format(i,randint(0, 100),randint(0, 100))
      print('send : ',data)
      sock.sendall(data.encode('utf-8'))
      
      response = sock.recv(4096)

      if not response:
        print("[-] Not Received")
        break

      print("[+] Received", repr(response.decode('utf-8')))
      sleep(0.5)
      i+=1
      if i > 50:
        i = 1

if __name__ == "__main__":
  client()
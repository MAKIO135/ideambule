# Challenge Transport #UXvoyageur
Transformer les temps d'attente subis en temps de découverte choisis
___

#### Install Raspbian Stretch Lite
https://www.raspberrypi.org/downloads/raspbian/  
Currently using: 2017-11-29-raspbian-stretch-lite.img  
Default user pi/raspberry

#### Activate SSH:
```
sudo raspi-config
```

#### Install NodeJS:
```
wget https://nodejs.org/dist/v9.4.0/node-v9.4.0-linux-armv7l.tar.gz
tar -xvf node-v9.4.0-linux-armv7l.tar.gz
cd node-v9.4.0-linux-armv7l
sudo cp -R * /usr/local/
```

#### Test Installation:
```
node -v
npm -v
```

#### Get Repo:
```
git clone https://github.com/makio135/printbox.github
```

Based on following NPM Packages:
- [Node Serialport](https://github.com/node-serialport/node-serialport)
- [xseignard/thermalPrinter](https://github.com/xseignard/thermalPrinter)

#### Find USB Port
```
cd /dev/ ls
```
Plug Arduino USB, then repeat previous command and search new port (something like ttyACM0).

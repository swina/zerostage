# ZerostagE for Ableton Live

### Version 0.0.beta

## **Ableton Live Touch Control without any mapping !!!**

## Features

- Ableton M4L MIDI device to control current session with OSC via browser or Open Stage Control client (locally or remotely)
- Open Stage Control custom web control surface (json file supplied, but you can customize as per your needs)
- Remote Controls Up to 16 tracks

    - Volume
    - Master Track Volume
    - Track Name (readonly)
    - Track Color (readonly)
    - Track Device selection
    - Track Sends controls (up to 4 per track)
    - RackDevice Variations (with new variation creation)
    - RackDevice Macros (Up to 16 Parameters)
    - Randomize current Macros 
    - Configurable Track XY Pad (Macro Mapping)

## Description

ZerostagE is a M4L device that works with Open Stage Control (OSC web controller).
It has been designed in order to control your session during a live performance controlling the relevant controls such:
- Track volume
- Track device selector
- Track device variations
- Track device macros

Using the powerful OSC protocol (Open Sound Control) you can control remotely your Ableton session without the need of tedious MIDI mapping. 

Using the web technologies you can have a touch controller with no cost. Compatible with any touch device (iOS/Android). 

**No app installation required: you need just a browser.**

### Requirements: 
- Ableton Live Standard 
- ZerostagE M4L device 
- Open Stage Control (installed and running)


## Setup

### ZerostagE Ableton Max4Live device:
- Create an Ableton MIDI track and add ZerostagE M4L device. Set the Server settings:
    - Host IP
    - Port (send) - corresponds to osc-port on OSC
    - Port (receive)

#### LOCAL MACHINE
If you are using on a local machine set as follows:

- Host IP: 192.168.1.1 or 127.0.0.0

***You can leave the default ports.***



![zerostage AbletonLive](https://res.cloudinary.com/moodgiver/image/upload/v1760460377/ZerostagEM4l_nbvu3r.png)

Copy `sessionData.js` in the same folder of `ZeroStage-01.amxd` file

### Open Stage Control
- send: Host IP : Port (receive)
- midi: (plase refer to Open Stage Control documentation)
- theme: (refer to OSC documentation)
- load: `ZerostagE.json` (Client template)
- module:  `zerostage_osc.js` (OSC Module to better control and filter OSC messages)
- osc-port: Port OSC server (refer to OSC documentation)

***Read the Open Stage Control documentation on how to setup your server***

- Open your browser at http://localhost:8080 and bum your controller is live and connected to your Ableton session.

### LOCAL MACHINE

** If you are using the same machine running Ableton and test only from the local machine **

- send : 127.0.0.1:5091


***You will not be able to test with a different device using the local machine configuration***



### Client App Window

![Open Stage Control template](https://res.cloudinary.com/moodgiver/image/upload/v1760460377/ZerostagE-Client_adcopj.png)

### Track XYPad

Each track has his own configurable XYPad. To activate the XYPad modal click on the XYPad button.

You can assign at each XYPad any parameter of the current track device selecting from the list of available parameters

![Track XYPad](https://res.cloudinary.com/moodgiver/image/upload/v1760460377/ZerostagE-XYPAD_ceqyiy.png)


## OSC Messages 

Open Stage Control module `zerostage_osc.js` filters incoming/outgoing messages in order to limit the UDP packets that could create traffic congestion with an inevitable increasing of the controls latency.


### IN (from Ableton Live)

```
/track
/total 
/track/device
/track/device/param
/master/volume
/receive/refresh/param
/request/refresh/params
```

### OUT (to Ableton Live)
```
/reload
/send/param
/send/variation
/send/store/variation
/send/refresh/param
/randomize
/send/track/device/params
/sendstrack
```



## Content

- `./ZerostagE.json` : Open Stage Control template (client)
- `./zerostage_osc.js` : Open Stage Control module (OSC Filtering)
- `./Ableton M4L/ZeroStage-01.amxd`: Ableton Live Standard (minimum) Max4Live device 
- `./Ableton M4L/sessionData.js` : Max4Live JS file (required)
- `./ZerostagE-Logo.png`: splash screen image
- `./README.md`: this file
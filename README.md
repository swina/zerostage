# ZerostagE for Ableton Live

### Version 0.0.beta

## **Ableton Live Touch Control without any mapping !!!**

## Features

- Ableton M4L MIDI device to control current session with OSC via browser or Open Stage Control client (locally or remotely)
- Open Stage Control custom web control surface (json file supplied, but you can customize as per your needs)
- Remote Controls Up to 16 tracks
    - Volume
    - Track Name (readonly)
    - Track Color (readonly)
    - RackDevice Variations
    - RackDevice Macros (Up to 16 Parameters)
    - Configurable Track XY Pad (Macro Mapping)
- Master Track Volume

## Description

ZerostagE is a M4L device that works with Open Stage Control (OSC web controller).
It has been designed in order to control your session during a live performance controlling the relevant controls such:
- Track volume
- Track device variations (change the variation of the device if present, or add new)
- Track device macros (change the macros of the device is present, or randomize)

**Devices selector and Parameters Randomize has to be completed and will be available in the next release**

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

### Client App Window

![Open Stage Control template](https://res.cloudinary.com/moodgiver/image/upload/v1760460377/ZerostagE-Client_adcopj.png)

### Track XYPad

Each track has his own configurable XYPad. To activate the XYPad modal click on the XYPad button.

You can assign at each XYPad any parameter of the current track device selecting from the list of available parameters

![Track XYPad](https://res.cloudinary.com/moodgiver/image/upload/v1760460377/ZerostagE-XYPAD_ceqyiy.png)


## Content

- `./ZerostagE.json` : Open Stage Control template (client)
- `./zerostage_osc.js` : Open Stage Control module (OSC Filtering)
- `./Ableton M4L/ZeroStage-01.amxd`: Ableton Live Standard (minimum) Max4Live device 
- `./Ableton M4L/sessionData.js` : Max4Live JS file (required)
- `./README.md`: this file
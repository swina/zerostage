autowatch = 1;

inlets=2
outlets=2


var OSC_TARGET = "192.168.1.120";
var OSC_PORT = 5090;


// ---- main ----
function anything() {
    get_session();
}

// You can set them dynamically: "target 192.168.1.5 8000"
function target(ip, port) {
    OSC_TARGET = ip;
    OSC_PORT = port;
    post("✅ OSC target set to " + ip + ":" + port + "\n");
}

// helper
function pathToString(arr) {
    if (!arr) return "";
    if (typeof arr === "string") return arr;
    return arr.join(" ");
}

function safeGet(api, prop) {
    try {
        return api.get(prop);
    } catch (e) {
        return null;
    }
}

function safeGetString(api, prop) {
    try {
        var s = api.getstring(prop);
        if (Array.isArray(s)) return s.join(" ");
        return s;
    } catch (e) {
        return "";
    }
}



function update() {
    get_session();
}

function get_session() {
    var live = new LiveAPI("live_set");
    
    var songPath = new LiveAPI("live_set song");
    // var song = safeGetString(songPath,"name");
    
    var trackCount = live.getcount("tracks");
    var songName = safeGetString(live,"name");
    sendOSC("/total",[trackCount,songName])

    for (var t = 0; t < trackCount; t++) {
        var trackPath = "live_set tracks " + t;
        var trackApi = new LiveAPI(trackPath);
        var trackName = safeGetString(trackApi, "name");
        var trackColor = safeGetString(trackApi,"color");
        var mixerDevice = new LiveAPI(trackPath + " mixer_device");
        
        var volumeDevice = new LiveAPI(trackPath + " mixer_device volume");
        var volumeId = safeGet(volumeDevice,"id")
        var volume = safeGetString(volumeDevice,"value")
        var panDevice = new LiveAPI(trackPath + " mixer_device panning" )
        var pan = safeGetString(panDevice,"value")
        var soloDevice = new LiveAPI(trackPath + " mixer_device solo")
        var solo = safeGetString(soloDevice,"value")
        var muteDevice = new LiveAPI(trackPath + " mixer_device mute")
        var mute = safeGetString(muteDevice,"value")
        var extra = getTrackData(t)
        // post ( volumeId , volume )
        // var mixerDevice = {
        //     volume: volume,
        //     pan: safeGetString(trackApi, "mixer_device panning"),
        //     solo: safeGetString(trackApi, "mixer_device solo"),
        //     mute: safeGetString(trackApi, "mixer_device mute"),
        //     crossfade: safeGetString(trackApi, "mixer_device crossfade_assign"),
        // };
        var trackId = safeGetString(trackApi,"id")
        sendOSC("/track", [
            t, 
            trackName, 
            colorToHex(trackColor), 
            trackId, 
            volumeDevice.id , 
            volume, 
            mixerDevice.id , 
            panDevice.id , 
            pan , 
            soloDevice.id , 
            solo , 
            muteDevice.id, 
            mute,
            extra.activatorId,
            extra.activator,
            extra.sends.join(',')
        ]);
        sendOSC ("/tt" , [{ "data" : {
            "track" : t,
            "trackName" : trackName,
            "color" : colorToHex(trackColor),
            "trackId" : trackId,
            "volumeId" : volumeDevice.id,
            "volume": volume,
            "mixerId" : mixerDevice.id,
            "panId" : panDevice.id,
            "pan" : pan,
            "soloId" : soloDevice.id
        }}])
        var deviceCount = trackApi.getcount("devices");
        for (var d = 0; d < deviceCount; d++) {
            var devPath = trackPath + " devices " + d;
            var devApi = new LiveAPI(devPath);
            var devName = safeGetString(devApi, "name");
            var devType = safeGetString(devApi,"type");
            var devMacros = safeGetString(devApi,"visible_macro_count");
            if ( devType == 1 ){
                var devVariations = safeGetString(devApi,"variation_count");
            } else {
                var devVariations = 0;
            }
            
            var paramCount = devApi.getcount("parameters");
            /**
             * t = track no.
             * d = device no.
             * devName = device name
             * devVariations = device variations
             * devMacros = device macros
             * devApi.id = device id
             */
            sendOSC("/track/device/" + t , [d, devName,devVariations,devMacros,devApi.id,paramCount]);
            
            for (var p = 0; p < paramCount; p++) {
                var paramPath = devPath + " parameters " + p;
                var pApi = new LiveAPI(paramPath);

                var pName = safeGetString(pApi, "name");
                var pVal = safeGetString(pApi, "value");
                var pMin = safeGetString(pApi, "min");
                var pMax = safeGetString(pApi, "max");
                var pid = pApi.id;

                // send OSC message
                var address = "/track/device/param/" +t;// + "/" + d + "/" + p;
                var args = [d,devVariations,p,pid, pName, pVal, pMin, pMax,paramCount];
                /**
                 * address = OSC address
                 * t = track no.
                 * args =
                 *  d = device no (starting from 0)
                 *  devVariations = device variations
                 *  p = parameter no (starting from 0)
                 *  pid = parameter id
                 *  pName = parameter name
                 *  pVal = parameter value
                 *  pMin = parameter min value
                 *  pMax = parameter max value
                 *  paramCount = total parameters
                 */
                sendOSC(address, args);
            }
        }
    }

    // also master track if desired
    // var master = new LiveAPI("live_set master_track");
    // var masterMixerDevice = new LiveAPI(master + " mixer_device" );
    // var masterVolumeDevice = new LiveAPI(master + " mixer_device volume");
    // var masterVolume = safeGetString(masterVolumeDevice,"value");
    // post (" Master =>>>>>" , masterVolumeDevice.id , safeGet(masterMixerDevice,"id") , masterVolume )
    // sendOSC("/master/volume" , [ masterVolumeDevice.id , masterVolume] );
    // var devCount = master.getcount("devices");
    // post("✅ Ready to send all master device data as OSC\n");
    // for (var d = 0; d < devCount; d++) {
    //     var devPath = "live_set master_track devices " + d;
    //     var devApi = new LiveAPI(devPath);
    //     var devName = safeGetString(devApi, "name");
    //     post("✅ Send all master device data as OSC\n");
    //     sendOSC("/master/device", [d, devName]);

    //     var paramCount = devApi.getcount("parameters");
    //     for (var p = 0; p < paramCount; p++) {
    //         var paramPath = devPath + " parameters " + p;
    //         var pApi = new LiveAPI(paramPath);
    //         var pName = safeGetString(pApi, "name");
    //         var pVal = safeGet(pApi, "value");
    //         var pMin = safeGet(pApi, "min");
    //         var pMax = safeGet(pApi, "max");
    //         var pid = pApi.id;

    //         var address = "/master/device/" + d + "/param/" + p;
    //         var args = [pid, pName, pVal, pMin, pMax];
    //         sendOSC(address, args);
    //     }
    // }

    post("✅ Sent all track/device/parameter data as OSC\n");
}

function getParams(track,index){
    post ( track , index )
    var devPath = new LiveAPI("live_set tracks " + track + " devices " + index);
    var paramCount = devPath.getcount("parameters");
    post ( paramCount )
    for (var p = 0; p < paramCount; p++) {
        // var paramPath = devPath + " parameters " + p;
        var pApi = new LiveAPI("live_set tracks " + track + " devices " + index + " parameters " + p );
        var pName = safeGetString(pApi, "name");
        var pVal = safeGetString(pApi, "value");
        var pMin = safeGetString(pApi, "min");
        var pMax = safeGetString(pApi, "max");
        var pid = pApi.id;

        // send OSC message
        var address = "/receive/refresh/param"// +track;// + "/" + d + "/" + p;
        var args = [pid,pVal];
        sendOSC(address, args);
    }
}

function getParam(d){
    var pApi = new LiveAPI("id " + d);
    
    var pName = safeGetString(pApi, "name");
    var pVal = safeGetString(pApi, "value");
    var pMin = safeGetString(pApi, "min");
    var pMax = safeGetString(pApi, "max");
    var pid = pApi.id;

    var liveApi = new LiveAPI(liveCallback, pApi);
    // request initial value
    try {
        // some LiveAPI builds support "value" property subscription this way:
        liveApi.property = "value";
    } catch (e) {
        // fallback: call get to fetch initial value
        var v = liveApi.get("value");
        if (v && v.length>0) outlet(0, v[0]);
    }

    // send OSC message
    var address = "/receive/refresh/param"// +(t-1);// + "/" + d + "/" + p;
    var args = [d,pVal];
    sendOSC(address, args);
    
}


function getTrackData(t){
    post("Track => " + t)
    var data = {}
    var trackPath = "live_set tracks " + t;
    var trackApi = new LiveAPI(trackPath);
    var sendsApi = new LiveAPI ( trackPath + " mixer_device")
    var trackActivator = sendsApi.get("track_activator")
    var activator = new LiveAPI(trackActivator);
    data = {
        activatorId: activator.id,
        activator: safeGetString(activator,"value"),
        sends: []
    }
    var countSends = sendsApi.getcount("sends")
    for ( n=0 ; n < countSends ; n++ ){
        var sApi = new LiveAPI("live_set tracks " + t + " mixer_device sends " + n);
        var send = safeGetString(sApi,"value")
        data.sends.push ( send )
    }
    return data
}

function setTrackSend(t,s,value){
    var trackPath = "live_set tracks " + t;
    var sendsApi = new LiveAPI ( trackPath + " mixer_device sends " + s)
    sendsApi.set("value",value) 
}

// callback from LiveAPI
function liveCallback() {
    var args = arrayfromargs(arguments);
    // args will contain messages like: "value", 0.5  OR other notifications
    post("liveCallback:", args, "\n");
    // if first token is "value" forward the numeric
    if (args[0] === "value" && args.length > 1) {
        outlet(0, parseFloat(args[1]));
    } else {
        outlet(0, args);
    }
}

// helper to free observer
function free() {
    if (liveApi) {
        try { liveApi.id = null; } catch(e){}
        liveApi = null;
    }
}

function colorToHex(intColor) {
    intColor = parseInt(intColor);
    var hex = intColor.toString(16).toUpperCase();
    // manually pad to 6 digits
    while (hex.length < 6) {
        hex = "0" + hex;
    }
    return "#" + hex;
}

// helper to build and send an OSC message (as list for udpsend)
function sendOSC(address, args) {
    var msg = [address].concat(args);
    outlet(0, msg);
}




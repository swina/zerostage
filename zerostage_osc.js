// const { oscIn } = require("./zerostage_osc.js")
// console.log ( 'reloading data ...')
const TRACKS = []
var cliendID
var snd = settings.read("send")[0]
var tracks = []
module.exports = {
    
    init: function(){
        // this will be executed once when the osc server starts after
        // connections are set up
        // it is called for the main module only
        // loadData()
        tracks = []
    },

    stop: function(){
        // this will be executed once when the osc server stops
        // it is called for the main module only
    },

    reload: function(){
        // this will be executed after the custom module is reloaded
        // it is called for the main module only
    },


    oscInFilter:function(data){
        // Filter incoming osc messages
        var {address, args, host, port} = data
        if ( address == '/total' ){
            return { address, args, host,  port}
        }
        if ( address == '/track' ){
            let obj = {}
            obj["track_" + args[0].value] = { name: args[1].value , color: args[2].value, id: args[3].value }
            tracks.push ( obj )
            // console.log ( tracks )
            return { address , args, host, port }
        }
        if ( address.includes('/track/device') && !address.includes("/track/device/param/" ) ) {
            return { address, args, host, port }
            // console.log ( address, args )
        }
        
        if ( address.includes("/track/device/param/") ){
            let addr = address.split('/')
            let device = {
                tr: addr[4],
                nr: args[0].value,
                id: args[1].value,
                variations: args[2].value,
                name: args[3].value,
                value: args[4].value,
                min: args[5].value,
                max: args[6].value
            }
            if ( args[0].value == 0 ){
                return { address, args, host, port }
            }
            // console.log ( address, args )
        }
        
        if ( address.includes("/master/volume") ){
            return { address, args, host, port } 
        }

        if ( address.includes("/receive/refresh/param") ){
            return { address, args, host, port }
        }

     },
    oscOutFilter:function(data){
        // Filter outgoing osc messages
        var {address, args, host, port, clientId} = data
        if ( address === '/reload' ){
            return { address, args, host, port }
        }
        if ( address.includes('/send/param') ){
            return { address, args, host, port }
        }
        if ( address.includes('/send/variation') ){
            return { address, args, host, port }
        }

        if ( address.includes('/send/store/variation') ){
            return { address, args, host, port }
        }

        if ( address.includes('/send/refresh/param/') ){
            return { address, args, host,  port }
        }
    },

    unload: function(){
        // this will be executed before the custom module is reloaded
        // it is called for all modules, including other loaded modules
    },

}

const createObject = (arr) => {
    let obj = {}
    for (let i = 0; i < arr.length; i += 3) {
        const key = arr[i].value    
        const v = arr[i + 2].value    
        obj[key] = v;
    }
    return obj
}

const loadParams = (track , data) => {
    // storage.setItem("TRACKS",TRACKS)
    TRACKS.forEach ( tr => {
        // send("192.168.1.120:5091", "/device/params/list/" + tr.deviceId,1)
        console.log ( tr )
    })
    // console.log ( track.deviceId )
    // send("192.168.1.120:5091","/device/params/list/" + track.deviceId,1)
}

const loadData = (value) => {
    console.clear()
    // const config = getVar("root","config")
    const obj = {};
    var arr = value
    for (let i = 0; i < arr.length; i += 3) {
        const key = arr[i].value;
        const value = arr[i + 2].value;
        obj[key] = value;
    }
    var tr = obj.tr
    var track = "tr" + tr
    var activator = obj.trackActivator.split(' ')

    const configTrack = {
        objectId: obj.id,
        name: obj.name,
        color : obj.color,
        activator: { id: parseInt(activator[0]) , value: parseInt(activator[1]) },
        hasAudio: obj.hasAudio,
        mixerId: obj.hasAudio ? obj.mixerId : 0,
        volume: obj.volume,
        device: { name: obj.deviceName, id: obj.deviceId, variations: obj.variations , lastVariation: 1, type: obj.deviceType },
        parameters: obj.parameters,
        macros: obj.macros,
        device_macros:[],
        address: "/volume/" + obj.mixerId,
        padMacro : { x : 0 , xLabel: "" , y: 0 , yLabel : ""}
    }
    return configTrack
    // //volume slider configuration
    // Object.keys(configTrack).map ( k => {
    //     setVar('volume_' + tr , k , configTrack[k] )  
    //     setVar('v_' + tr , k , configTrack[k] )
    // })

    // //track label configuration
    // setVar('tr_name_' + tr , "label" , configTrack.name )
    // setVar('tr_name_' + tr , "color" , configTrack.color )
    // setVar('tr_name_' + tr , "trackNo" , tr )
    // //activator button configuration
    // setVar('activator_' + tr , 'label' , tr )
    // set('activator_' + tr , configTrack.activator.value )
    // setVar('activator_' + tr, "address" , "/macro/value/" + configTrack.activator.id )
    // config[track] = configTrack
    // setVar("root","config",config)
    // console.log ( value )
}

// const sendClient = (osc, state, client, data, target) => {

//   // Send to all clients:
//   osc.send(target, data)

//   // Or send to a specific client (when available):
//   client.send(target, data)
// }

// module.exports = { sendClient }


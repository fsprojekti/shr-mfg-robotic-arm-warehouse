import {createRequire} from "module";
const require = createRequire(import.meta.url);

const fs = require("fs");
// const {delay} = require("./location");
const exec = require('child_process').exec;
// const path = require('path');
const axios = require("axios");
import {getState} from "./motion.js";

// add timestamps in front of all log messages
require('console-stamp')(console, '[HH:MM:ss.l]');
const config = require('./config/config.json');

//url to get image
const url = 'http://' + config.roboticArmIpAddress + ':8080/snapshot?topic=/usb_cam/image_rect_color'
const file_path = './image/input.jpg';

// get coordinate center ellipse and his area size
const getImageDataPy = async () => {
    // console.log("downloading image ...");
    await downloadImage();
    console.log("new image downloaded");
    return new Promise((resolve) => {
        exec('python ./python/visual.py', async (error, stdout) => {
            if(error)
                console.log(error)
            if(stdout) {
                stdout = stdout.substring(0,stdout.length-2);
                console.log("call to python visual.py successful");
                // console.log(stdout)
            }
            resolve(stdout);
        })
    })
}

// parse data from python script
// const imageProcessingPy = async () => {
//     console.log("starting imageProcessing...");
//     let data = 0;
//     console.log("get image data");
//     await getImageDataPy().then(d => {
//         data = JSON.parse(d);
//         // console.log("image data:" );
//         // console.log(data);
//     }).catch(error => {
//         console.error(error);
//     })
//     if (data !== undefined) {
//         return data;
//     } else {
//         return console.log("Package not found");
//     }
// }

//calculate dx and dy to move robot
// k: conversion from image pixels to dimensions in robotic arm coordinate system [mm]
//      k = 0.305
const getCenterPy = async () => {
    let current_x, current_y, o;
    console.log("getting robot arm state ...");
    let response = await getState();
    current_x = response.x
    current_y = response.y

    console.log("current robotic arm position, x = " + current_x + ", y = " + current_y);

    console.log("calculating o ...");
    o = Math.atan2(current_y, current_x);
    console.log(o);

    let visual_py_data = 0;
    let image_data = 0;
    console.log("get image data");
    await getImageDataPy().then(b => {
        visual_py_data = JSON.parse(b);
        // console.log("image data:" );
        // console.log(data);
        console.log("image data：" + JSON.stringify(visual_py_data));
        // retrieve scale factor that is used for conversion between image pixels coordinates to mm in robotic arm coordinates
        let scale_factor = visual_py_data.scale;

        let dx_center = ((640 / 2) - visual_py_data.x_c) * scale_factor;
        let dy_center = ((480 / 2) - visual_py_data.y_c) * scale_factor;

        // calculate the coordinates of the center of the package using the rotation matrix and the angle between the
        //      basic robotic arm coordinate system and the image coordinate system
        image_data = {
            x: dx_center * (-1) * Math.sin(o) + dy_center * Math.cos(o),
            y: dx_center * Math.cos(o) + dy_center * Math.sin(o), // +dy;
            id: visual_py_data.id
        } // -dy
        console.log("first angle :", o * 180 / Math.PI);
        console.log(image_data);

    }).catch(error => {
        console.error(error);
    })

    return image_data;
}

//download image from url
const downloadImage = async () => {
    console.log("downloading image from " + url + " to " + file_path);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(file_path))
            .on('error', reject)
            .once('close', () => resolve(file_path))
    })
}

// move robot for offset between camera and suction
const offsetToll = async () => {
    let current_x, current_y, o;
    let response = await getState();
    current_x = response.x
    current_y = response.y
    console.log("getState() inside offsetToll finished");
    o = Math.atan2(current_y, current_x);
    console.log("o: " + o)
    console.log("middleware angle", o * 180 / Math.PI);
    let dx2 = Math.cos(o) * 45;
    let dy2 = Math.sin(o) * 45;
    let d = {
        x: dx2,
        y: dy2
    }
    await moveXY(current_x + dx2, current_y + dy2, config.moveDownTagDetectionHeight);

    return d;
}

export {getCenterPy, downloadImage, offsetToll};
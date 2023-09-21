import {createRequire} from "module";
const require = createRequire(import.meta.url);

const axios = require("axios");
const fs = require("fs");
// const {delay} = require("./location");
const exec = require('child_process').exec;
// const path = require('path');

import {getState} from "./motion.js";

// add timestamps in front of all log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

const config = require('./config/config.json');

// url from where the images are retrieved
const url = 'http://' + config.roboticArmIpAddress + ':8080/snapshot?topic=/usb_cam/image_rect_color'
const file_path = './image/input.jpg';

// calculate dx and dy to move robot arm to the center of the april tag
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
    await getImageDataPy().then((b) => {
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
        }

        console.log("first angle :", o * 180 / Math.PI);
        console.log(image_data);

    }).catch(error => {
        console.error(error);
    })

    return image_data;
}

// download image and process it using visual.py script
// function returns april tag id, its center coordinates, scaling factor, ...
const getImageDataPy = async () => {
    // console.log("downloading image ...");
    await downloadImage();
    console.log("new image downloaded");
    return new Promise((resolve) => {
        exec('python3 ./python/visual.py', async (error, stdout) => {
            if(error)
                console.log(error)
            if(stdout) {
                stdout = stdout.substring(0,stdout.length-2);
                console.log("call to python visual.py successful");
                console.log(stdout)
            }
            resolve(stdout + "}");
        })
    })
}

// download image from preset url and save it to /image/input.jpg
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


export {getCenterPy, downloadImage};
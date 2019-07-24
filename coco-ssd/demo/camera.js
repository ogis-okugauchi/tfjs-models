/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as queryString from 'querystring';

const params = queryString.parse(location.search.replace('?', ''));
console.log('query params >>>', params);

const videoWidth = params.w || params.width || 800; // 600;
const videoHeight = params.h || params.height || 600; // 500;
const videoSrc = params.src;

console.log('videoWidth >>>', videoWidth, 'videoHeight >>>', videoHeight);

async function setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
            'Browser API navigator.mediaDevices.getUserMedia not available');
    }

    const video = document.getElementById('video');
    video.width = videoWidth;
    video.height = videoHeight;

    const mobile = false;
    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
            facingMode: 'user',
            width: mobile ? undefined : videoWidth,
            height: mobile ? undefined : videoHeight,
        },
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadVideo() {
    let video = null;
    if (videoSrc) {
        video = document.getElementById('video');
        video.src = videoSrc;
        video.loop = true;

        /*
        document.getElementById('output').style.cssText +=
            'transform: rotateY(180deg);' +
            '-webkit-transform:rotateY(180deg);' +
            '-moz-transform:rotateY(180deg);' +
            '-ms-transform:rotateY(180deg);'; */
    } else {
        video = await setupCamera();
    }
    video.width = videoWidth;
    video.height = videoHeight;
    video.play();
    return video;
}

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
async function detectObjectInRealTime(video, net) {
    const canvas = document.getElementById('output');
    const ctx = canvas.getContext('2d');
    ctx.font = '72px Arial';
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    console.log('model loaded');

    async function objectDetectionFrame() {
        const result = await net.detect(video);
        ctx.clearRect(0, 0, videoWidth, videoHeight);

        ctx.save();
        // ctx.scale(-1, 1);
        // ctx.translate(-videoWidth, 0);
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        ctx.restore();

        for (let i = 0; i < result.length; i++) {
            ctx.beginPath();
            ctx.rect(...result[i].bbox);
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'yellow';
            ctx.fillStyle = 'red';
            ctx.stroke();
            ctx.fillText(
                result[i].score.toFixed(3) + ' '
                + result[i].class, result[i].bbox[0],
                result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10);
        }
        requestAnimationFrame(objectDetectionFrame);
    }
    objectDetectionFrame();
}

/**
 * Kicks off the demo by loading the posenet model, finding and loading
 * available camera devices, and setting off the detectObjectInRealTime
 * function.
 */
export async function bindPage() {
    let video;
    let net;

    try {
        net = await cocoSsd.load();
        video = await loadVideo();
    } catch (e) {
        let info = document.getElementById('info');
        info.textContent = 'this browser does not support video capture, ' +
            'or this device does not have a camera';
        info.style.display = 'block';
        throw e;
    }

    detectObjectInRealTime(video, net);
}

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// kick off the demo
bindPage();

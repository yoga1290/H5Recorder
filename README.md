# Overview
Headless page video recorder, you simply provide array of pages and their starting and ending URI hash and get a video for each entry.

# Install

+ Unix-like OS or bash-supported console
+ FFMPEG, You will need FFMPEG either installed globally or located in the same project directory.
+ NodeJS & NPM installed
+ run `npm i` in project directory from terminal.

# Run

+ First, you'll need to provide a JSON file with the following format: `[{page,startHash,endHash}]`; check [sample.json](https://github.com/yoga1290/H5Recorder/blob/master/sample.json)

+ run `npm start [data.json]`, where `data.json` is the provided input file.

+ that's all, you'll get `v0.mp4, v1.mp4,...` files in the project directory depending on the number of entries provided in the JSON file.

# Credit
+ this was inspired by [phanan snippet](https://gist.github.com/phanan/e03f75082e6eb114a35c#file-runner-js), modified & wrapped to meet my needs :P

# MultiGet
A small application to http get request files from a given url in 1 MB chunks.

## Setup
Run `npm install` with the given package.json, which will download all needed dependecies.
The application takes in two arguments.
1. The URL which you want the data/file to be downloaded from.
2. The number of 1MB chunks you wish to download from URL.

```
npm start [URL] [Number of Chunks]
```
or 
```
node app.js [URL] [Number of Chunks]
```
The file will be downloaded to the repository in which the application is located, with the same file name as in the url.

## Features
The GET requests are asynchronous and are done in parallel with each other. 
You can also specifiy the number of chunks from 1 to as much memory your machine has.

## Drawbacks
Given that the requests are asynchronous all the data that is downloaded is saved into Buffers until all data has been downloaded and put back together. When downloading large files make sure enough memory is available for such large files.

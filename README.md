# MultiGet (Let's Get Chunky)
An application to download a file from a given url in 1 MB chunks.

## Setup
Run `npm install` with the given package.json, which will download all needed dependecies.

## Usage
The application takes in two arguments.
URL: The URL which you want the data/file to be downloaded from.
Number of Chunks: The number of 1MB chunks you wish to download from URL. This argument is optional and will default to 4 if none is given.
```
npm start [URL] [Number of Chunks]
```
or 
```
node app.js [URL] [Number of Chunks]
```

The file will be downloaded to the repository in which the application is located, with the same file name as in the url.

## Features
The GET requests are asynchronous and are done in parallel with each other, to save on time.
You can also specifiy the number of chunks from 1 to as much memory as your machine has.

## Drawbacks
Given that the requests are asynchronous, all the data that is downloaded is saved into buffers until all data has been downloaded and put back together. When downloading large files make sure enough memory is available for such large files.

## Example
`node app.js https://raw.githubusercontent.com/abcapindo/multiGet/master/example.jar 2`

Downloads the first 2MB of the jar file. It will be saved as example.jar

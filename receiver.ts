// const net = require("net");
// const fs = require("fs");

import net, { Socket  } from "net";
import fs, { WriteStream } from "fs";

try {

  let fileName: string = "";
  let fileTransSocket: Socket;
  let date: Date = new Date();
  let size: number = 0;
  let elapsed: number = 0;
  let fileNameSocket: Socket =  net.connect(8001, 'localhost');
  fileNameSocket.on('data', (chunk: Buffer) => {
    fileName += chunk;
  });
  fileNameSocket.end()
  fileNameSocket.on("end", () => {
    elapsed = 0 + (new Date()).getTime() - date.getTime();
    console.log(`\nFinished getting file name.`);

    fileTransSocket =  net.connect(8000, 'localhost');
    const outStream: WriteStream = fs.createWriteStream(`./receiver/${new Date().getTime()}${fileName}`);

    fileTransSocket.on('data', (chunk: Buffer) => {
      size += chunk.length;
      elapsed = 0 + (new Date()).getTime() - date.getTime();
      fileTransSocket.write(`\r${(size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${elapsed / 1000} s`)
      process.stdout.write(`\r${(size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${elapsed / 1000} s `);
      outStream.write(chunk);

    });
    fileTransSocket.on("end", () => {
      console.log(`\nFinished getting file. speed was: ${((size / (1024 * 1024)) / (elapsed / 1000)).toFixed(2)} MB/s`);
      process.exit();
    });
  })
} catch (error) {
  console.log(error);
}

// const net = require("net");
// const fs = require("fs");
import net, { Server, Socket } from "net";
import fs, { ReadStream } from "fs";

try {
    
// const filePath: string = "./sender/sender.txt";
// const filePath: string = "./sender/video.mp4";
let filePath: string = process.argv.slice(-1)[0];

let fileTransferServer: Server;
let inputStream: ReadStream = fs.createReadStream(filePath);

fileTransferServer = net.createServer((socket: Socket) => {
    socket.pipe(process.stdout);
    inputStream.on("readable", function (this: fs.ReadStream) {
        let data;
        while (data = this.read()) {
            socket.write(data);
        }
    })
    inputStream.on("end", function () {
        socket.end();
    })
    socket.on("end", () => {
        fileTransferServer.close(() => { console.log("\nTransfer is done!") });
    })
})

const filePathArray: Array<string> = filePath.split("/");

const fileNameServer: Server = net.createServer((socket: Socket) => {
    socket.write (filePathArray[filePathArray.length-1]);
    socket.on("end", () => {
        fileNameServer.close(() => { console.log("\nSending file name is done!") });
    })
})


fileNameServer.listen(8001, 'localhost',()=>{

    fileTransferServer.listen(8000, 'localhost');
});
} catch (error) {
    console.log(error);
}
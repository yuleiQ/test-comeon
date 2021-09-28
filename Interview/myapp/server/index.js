const express = require('express');
const app = express();
const port = 8080;
const fs = require('fs');
const path = require('path');
const moment = require('moment');

app.get('/',(req,res) => {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Document</title>
    </head>
    <body>
        Http Cache Demo
        <script src="/demo.js"></script>
    </body>
    </html>`)
})

// Expires
app.get('/demo.js',(req, res)=>{
    let jsPath = path.resolve(__dirname,'./static/js/demo.js');
    let cont = fs.readFileSync(jsPath);
    res.setHeader('Expires', getGLNZ()) //2分钟
    res.end(cont)
})

// Cache-Control
// app.get('/demo.js',(req, res)=>{
//     let jsPath = path.resolve(__dirname,'./static/js/demo.js');
//     let cont = fs.readFileSync(jsPath);
//     res.setHeader('Cache-Control', 'public,max-age=120') //2分钟
//     res.end(cont)
// })

// Last-Modified
// app.get('/demo.js',(req, res)=>{
//     let jsPath = path.resolve(__dirname,'./static/js/demo.js')
//     let cont = fs.readFileSync(jsPath);
//     let status = fs.statSync(jsPath)

//     let lastModified = status.mtime.toUTCString();
//     console.log(lastModified, 'ssss')
//     if(lastModified === req.headers['if-modified-since']){
//         res.writeHead(304, 'Not Modified')
//         res.end()
//     } else {
//         res.setHeader('Cache-Control', 'public,max-age=5')
//         res.setHeader('Last-Modified', lastModified)
//         res.writeHead(200, 'OK')
//         res.end(cont)
//     }
// })

// ETag
// const md5 = require('md5');

// app.get('/demo.js',(req, res)=>{
//     let jsPath = path.resolve(__dirname,'./static/js/demo.js');
//     let cont = fs.readFileSync(jsPath);
//     let etag = md5(cont);

//     if(req.headers['if-none-match'] === etag){
//         res.writeHead(304, 'Not Modified');
//         res.end();
//     } else {
//         res.setHeader('ETag', etag);
//         res.writeHead(200, 'OK');
//         res.end(cont);
//     }
// })


function getGLNZ(){
    return moment().utc().add(2,'m').format('ddd, DD MMM YYYY HH:mm:ss')+' GMT';
}


app.listen(port,()=>{
    console.log(`listen on ${port}`)    
})

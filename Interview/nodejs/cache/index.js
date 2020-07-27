

function updateTime() {
    // 单例
    this.timer =  this.timer || setInterval(() => {
        this.time = new Date().toUTCString()
    }, 5000);
    return this.time;
}


const http = require('http');
http.createServer((req,res) => {
    const { url } = req;
    if( '/' === url) {
       res.end(`
            <html>
                html update ${updateTime()}
                <script src="main.js"></script>
            </html>
       `) 
    } else if (url === '/main.js') {
        const content = `document.writeln('<br>Js update time: ${updateTime()}')`   
        
        // 强缓存
        // Expires问题：客户端时间与服务端时间不一致。
        // res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toUTCString());

        // res.setHeader('Cache-control', 'max-age=20')
        

        // 协商缓存 浏览器和服务器间是否使用缓存做协商
        // 以时间为基础的协商缓存
        // res.setHeader('Cache-control', 'no-cache');
        // res.setHeader('last-modified', new Date().toUTCString());
        // // 判断
        // if (new Date(req.headers['if-modified-since']).getTime() + 3 * 1000 > Date.now()) {
        //     console.log('协商缓存命中')
        //     res.statusCode = 304;
        //     res.end();
        //     return;
        // }  

        // 以内容为基础的协商缓存
        const crypto = require('crypto');
        const hash = crypto.createHash('sha1').update(content).digest('hex')
        res.setHeader('Etag', hash);

        if (req.headers['if-none-match'] === hash) {
            console.log('Etag 协商缓存命中');
            res.statusCode = 304;
            res.end();
            return;
        }
        res.statusCode = 200;
        res.end(content);
    } else if (url === '/favicon.ico') {
        res.end('');
    }
}).listen(3000, () => {
   console.log('执行在3000端口');
});

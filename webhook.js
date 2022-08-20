let http = require('http');
let crypto = require('crypto');
let { spawn } = require('child_process'); // 开个子进程
let SECRET = '123456'; // 设置为和github中一致
function sign(body) {
  // github会把请求的内容用123456当密钥，使用下述同样的方法进行加密
  return `sha1=${crypto.createHmac('sha1', SECRET).update(body).digest('hex')}`
}
let server = http.createServer((req, res) => {
  console.log('zeenunew', req.method, req.url);
  if (req.method == 'POST' && req.url == '/webhook') {
    let buffers = [];
    // 拿到github发送的请求体
    // 设置事件名字为data,每次传过来的都是一个buffer
    req.on('data', (buffer) => {
      // 分次接收客户端传过来的请求提，把每次的buffer都存进buffers
      buffers.push(buffer);
    });
    // 触发end结束事件，回调函数拿到所有的buffer
    req.end('data', (buffer) => {
      let body = buffer.concat(buffers);
      let event = req.header['x-github-event']; // push事件的event == push
      // 验证签名
      let signature = req.header['x-hub-signature'];
      if (signature !== sign(body)) {
        return res.end('Not Allowed');
      }
      // 给github服务器发送一个回应，响应体是json格式
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true }));
      // 调用脚本进行自动部署
      if (event == 'push') {
        // 拿到push的是哪个仓库
        let payload = JSON.parse(body);
        // 为了不阻塞当前进程，开启子进程
        // 参数1：sh表示shell脚本 参数2：数组里面是仓库的名字
        // 表示我要执行这个shell脚本，会返回一个子进程
        let child = spawn('sh', [`./${payload.repository.name}.sh`]);
        // 监听子进程里面的日志,拿到数据流,每当子进程里面有输出的时候会往外抛，用shBuffers接收
        let shBuffers = [];
        child.stdout.on('data', function(shBuffer) {
          shBuffers.push(shBuffer);
        });
        // 拿到结果,合并成一个大的buffer
        child.stdout.on('end', function(shBuffer) {
          let log = shBuffer.concat(shBuffers);
          console.log(log);
        })
      }
    })
    // 给github服务器发送一个回应，响应体是json格式
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  } else {
    res.end('Not Found1')
  }
});

server.listen(4000, () => {
  console.log('webhook服务已经在4000端口上启动');
})
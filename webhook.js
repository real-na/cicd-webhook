let http = require('http');
let crypto = require('crypto');
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
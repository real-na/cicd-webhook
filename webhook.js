const { read } = require('fs');
let http = require('http');
let server = http.createServer((req, res) => {
  console.log('zeenunew', req.method, req.url);
  if (req.method === 'POST' && req.url === '/webhook') {
    // 给github服务器发送一个回应，响应体是json格式
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  } else {
    res.end('Not Found')
  }
});

server.listen(4000, () => {
  console.log('webhook服务已经在4000端口上启动');
})
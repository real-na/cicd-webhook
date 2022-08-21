const nodeemailer = require('nodemailer');
let transporter = nodeemailer.createTransport({
  // host: 'smtp.ethereal.email
  service: 'qq', // 使用了内置传输发送邮件
  port: 465, // SMTP端口
  secureConnection: true, // 使用了SSL
  auth: {
    user: 'youxiang@qq.com',
    pass: '设置的smtp授权码',
  }
});

function sendMail(message) {
  let mailOptions = {
    from: '"youxiang"<youxiang@qq.com>', //发送地址
    to: '接收的邮箱.com',
    subject: '部署通知', // 邮件主题
    html:message, // 内容
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}
module.exports = sendMail;
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToTest = require('html-to-text'); // used for converting all the html to a simple text

// we want something like Email(user, url).sendWelcome()

//creation of separate classes for mail handling
module.exports = class Email{
  constructor(user, url){
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `ajaz ahmed <${process.env.EMAIL_FROM}>`;
    // EMAIL_FROM = hello@seriman.io
    //to be able to send through sendgrid techniq(which is implemented here in production mode) we've to change the above email_from with the below one in config.env file
    // EMAIL_FROM = madou@mailsac.com 

  }

  //used to create different transport for different environments
  newTransport(){
    if(process.env.NODE_ENV == 'production'){
      //we'll implement sendGrid techniq for that case
      return nodemailer.createTransport({
        service: 'SendGrid', //we're sendgrid techn n we'll go for sendgrid service which is like gmail n we don't need to specify server n port those r explicitly undestand by nodemailer
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        },
        //this part of code is used to solve this error nodejs-error-self-signed-certificate-in-certificate-chain
        tls: {
          rejectUnauthorized: false
        }
      });
    }
    //else we'll go for nodemailer transporter
    return nodemailer.createTransport({
      //service: 'Gmail',  //type of email service used here is Gmail to not be used here bcs it public behavior n spam problem n we'll mailtrap designed for development email testing
      host: process.env.EMAIL_HOST, //receiving mail from nodemailer transporter
      port: process.env.EMAIL_PORT, 
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
      //this part of code is used to solve this error nodejs-error-self-signed-certificate-in-certificate-chain
      tls: {
          rejectUnauthorized: false
        }
    });
  }

  //send the actual email
  async send(template, subject){
    
    // 1) Rendere HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{  //${template} will be take value as the one passing pug template file
      //sending data to pug template
      firstName: this.firstName,
      url: this.url,
      subject
    }); //used to access email rendering template from pug n {__dirname} it's the location of the currently runing script
   
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      //subject: subject, //to be replaced as below
      subject,
      html,
      /* for email content msg we want only plaint simple text email insted of having the more formatted html emails for that we'll used a package html-to-text it has to be installed n it's used to convert the html content into a simple text done as below*/
      text: htmlToTest.fromString(html)
    };

    // 3) Create a Transport and send email
    
    await this.newTransport().sendMail(mailOptions); // we won't use only sendMail() here we wanna create !t(different) !t method according to the need here we'll used sendWelcome()
    
  }
  //for welcome template
  async sendWelcome(){
    await this.send('welcome', 'Welcome to the Elearnings Team'); //called above send() with the required arguments n msg:Welcome to the Ntours Family
  }
  //for passwordReset template
  async sendPasswordReset(){
    await this.send('passwordReset', 'Your password reset token (valid only for 10 minutes)'); //called above send() with the required arguments n msg:Your password reset token (valid only for 10 minutes)
  }
};

/*const sendEmail = async options => { //options here is: the email address where we want to send an email to,the subject line,the email content and some other stuff
  //We need to follow 3 steps in order to send emails with Nodemailer: 1st we need to create a transporter,2nd we need to define email option n the 3rd send the email with Nodemailer
    // 1) Create a transporter(is basically a service that will actually send the email bcs it's not node.js that will actually send the email itself n it is something like gmail)
  const transporter = nodemailer.createTransport({
    //service: 'Gmail',  //type of email service used here is Gmail to not be used here bcs it public behavior n spam problem n we'll mailtrap designed for development email testing
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, 
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    //this part of code is used to solve this error nodejs-error-self-signed-certificate-in-certificate-chain
    tls: {
        rejectUnauthorized: false
      }
    //then in our gmail account, we will actually have to activate something called less secure app option
    //Activate in gmail "less secure app" option
    //we'll used mailtrap service for our development email testing purposes bcs gmail is public n it maps our email as spam
    //For that we've to sign for mailtrap used for safe email testing staging n development 
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'ajaz ahmed <hello@ajaz.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:    //this one is used to convert above text field message to html
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions); //used to send the email n it's an async method
};*/
/*const msg = `Forgot your password? Submit a PATCH request with your new password`;
const v = sendEmail({
    email: 'ajaz@natours.io',
    subject: 'Your password reset token (valid for 10 min)',
    message:msg
  });
console.log(nodemailer);
console.log(v);*/

//module.exports = sendEmail;

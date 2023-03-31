const path = require('path');
const nodemailer = require('nodemailer');

const { ParseServer } = require('parse-server');
const {
  API_URL,
  PUBLIC_URL,
  MONGO_URI,
  PARSE_APP_NAME,
  PARSE_APP_ID,
  PARSE_FILE_KEY,
  PARSE_MASTER_KEY,
  PARSE_READONLY_MASTER_KEY,
  PARSE_SILENT,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SENDER
} = require('../config');
const cloud = require('../parse/cloud/main');

class ParseMiddelware {
  constructor(app) {
    this.app = app;
  }

  static start(options, parseCloudEvent) {
    return new Promise((resolve) => {
      let parseMiddelware;
      const parseOptions = Object.assign(options, {
        cloud: (Parse) => {
          cloud(Parse, parseCloudEvent);
        },
        serverStartComplete: () => {
          resolve(parseMiddelware);
        },
      });

      const app = new ParseServer(parseOptions);
      parseMiddelware = new ParseMiddelware(app);
    });
  }
}

module.exports = (parseCloudEvent) => {
  // Configure mail client
  // const customMail = require('customMail.js');
  // const customMailClient = customMail.configure({});
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  const emailAdapter = {
    module: 'parse-server-api-mail-adapter',
    options: {
      sender: SMTP_SENDER,
      templates: {
        // The template used by Parse Server to send an email for password
        // reset; this is a reserved template name.
        passwordResetEmail: {
          subjectPath: path.join(__dirname, 'templates/password_reset_email_subject.txt'),
          textPath: path.join(__dirname, 'templates/password_reset_email.txt'),
          htmlPath: path.join(__dirname, 'templates/password_reset_email.html')
        },
        // The template used by Parse Server to send an email for email
        // address verification; this is a reserved template name.
        verificationEmail: {
          subjectPath: path.join(__dirname, 'templates/verification_email_subject.txt'),
          textPath: path.join(__dirname, 'templates/verification_email.txt'),
          htmlPath: path.join(__dirname, 'templates/verification_email.html')
        }
      },
      // eslint-disable-next-line require-await
      apiCallback: async ({ payload }) => {
        try {
          await transporter.sendMail(payload)
          console.log('email sent');
        } catch (err) {
          console.log('error when sending a mail')
          console.error(err)
        }
      }
    }
  }

  return ParseMiddelware.start(
    {
      databaseURI: MONGO_URI,
      appId: PARSE_APP_ID,
      fileKey: PARSE_FILE_KEY,
      masterKey: PARSE_MASTER_KEY,
      readOnlyMasterKey: PARSE_READONLY_MASTER_KEY,
      appName: PARSE_APP_NAME,
      allowClientClassCreation: false,
      enableAnonymousUsers: false,
      maxLimit: 100,
      serverURL: `${API_URL}/parse`,
      publicServerURL: `${PUBLIC_URL}/parse`,
      silent: PARSE_SILENT,
      auth: {
        github: {
          id: GITHUB_CLIENT_ID,
          access_token: GITHUB_CLIENT_SECRET,
        },
      },
      directAccess: true,
      enforcePrivateUsers: true,
      verifyUserEmails: true,
      preventLoginWithUnverifiedEmail: false,
      emailAdapter
    },
    parseCloudEvent,
  );
}

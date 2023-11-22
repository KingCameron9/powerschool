const soap = require("strong-soap").soap;
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.getStudentData = onRequest(async (request, response) => {
  let inputs = JSON.parse(request.body);

  const username = inputs.username;
  const password = inputs.password;
  const url = inputs.url + "/pearson-rest/services/PublicPortalServiceJSON";

  const requestOptions = {
    auth: { user: "pearson", pass: "m0bApP5", sendImmediately: false },
  };

  const client = await new Promise((resolve, reject) => {
    soap.createClient(
      url + "?wsdl",
      { wsdl_options: requestOptions },
      function (err, client) {
        if (err) {
          reject(err);
        }
        resolve(client);
      },
    );
  });

  client.setEndpoint(url);

  const session = await new Promise((resolve, reject) => {
    client.loginToPublicPortal(
      { username: username, password: password },
      requestOptions,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result.return.userSessionVO);
      },
    );
  });

  const studentData = {
    userSessionVO: {
      userId: session.userId,
      serviceTicket: session.serviceTicket,
      serverInfo: {
        apiVersion: session.serverInfo.apiVersion,
      },
      serverCurrentTime: new Date(session.serverCurrentTime).toISOString(),
      userType: session.userType,
    },

    studentIDs: session.studentIDs,
    qil: {
      includes: "1",
    },
  };

  const student = await new Promise((resolve, reject) => {
    client.getStudentData(studentData, requestOptions, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(result.return);
    });
  });

  logger.info("Hello logs!", { structuredData: true });

  response.send(JSON.stringify(student.studentDataVOs[0]));
});

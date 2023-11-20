const soap = require("strong-soap").soap;

async function getAPI(url) {
  let client;

  const reqOptions = {
    auth: { user: "pearson", pass: "m0bApP5", sendImmediately: false },
  };

  await new Promise((resolve, reject) => {
    soap.createClient(url + "?wsdl", { wsdl_options: reqOptions }, (err, c) => {
      if (!c) {
        console.log("error: " + err);
      }
      client = c;
      resolve();
    });
  });

  client.setEndpoint(url);

  let session;

  // console.log(client);
  await new Promise((resolve, reject) => {
    client.loginToPublicPortal(
      { username: "cd25037", password: "Bella32" },
      reqOptions,
      (err, result) => {
        if (!result || !result.return) console.log(err);
        session = result.return.userSessionVO;
        resolve();
      },
    );
  });

  // console.log(session);

  let data = {
    userSessionVO: {
      userId: session.userID,
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

  client.getStudentData(data, reqOptions, (err, result) => {
    // console.log(result);
    console.log(err);
    // console.log(studentData.teachers);
  });

  // console.log(session);

  // client.loginToPublicPortal(
  //   { username: "cd25037", password: "Bella32" },
  //   reqOptions,
  //   (err, result) => {
  //     console.log(err);
  //   },
  // );
}

getAPI(
  "https://fccps.powerschool.com/pearson-rest/services/PublicPortalServiceJSON",
);

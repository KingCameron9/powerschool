const soap = require("strong-soap").soap;
const WSDL = soap.WSDL;

const fs = require("fs");
const jsonc = require("jsonc");

async function getAPI(url) {
  let start = new Date();
  let client;

  const reqOptions = {
    auth: { user: "pearson", pass: "m0bApP5", sendImmediately: false },
  };

  await new Promise((resolve, reject) => {
    WSDL.open(url + "?wsdl", { wsdl_options: reqOptions }, (error, wsdl) => {
      console.log(wsdl);
      reolve();
    });
  });

  await new Promise((resolve, reject) => {
    soap.createClient(url + "?wsdl", { wsdl_options: reqOptions }, (err, c) => {
      if (!c) {
        console.log("error: " + err);
      }
      client = c;
      resolve();
    });
  });
  console.log(typeof client);
  // client = jsonc.parse(jsonc.stringify(client));

  console.log("create client");
  console.log((new Date() - start) / 1000);

  client.setEndpoint(url);
  // fs.writeFile("./test.json", jsonc.stringify(client), () => {});

  console.log("set endpoint");
  console.log((new Date() - start) / 1000);

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

  console.log("login");
  console.log((new Date() - start) / 1000);
  // console.log(session);

  // console.log(session);
  //

  let data = {
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

  client.getStudentData(data, reqOptions, (err, result) => {
    var studentData = result.return.studentDataVOs[0];

    studentData.teachers.forEach((teacher) => {
      console.log(teacher.firstName);
    });

    console.log("get data");
    console.log((new Date() - start) / 1000);
    // console.log(err);
    // // console.log(studentData.teachers);
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
function safelyParseUnpredictableArray(arr) {
  if (!arr) return [];
  if (Array.isArray(arr)) return arr;
  return [arr];
}

getAPI(
  "https://fccps.powerschool.com/pearson-rest/services/PublicPortalServiceJSON",
);

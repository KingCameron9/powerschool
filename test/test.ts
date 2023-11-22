const res = await fetch(
  "http://127.0.0.1:5001/powerschool-37afb/us-central1/getStudentData",
  {
    method: "POST",
    body: JSON.stringify({
      url: "https://fccps.powerschool.com",
      username: "cd25037",
      password: "Bella32",
    }),
  },
);

const data = await res.json();

console.log(data.teachers);

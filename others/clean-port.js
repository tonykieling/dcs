const shell = require("shelljs");

const x = shell.exec("lsof -i :3456 | grep -i *:3456").split(" ").join("");

if (x != "") {
  let portNumber = "";
  for (let c = 0; c < 12; c += 1) {
    if (Number(x[c]) || x[c] == "0") {
      portNumber += x[c];
      // console.log("portNumber", x[c]);
    }
  }
  // console.log("x-->", x.split(" ").join(""));
  console.log(`KILLING process @ port ${portNumber}`);
  shell.exec(`kill -9 ${portNumber}`);
} else
  console.log("nothing")
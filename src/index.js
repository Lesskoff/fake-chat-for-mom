import "./styles.css";
// import anime from "animejs";
import data from "./data.json";
import axios from "axios";
import messSoundUrl from "../sounds/new_mess.mp3";
import statusSoundUrl from "../sounds/status_mess.mp3";

let prevName = "";
let colorList = {};
let subtitleArray = [];

const messAudio = new Audio(messSoundUrl);
const statusAudio = new Audio(messSoundUrl);
const playSound = audioObj => {
  if (audioObj) {
    audioObj.pause();
    audioObj.currentTime = 0;
  }
  audioObj.play();
};

const subtitle = document.getElementById("subtitle");
const app = document.getElementById("app");

const createMess = item => {
  return new Promise((resolve, reject) => {
    const randomDelay = Math.floor(5 + Math.random() * (35 + 1 - 5)) * 100; // from 500 to 3500
    setTimeout(() => {
      const block = document.createElement("div");
      let nameStr = !!item.name ? document.createElement("h2") : "";
      let messStr = !!item.mess ? document.createElement("span") : "";
      const randomColor =
        "#" + (0x9000000 + Math.random() * 0x777777).toString(16).substr(1, 6);
      // const randomColor =
      //   "#" + Math.floor(Math.random() * 16777215).toString(16);

      colorList[item.id] = colorList.hasOwnProperty(item.id)
        ? colorList[item.id]
        : randomColor;

      if (nameStr.length !== 0) {
        nameStr.style.color = colorList[item.id];
        nameStr.innerHTML = item.name;
      }

      if (messStr.length !== 0) messStr.innerHTML = item.mess;

      let time = new Date();
      let timeFormat = `${time.getHours()}:${
        time.getMinutes().toString().length === 1
          ? "0" + time.getMinutes()
          : time.getMinutes()
      }`;

      if (item.name === prevName) {
        nameStr = "";
        block.classList.add("same-mess");
      }

      block.classList.add(item.type === "mess" ? "mess" : "status");
      block.classList.add(item.id === "hero" ? "right" : "left");

      block.dataset.time = timeFormat;

      // block.innerHTML = `${nameStr}${messStr}`;
      if (nameStr.length !== 0) block.appendChild(nameStr);
      if (messStr.length !== 0) block.appendChild(messStr);

      if (item.name) playSound(messAudio);
      if (item.type.length !== 0 && item.type === "status")
        playSound(statusAudio);

      prevName = item.name;

      resolve(block);
    }, item.delay);
  });
};

const createList = async data => {
  for (const item of data) {
    const message = await createMess(item);
    app.insertAdjacentElement("beforeend", message);
    // message.scrollIntoView({ block: "nearest", behavior: "smooth" });
    app.scroll({
      top: app.clientHeight,
      behavior: "smooth"
    });
  }
};

// fill subtitle
data.forEach(el => {
  // debugger;
  if (subtitleArray.indexOf(el.name) < 0 && !!el.name)
    subtitleArray.push(el.name);
});
subtitle.innerText = subtitleArray.join(", ") + ", Вы";

// start messaging
createList(data).then(() => {
  // console.log("done");
})
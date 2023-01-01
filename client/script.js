import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector(`form`);
const cheatContainer = document.querySelector(`#chat_container`);

//IMPLEMENTING LOADING ANIMATION
let loadInterval;
function loader(element) {
  element.textContent = ``;
  loadInterval = setInterval(() => {
    element.textContent += `.`;
    if (element.textContent === `....`) {
      element.textContent = ``;
    }
  }, 300);
}

// implementing typing like a Human
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// Generating A unique id for a User and ai
function generateUniqueId() {
  const timestamp = Date.now();
  console.log(timestamp);
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}
console.log(generateUniqueId());
// implementing Chat strip
function chatStrip(isAl, value, uniqueId) {
  return `
        <div class="wrapper ${isAl && `ai`}">
        <div class= "chat">
        <div class= "profile">
        <img src="${isAl ? bot : user}" alt="${isAl ? "bot" : "user"}">
        </div>
        <div class= "message" id="${uniqueId}">${value}</div>
        </div>
        </div>
        `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // generate the user chat strip
  cheatContainer.innerHTML += chatStrip(false, data.get(`prompt`));

  form.reset();

  // bot chart strip
  const uniqueId = generateUniqueId();
  cheatContainer.innerHTML += chatStrip(true, " ", uniqueId);

  cheatContainer.scrollTop = cheatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // fetch data from server  -> bot's response
  const response = await fetch(`https://ai-coder.onrender.com`, {
      method: `POST`,
      headers:{
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({
        prompt: data.get(`prompt`)
      })
  })
  clearInterval(loadInterval)
  messageDiv.innerHTML = ``;
  if(response.ok){
    const data =  await response.json();
    // console.log(await response.json());
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData)
  }else{
    const err = await response.text();
    messageDiv.innerHTML = `Something went Wrong`;
    alert(err)
  }
};

form.addEventListener(`submit`, handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keycode === 13) {
    handleSubmit(e);
  }
});

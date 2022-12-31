import bot from  './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector(`form`);
const cheatContainer  = document.querySelector(`#chat_container`);

let loadInterval;
function loader(element){
    element.textContent=``;
    loadInterval = setInterval(() => {
        element.textContent += `.`;
        if ( element.textContent === `....`){
            element.textContent=``;
        }
    }, 300);
}


// implementing thinking e.g typing like a Human 
function typeText (element, text){
    let index = 0;
 
    let interval = setInterval(() => {
        if(element < text.length){
            element.innerHTML += text.chartAt(index);
            index++;
        }else{
            clearInterval(interval)
        }
    }, 20);
}

 // Generating A unique id for a User and ai
function generateUniqueId(){
    const timestamp = Date.now()
    const randomNumber = Math.random()
    const hexadecimalString = randomNumber.toString(16)
    return `id ${timestamp}-${hexadecimalString}`
}
console.log(generateUniqueId());
// implementing Chat strip
function chatStrip(isAl, value, uniqueId){
    return(
        `
        <div class="wrapper ${isAl && `ai`}">
        <div class= "chat">
        <div class= "profile">
        <img src="${isAl ? bot: user}" alt="${isAl ? 'bot': 'user'}">
        </div>
        <div class= "message" id="${uniqueId}">${value}</div>
        </div>
        </div>
        `
    )
}

const handleSubmit = async (e)=>{
    e.preventDefault();

    const data = new FormData(form)

    // generate the user chat strip
    cheatContainer.innerHTML += chatStrip(false, data.get(`prompt`) );

    form.reset();

    // bot chart strip
    const uniqueId = generateUniqueId();
    cheatContainer.innerHTML += chatStrip(true, " ", uniqueId);

    cheatContainer.scrollTop = cheatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId)

    loader(messageDiv)
}

form.addEventListener(`submit`, handleSubmit)
form.addEventListener('keyup', (e)=> {
    if (e.keycode === 13){
        handleSubmit(e)
    }
}) 
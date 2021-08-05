const clockContainer = document.querySelector(".status-bar__Clock"),
    clockDate = clockContainer.querySelector(".status-bar__Clock_Date"),
    clockTime = clockContainer.querySelector(".status-bar__Clock_Time");


function getTime() {
    const date = new Date();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const seconds = date.getSeconds()

    const month = date.getMonth()
    const day = date.getDay();
    const year = date.getUTCFullYear();
    clockDate.innerText = `${year}-${month + 1}-${day + 2}`;
    clockTime.innerText = `${hours}:${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

function init() {
    getTime();
    setInterval(getTime, 1000);
}

init();

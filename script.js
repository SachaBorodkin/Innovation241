function updateClockAndDate() {
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date');

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    dateElement.textContent = `${day}.${month}.${year}`;
}

setInterval(updateClockAndDate, 1000);
updateClockAndDate(); 


function calculateTimeToNextPause() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();

    const pauseTimes = [9 * 60 + 35, 14 * 60 + 45];

 
    let nextPauseMinutes = pauseTimes.find(time => time > currentMinutes);

    if (nextPauseMinutes === undefined) {
     
      nextPauseMinutes = pauseTimes[0] + 24 * 60;
    }

    let remainingMinutes = nextPauseMinutes - currentMinutes - 1;
    let remainingSeconds = 60 - currentSeconds;

    if (remainingSeconds === 60) {
      remainingMinutes++;
      remainingSeconds = 0;
    }

    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    document.getElementById("nextPause").textContent = 
      `Pause dans: ${hours} : ${minutes} : ${remainingSeconds}`;
  }
  setInterval(calculateTimeToNextPause, 1000);
  calculateTimeToNextPause();

   
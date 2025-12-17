
function timeUntilEndOfCourse() {
    const courseEndTimes = {
        'lundi': '15:45',
        'mardi': '17:25',
        'mercredi': '16:35',
        'jeudi': '16:35',
        'vendredi': '16:35',
    };
    
    const currentTime = new Date();
    const currentDay = currentTime.toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase();
  
    if (currentDay === 'samedi' || currentDay === 'dimanche') {
        document.getElementById("timer").innerText = "Il est weekend";
        return;
    }

   
    const courseEndStr = courseEndTimes[currentDay];
    if (courseEndStr) {
        const courseEndTime = new Date(currentTime);
        const [hours, minutes] = courseEndStr.split(':').map(Number);
        courseEndTime.setHours(hours, minutes, 0, 0); 

       
        let timeRemaining = courseEndTime - currentTime;

      
        if (timeRemaining < 0) {
            document.getElementById("timer").innerText = "Le cours est déjà terminé aujourd'hui.";
            return;
        }

       
        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);

       
        document.getElementById("timer").innerText = `Fin dans: ${hoursRemaining} : ${minutesRemaining} : ${secondsRemaining}`;
    } else {
        document.getElementById("timer").innerText = "Jour invalide.";
    }
}



setInterval(timeUntilEndOfCourse, 1000);
timeUntilEndOfCourse();
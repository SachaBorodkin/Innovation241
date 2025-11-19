let marksData = [];

function addInput() {
    const mark = parseFloat(document.getElementById('mark').value);
    const percentage = parseFloat(document.getElementById('percentage').value);

    if (isNaN(mark) || isNaN(percentage) || mark < 1 || mark > 6 || percentage < 0 || percentage > 100) {
        alert("Veuillez entrer des valeurs valides pour la note et le pourcentage.");
        return;
    }

    marksData.push({ mark, percentage });
    displayMarksTable();
    document.getElementById('mark').value = '';
    document.getElementById('percentage').value = '';
}

function displayMarksTable() {
    const tableBody = document.getElementById('marks-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    marksData.forEach(item => {
        const row = document.createElement('tr');
        const cellMark = document.createElement('td');
        const cellPercentage = document.createElement('td');
        
        cellMark.textContent = item.mark.toFixed(1);
        cellPercentage.textContent = item.percentage;

        row.appendChild(cellMark);
        row.appendChild(cellPercentage);
        tableBody.appendChild(row);
    });
}

function calculateFinalMark() {
    let totalMarks = 0;
    let totalWeight = 0;

    marksData.forEach(item => {
        totalMarks += item.mark * (item.percentage / 100);
        totalWeight += item.percentage;
    });

    if (totalWeight !== 100) {
        alert("La somme des pourcentages doit être égale à 100.");
        return;
    }

    const finalMark = totalMarks;
    document.getElementById('final-result').innerText = `Note Finale : ${finalMark.toFixed(2)}`;
}

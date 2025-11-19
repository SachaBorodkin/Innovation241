let marksData = [];

// Load data when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const user = getCurrentUser();
    if (user) {
        console.log(`Loading grades for ${user.username}`);
        try {
            let dbData;
            if (user.role === 'teacher') {
                // Teachers see everyone's data (Demo feature)
                dbData = await getAllData('grades');
                // Add a column for username in display if teacher? 
                // For now, we just load them all into the list
            } else {
                // Students only see their own
                dbData = await getDataByUser('grades', user.username);
            }
            
            if (dbData) {
                marksData = dbData;
                displayMarksTable();
                if(marksData.length > 0) calculateFinalMark();
            }
        } catch (e) {
            console.error("Failed to load grades", e);
        }
    } else {
        document.getElementById('final-result').innerText = "Connectez-vous pour sauvegarder vos notes.";
    }
});

async function addInput() {
    const user = getCurrentUser();
    
    const mark = parseFloat(document.getElementById('mark').value);
    const percentage = parseFloat(document.getElementById('percentage').value);

    if (isNaN(mark) || isNaN(percentage) || mark < 1 || mark > 6 || percentage < 0 || percentage > 100) {
        alert("Veuillez entrer des valeurs valides pour la note et le pourcentage.");
        return;
    }

    const newItem = { 
        mark, 
        percentage, 
        username: user ? user.username : 'guest' // Tag data with username
    };

    // Save to DB if logged in
    if (user) {
        try {
            const resultId = await addData('grades', newItem);
            newItem.id = resultId; // Save the ID assigned by DB
        } catch (e) {
            console.error("Save failed", e);
            alert("Erreur de sauvegarde");
        }
    }

    marksData.push(newItem);
    displayMarksTable();
    document.getElementById('mark').value = '';
    document.getElementById('percentage').value = '';
}

async function deleteItem(index) {
    const user = getCurrentUser();
    const item = marksData[index];

    if (user && item.id) {
        try {
            await deleteData('grades', item.id);
        } catch(e) {
            console.error(e);
        }
    }
    marksData.splice(index, 1);
    displayMarksTable();
}

function displayMarksTable() {
    const tableBody = document.getElementById('marks-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    marksData.forEach((item, index) => {
        const row = document.createElement('tr');
        const cellMark = document.createElement('td');
        const cellPercentage = document.createElement('td');
        const cellAction = document.createElement('td');
        
        cellMark.textContent = item.mark.toFixed(1);
        cellPercentage.textContent = item.percentage + '%';
        
        // Add user label for teachers
        const user = getCurrentUser();
        if(user && user.role === 'teacher') {
            cellMark.textContent += ` (${item.username})`;
        }

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.style.backgroundColor = '#ff4444';
        deleteBtn.style.padding = '5px 10px';
        deleteBtn.onclick = () => deleteItem(index);
        cellAction.appendChild(deleteBtn);

        row.appendChild(cellMark);
        row.appendChild(cellPercentage);
        row.appendChild(cellAction);
        tableBody.appendChild(row);
    });
    
    calculateFinalMark();
}

function calculateFinalMark() {
    let totalMarks = 0;
    let totalWeight = 0;

    marksData.forEach(item => {
        totalMarks += item.mark * (item.percentage / 100);
        totalWeight += item.percentage;
    });

    const resultDiv = document.getElementById('final-result');

    if (totalWeight === 0) {
        resultDiv.innerText = "Note Finale : -";
        return;
    }

    // If total weight isn't 100, we can still calculate a running average or warn
    if (Math.abs(totalWeight - 100) > 0.1) {
        const projected = (totalMarks / totalWeight) * 100; // Normalize to 100 if partial
        // Show warning but still show calc
        // resultDiv.innerText = `Note (Pondération ${totalWeight}%): ${totalMarks.toFixed(2)}`;
    }
    
    // Standard calculation assuming the user wants the sum
    // Adjust logic: Usually grade = Sum(mark * weight) / Sum(weights) if weights act as coefficients
    // Or if weights are portions of 100%, then just Sum(mark * weight/100).
    
    // Let's stick to simple accumulation:
    const finalMark = totalMarks;
    
    let displayText = `Note Finale : ${finalMark.toFixed(2)}`;
    if (totalWeight !== 100) {
        displayText += ` (Attention: Total % = ${totalWeight}%)`;
    }
    
    resultDiv.innerText = displayText;
}
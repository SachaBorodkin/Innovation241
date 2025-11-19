let totalPeriods = 0;
    let acquiredPeriods = 0;

    function addProject() {
      const projectName = document.getElementById('projectName').value;
      const periods = parseInt(document.getElementById('periods').value);
      const acquired = document.getElementById('acquired').value;

      if (!projectName || isNaN(periods) || periods <= 0) {
        alert("Veuillez remplir tous les champs correctement.");
        return;
      }

      const table = document.getElementById('projectTable').getElementsByTagName('tbody')[0];
      const newRow = table.insertRow();

      newRow.insertCell(0).textContent = projectName;
      newRow.insertCell(1).textContent = periods;
      newRow.insertCell(2).textContent = acquired;

      totalPeriods += periods;
      if (acquired === 'oui') {
        acquiredPeriods += periods;
      }

      document.getElementById('projectName').value = '';
      document.getElementById('periods').value = '';
      document.getElementById('acquired').value = 'oui';
    }

    function calculatePercentage() {
      if (totalPeriods === 0) {
        alert("Aucune période enregistrée.");
        return;
      }
      const percentage = (acquiredPeriods / totalPeriods) * 100;
      document.getElementById('result').textContent = `Pourcentage des périodes acquises : ${percentage.toFixed(2)}%`;
    }
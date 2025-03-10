document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/departments')
        .then(response => response.json())
        .then(data => {
            const departmentsContainer = document.getElementById('departments-list');
            departmentsContainer.innerHTML = data.map(department => `
                <p>
                    <strong>${department.Dept_Name}</strong> (ID: ${department.Dept_ID})
                    <button onclick="fetchSubjects(${department.Dept_ID})">View Subjects</button>
                </p>
            `).join('');
        })
        .catch(error => console.error('Error fetching departments:', error));
});

function fetchSubjects(deptId) {
    fetch(`http://localhost:3000/departments/${deptId}/subjects`)
        .then(response => response.json())
        .then(data => {
            const subjectsContainer = document.getElementById('subjects-list');
            subjectsContainer.innerHTML = data.map(subject => `
                <p><strong>${subject.Subject_Name}</strong> (ID: ${subject.Subject_ID})</p>
            `).join('');
        })
        .catch(error => console.error('Error fetching subjects:', error));
}

document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById('loginBtn');
    const userIcon = document.getElementById('userIcon');
    
    console.log('Admin logged in status:', localStorage.getItem('adminLoggedIn')); // Debugging line

    if (localStorage.getItem('adminLoggedIn') === 'true') {
        loginBtn.style.display = 'none';
        userIcon.style.display = 'flex';
    } else {
        loginBtn.style.display = 'block';
        userIcon.style.display = 'none';
    }
});


function fetchTopics(subjectId) {
    console.log("Fetching topics for Subject ID:", subjectId); // Debug log
    fetch(`http://localhost:3000/subjects/${subjectId}/topics`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched topics:", data); // Debug log
            const topicsList = data.map(topic => {
                return `<li><a href="${topic.Links}" target="_blank">${topic.Topic_name}</a></li>`;
            }).join('');
            const topicsContainer = document.querySelector('.topics ul');
            topicsContainer.innerHTML = topicsList; // Replace the topics list with the fetched topics
        })
        .catch(error => {
            console.error('Error fetching topics:', error);
            alert('Failed to fetch topics. Please check the server or try again later.');
        });
}


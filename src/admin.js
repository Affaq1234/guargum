import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBgzRisv5h1DU-pHf2AFlXOxFuAXOXMtcA",
    authDomain: "test123-7d539.firebaseapp.com",
    databaseURL: "https://test123-7d539-default-rtdb.firebaseio.com",
    projectId: "test123-7d539",
    storageBucket: "test123-7d539.appspot.com",
    messagingSenderId: "419338836985",
    appId: "1:419338836985:web:0e224b673b965a85c3fb28"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database, 'submissions');

function updateLastUpdatedTime() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = 
        `Last updated: ${now.toLocaleTimeString()}`;
}

function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    
    try {
        const date = new Date(timestamp);
        const monthNames = ["January", "February", "March", "April", "May", "June",
                           "July", "August", "September", "October", "November", "December"];
        
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        const hours12 = hours % 12 || 12;
        
        return `${monthNames[monthIndex]} ${day}, ${year}, ${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    } catch (e) {
        return timestamp;
    }
}

function fetchData() {
    const tableBody = document.getElementById('tableBody');
    
    onValue(dbRef, (snapshot) => {
        tableBody.innerHTML = '';
        const data = snapshot.val();
        
        if (data) {
            Object.keys(data).forEach((key) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${data[key].fullname || ''}</td>
                    <td>${data[key].email || ''}</td>
                    <td>${data[key].subject || ''}</td>
                    <td>${data[key].message || ''}</td>
                    <td>${formatTimestamp(data[key].timestamp)}</td>
                    <td><button onclick="deleteRecord('${key}')">Delete</button></td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="6">No records found</td></tr>';
        }
        
        updateLastUpdatedTime();
    }, {
        onlyOnce: true 
    });
}

function exportToCSV() {
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            alert('No data to export');
            return;
        }

        // CSV header
        let csv = 'Full Name,Email,Subject,Message,Timestamp\n';
        
        // Add data rows
        Object.keys(data).forEach((key) => {
            const record = data[key];
            csv += `"${record.fullname || ''}","${record.email || ''}","${record.subject || ''}",` +
                   `"${record.message || ''}","${formatTimestamp(record.timestamp)}"\n`;
        });

        // Create download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `submissions_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, {
        onlyOnce: true
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    setInterval(fetchData, 20000);
    
    // Add export button event listener
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
});

window.deleteRecord = (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
        remove(ref(database, `submissions/${id}`))
            .then(() => {
                alert('Record deleted successfully');
                fetchData(); 
            })
            .catch((error) => alert('Error deleting record: ' + error.message));
    }
};
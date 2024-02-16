
eel.expose(go_to)
function go_to(url) {window.location.replace(url);};

function login(url) {
    userName = document.getElementById('userNameField').value;
    Password = document.getElementById('passwordField').value;
    eel.connect(url, userName, Password)
};

function listUsers(userList) {
    let list = document.getElementById('userList');
    list.innerHTML = "";

    userList.forEach(user => {
        let listItem = document.createElement("div");
        listItem.classList.add("listItem");
        listItem.onclick = function() { eel.accountSummary(user[0])(displayAccountSummary)};

        let name = document.createElement("h3");
        name.innerText = user[1];
        
        let username = document.createElement("p");
        username.innerText = user[0];

        listItem.appendChild(name);
        listItem.appendChild(username);

        list.appendChild(listItem);
    });
};

function setProfilePicture(response) {
    console.log(response);
    if (response == 200) {
        document.getElementById('profilePicture').setAttribute('src', 'assets/temp-pp.png');
    }
    
};

function displayAccountSummary(summaryInfo) {
    let accountWindow = document.getElementById('accountWindow');

    document.getElementById('name').innerHTML = `<span>Name:</span><span>${summaryInfo[0]}</span>`;
    document.getElementById('username').innerHTML = `<span>Username:</span><span>${summaryInfo[1]}</span>`;
    document.getElementById('DOB').innerHTML = `<span>Date of Birth:</span><span>${summaryInfo[2]}</span>`;
    document.getElementById('address').innerHTML = `<span>address:</span><span>${summaryInfo[3] + summaryInfo[4] + summaryInfo[5] + summaryInfo[6]}</span>`;
    document.getElementById('contactInfo').innerHTML = `<div><span>Telephone</span><span>${summaryInfo[8]}</span></div><div><span>Mobile</span><span>${summaryInfo[7]}</span></div><div><span>Email</span><span>${summaryInfo[9]}</span></div>`;
    document.getElementById('title').innerHTML = `<span>Title:</span><span>${summaryInfo[10]}</span>`;
    document.getElementById('affiliation').innerHTML = `<span>Affiliation:</span><span>${summaryInfo[11]}</span>`;
    document.getElementById('lastSeen').innerHTML = `<span>Last Seen:</span><span>${summaryInfo[12]}</span>`;
    document.getElementById('userHistory').innerText = summaryInfo[13];

    document.getElementById('profilePicture').setAttribute('src', 'assets/profile-anon.png');
    eel.scrapeProfilePic(summaryInfo[1])(setProfilePicture);

    accountWindow.dataset.hasContent = true;
    document.getElementById('terminal').insertAdjacentHTML('beforeend', `<p>Viewed Account information for ${summaryInfo[0]}</p>`);

}
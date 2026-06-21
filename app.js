const API = "https://script.google.com/macros/s/AKfycbwCj6RY16RSMdfoliTbom3kTxjEPittuU45JVyLcm-8i7ekfwl067yMTTG5l1KV_fInxg/exec";

let currentCitizen = null;

/* ==========================
   CONNEXION
========================== */
function formatDate(date){

    const d = new Date(date);

    if(isNaN(d))
        return date;

    return d.toLocaleDateString("fr-FR");
}

async function login() {

    const username =
        document.getElementById("user").value;

    const password =
        document.getElementById("pass").value;

    const response = await fetch(API, {
        method: "POST",
        body: JSON.stringify({
            action: "login",
            username: username,
            password: password
        })
    });

    const data = await response.json();

    if (data.success) {

        document.getElementById("login")
            .style.display = "none";

        document.getElementById("app")
            .style.display = "block";

    } else {

        alert("Identifiants incorrects.");

    }
}

/* ==========================
   RECHERCHE CITOYEN
========================== */

async function searchCitizen() {

    const nom =
        document.getElementById("search").value;

    const response = await fetch(
        API +
        "?action=citoyen&nom=" +
        encodeURIComponent(nom)
    );

    const data = await response.json();

    if (!data.length) {

        document.getElementById("content").innerHTML =
            "<h2>Aucun citoyen trouvé.</h2>";

        return;
    }

    currentCitizen = data[0];

    const casierResponse = await fetch(
        API +
        "?action=casier&id=" +
        currentCitizen[0]
    );

    const casier =
        await casierResponse.json();

    let casierHTML = "";

    for (let ligne of casier) {

        casierHTML += `
        <tr>
            <td>${formatDate(ligne[2])}</td>
            <td>${ligne[3]}</td>
            <td>${ligne[4]}</td>
            <td>${ligne[5]}</td>
            <td>${ligne[6]}</td>
        </tr>
        `;
    }

    document.getElementById("content").innerHTML = `

        <div class="card">

            ${
                currentCitizen[10]
                ? `<img src="${currentCitizen[10]}" class="photoCitizen">`
                : ""
            }

            <h2>
                ${currentCitizen[2]}
                ${currentCitizen[1]}
            </h2>

            <p>Date de naissance : ${formatDate(currentCitizen[3])}</p>
            <p>Lieu de naissance : ${currentCitizen[4]}</p>
            <p>Taille : ${currentCitizen[5]} cm</p>
            <p>Poids : ${currentCitizen[6]} kg</p>
            <p>Yeux : ${currentCitizen[7]}</p>
            <p>Cheveux : ${currentCitizen[8]}</p>
            <p>Métier : ${currentCitizen[9]}</p>

            <button onclick="editCitizen()">
                Modifier
            </button>

            <button onclick="showCasierForm()">
                Ajouter au casier
            </button>

        </div>

        <div class="card">

            <h2>Casier judiciaire</h2>

            <table>

                <tr>
                    <th>Date</th>
                    <th>Agent</th>
                    <th>Type</th>
                    <th>Motif</th>
                    <th>Payé</th>
                </tr>

                ${casierHTML}

            </table>

        </div>
    `;
}

/* ==========================
   NOUVEAU CITOYEN
========================== */

function newCitizen() {

    document.getElementById("content").innerHTML = `

    <div class="card">

        <h2>Nouveau citoyen</h2>

        <input id="nom" placeholder="Nom">
        <input id="prenom" placeholder="Prénom">
        <input id="naissance" type="date">

        <input id="lieu" placeholder="Lieu de naissance">

        <input id="taille" placeholder="Taille (cm)">
        <input id="poids" placeholder="Poids (kg)">

        <input id="yeux" placeholder="Couleur des yeux">
        <input id="cheveux" placeholder="Couleur des cheveux">

        <input id="metier" placeholder="Métier">

        <input id="photo" placeholder="Lien de la photo">

        <button onclick="saveCitizen()">
            Enregistrer
        </button>

    </div>
    `;
}

async function saveCitizen() {

    await fetch(API, {
        method: "POST",
        body: JSON.stringify({

            action: "addCitizen",

            nom: nom.value,
            prenom: prenom.value,
            naissance: naissance.value,
            lieu: lieu.value,
            taille: taille.value,
            poids: poids.value,
            yeux: yeux.value,
            cheveux: cheveux.value,
            metier: metier.value,
            photo: photo.value

        })
    });

    alert("Citoyen ajouté.");
}

/* ==========================
   MODIFIER CITOYEN
========================== */

function editCitizen() {

    document.getElementById("content")
        .innerHTML = `

        <div class="card">

            <h2>Modifier</h2>

            <input id="nom"
             value="${currentCitizen[1]}">

            <input id="prenom"
             value="${currentCitizen[2]}">

            <input id="naissance"
             value="${currentCitizen[3]}">

            <input id="lieu"
             value="${currentCitizen[4]}">

            <input id="taille"
             value="${currentCitizen[5]}">

            <input id="poids"
             value="${currentCitizen[6]}">

            <input id="yeux"
             value="${currentCitizen[7]}">

            <input id="cheveux"
             value="${currentCitizen[8]}">

            <input id="metier"
             value="${currentCitizen[9]}">

            <button onclick="saveEdit()">
                Sauvegarder
            </button>

        </div>
    `;
}

async function saveEdit() {

    await fetch(API, {
        method: "POST",
        body: JSON.stringify({

            action: "updateCitizen",

            id: currentCitizen[0],

            nom: nom.value,
            prenom: prenom.value,
            naissance: naissance.value,
            lieu: lieu.value,
            taille: taille.value,
            poids: poids.value,
            yeux: yeux.value,
            cheveux: cheveux.value,
            metier: metier.value
        })
    });

    alert("Modification enregistrée.");
}

/* ==========================
   AJOUT CASIER
========================== */

function showCasierForm() {

    document.getElementById("content")
        .innerHTML += `

        <div class="card">

            <h2>Nouvelle infraction</h2>

            <input id="date"
             placeholder="Date">

            <input id="agent"
             placeholder="Agent">

            <input id="type"
             placeholder="Type">

            <input id="motif"
             placeholder="Motif">

            <input id="paye"
             placeholder="Oui / Non">

            <button onclick="saveCasier()">
                Ajouter
            </button>

        </div>
    `;
}

async function saveCasier() {

    await fetch(API, {
        method: "POST",
        body: JSON.stringify({

            action: "addCasier",

            citoyenId: currentCitizen[0],

            date: date.value,
            agent: agent.value,
            type: type.value,
            motif: motif.value,
            paye: paye.value
        })
    });

    alert("Ajouté au casier.");
}

/* ==========================
   MEMBRES
========================== */

async function loadMembers() {

    const response =
        await fetch(API + "?action=membres");

    const data =
        await response.json();

    let html = `
    <div class="card">
    <h2>Membres</h2>
    <table>
    <tr>
    <th>Nom</th>
    <th>Division</th>
    </tr>
    `;

    for (let i = 1; i < data.length; i++) {

        html += `
        <tr>
            <td>${data[i][1]}</td>
            <td>${data[i][2]}</td>
        </tr>
        `;
    }

    html += "</table></div>";

    document.getElementById("content")
        .innerHTML = html;
}

/* ==========================
   PLAINTES
========================== */

async function loadPlaintes() {

    const response =
        await fetch(API + "?action=plaintes");

    const data =
        await response.json();

    let html = `
    <div class="card">
    <h2>Plaintes</h2>
    <table>

    <tr>
        <th>Nom</th>
        <th>Téléphone</th>
        <th>Plainte</th>
    </tr>
    `;

    for (let i = 1; i < data.length; i++) {

        html += `
        <tr>
            <td>${data[i][1]}</td>
            <td>${data[i][3]}</td>
            <td>${data[i][4]}</td>
        </tr>
        `;
    }

    html += "</table></div>";

    document.getElementById("content")
        .innerHTML = html;
}

/* ==========================
   PLAINTE CIVILE
========================== */

async function sendComplaint() {

    await fetch(API, {

        method: "POST",

        body: JSON.stringify({

            action: "plainte",

            nom: nom.value,
            prenom: prenom.value,
            telephone: tel.value,
            plainte: plainte.value
        })
    });

    alert("Plainte envoyée.");
}
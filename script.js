const bouton = document.getElementById('btn');
const inputVille = document.getElementById('ville');
const conteneur = document.getElementById('conteneur');

const API_KEY = "5269bab56c5c48964f24b00eac803e35";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

async function getMeteo(ville) {
    const url = `${API_URL}?q=${ville}&units=metric&lang=fr&appid=${API_KEY}`;
    const reponse = await fetch(url);
    const donnees = await reponse.json();
    return donnees;
}

function afficherCarte(ville, meteo) {
    const condition = meteo.weather[0].main;
    const carte = document.createElement('div');
    carte.className = 'weather-card';
    const temp = Math.round(meteo.main.temp);
    const vent = meteo.wind.speed;
    const humidite = meteo.main.humidity;
    const ressenti = Math.round(meteo.main.feels_like);
    const description = meteo.weather[0].description;
    
    carte.innerHTML = `
        <button class="delete-btn" onclick="this.parentElement.remove(); sauvegarderVilles();">✕</button>
        <h3>${ville}</h3>
        <p style="font-size: 2rem;">${temp}°C</p>
        <p>${description}</p>
        <p>🌡️ Ressenti : ${ressenti}°C</p>
        <p>💨 Vent : ${vent} km/h</p>
        <p>💧 Humidité : ${humidite}%</p>
    `;
    
    conteneur.appendChild(carte);
    changerFond(condition);
    sauvegarderVilles();
}

function changerFond(condition) {
    if(condition === "Clear") {
        document.body.style.background = "linear-gradient(135deg, #f7b733, #fc4a1a)";
    }
    else if(condition === "Clouds") {
        document.body.style.background = "linear-gradient(135deg, #757f9a, #d7dde8)";
    }
    else if(condition === "Rain") {
        document.body.style.background = "linear-gradient(135deg, #2c3e50, #3498db)";
    }
    else {
        document.body.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
    }
    document.body.style.transition = "background 0.8s ease";
}

function sauvegarderVilles() {
    const villes = [];
    document.querySelectorAll('.weather-card h3').forEach(card => {
        villes.push(card.innerText);
    });
    localStorage.setItem('villes', JSON.stringify(villes));
}

async function chargerVilles() {
    const villes = JSON.parse(localStorage.getItem('villes') || '[]');
    for(const ville of villes) {
        const meteo = await getMeteo(ville);
        if(meteo.main) afficherCarte(ville, meteo);
    }
}

bouton.addEventListener('click', async function() {
    const ville = inputVille.value;
    if(ville === "") {
        alert("Entrez un nom de ville");
        return;
    }
    const meteo = await getMeteo(ville);
    if(meteo.main) {
        afficherCarte(ville, meteo);
        inputVille.value = "";
    } else {
        alert("Ville non trouvée");
    }
});

const btnClear = document.getElementById('btnClear');
if(btnClear) {
    btnClear.addEventListener('click', function() {
        conteneur.innerHTML = '';
        localStorage.removeItem('villes');
    });
}

chargerVilles();

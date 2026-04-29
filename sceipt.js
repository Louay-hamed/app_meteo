// Récupérer les éléments HTML
const bouton = document.getElementById('btn');
const inputVille = document.getElementById('ville');
const conteneur = document.getElementById('conteneur');

// VOTRE CLÉ API
const API_KEY = "5269bab56c5c48964f24b00eac803e35";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Fonction pour récupérer la météo
async function getMeteo(ville) {
    const url = `${API_URL}?q=${ville}&units=metric&lang=fr&appid=${API_KEY}`;
    const reponse = await fetch(url);
    const donnees = await reponse.json();
    return donnees;
}

// Fonction pour afficher une carte
function afficherCarte(ville, meteo) {
    // Récupérer la condition (IMPORTANT : l'orthographe exacte)
    const condition = meteo.weather[0].main;  // Clear, Clouds, Rain, etc.
    
    // AFFICHER DANS LA CONSOLE POUR VÉRIFIER
    console.log("Condition reçue : " + condition);
    const carte = document.createElement('div');
    carte.className = 'weather-card';
    const temp = Math.round(meteo.main.temp);
    const vent = meteo.wind.speed;
    const humidite = meteo.main.humidity;
    const ressenti = Math.round(meteo.main.feels_like);
    const description = meteo.weather[0].description;
    
    carte.innerHTML = `
        <button class="delete-btn" onclick="this.parentElement.remove()">✕</button>
        <h3>${ville}</h3>
        <p style="font-size: 2rem;">${temp}°C</p>
        <p>${description}</p>
        <p>🌡️ Ressenti : ${ressenti}°C</p>
        <p>💨 Vent : ${vent} km/h</p>
        <p>💧 Humidité : ${humidite}%</p>
    `;
    
    conteneur.appendChild(carte);
    changerFond(condition);
}

// Quand on clique sur le bouton
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
// Fonction pour changer le fond selon la météo
function changerFond(condition) {
    // Condition météo (valeurs exactes de l'API)
    if(condition === "Clear") {
        document.body.style.background = "linear-gradient(135deg, #f7b733, #fc4a1a)";
    }
    else if(condition === "Clouds") {
        document.body.style.background = "linear-gradient(135deg, #757f9a, #d7dde8)";
    }
    else if(condition === "Rain") {
        document.body.style.background = "linear-gradient(135deg, #2c3e50, #3498db)";
    }
    else if(condition === "Drizzle") {
        document.body.style.background = "linear-gradient(135deg, #4b6cb7, #182848)";
    }
    else if(condition === "Thunderstorm") {
        document.body.style.background = "linear-gradient(135deg, #141e30, #243b55)";
    }
    else if(condition === "Snow") {
        document.body.style.background = "linear-gradient(135deg, #e6e9f0, #a5b8d3)";
    }
    else {
        document.body.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
    }
    
    // Animation fluide
    document.body.style.transition = "background 0.8s ease";
}
const apiKey = "226286cea1c4a292a5cbc03661c4c6f3";


const searchBox = document.querySelector(".search input");
const searchBtn = document.getElementById("searchBtn");
const weatherDiv = document.querySelector(".weather");
const errorDiv = document.querySelector(".error");
const favBtn = document.querySelector(".fav-btn");
const favList = document.getElementById("favList");

let currentCity = "";

/* FETCH WEATHER */
async function checkWeather(city){
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

    if(res.status == 404){
        errorDiv.style.display="block";
        weatherDiv.style.display="none";
        return;
    }

    const data = await res.json();
    currentCity = data.name;

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp)+"°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity+"%";
    document.querySelector(".wind").innerHTML = data.wind.speed+" km/h";

    /* ICON */
    let condition = data.weather[0].main;
    let emoji = "🌤️";

    if(condition=="Clear") emoji="☀️";
    else if(condition=="Clouds") emoji="☁️";
    else if(condition=="Rain") emoji="🌧️";
    else if(condition=="Drizzle") emoji="🌦️";
    else if(condition=="Mist") emoji="🌫️";

    document.querySelector(".weather-emoji").innerHTML = emoji;

    /* SUN */
    document.querySelector(".sunrise").innerHTML =
        "SUNRISE 🌅 "+new Date(data.sys.sunrise*1000).toLocaleTimeString();

    document.querySelector(".sunset").innerHTML =
        "SUNSET 🌇 "+new Date(data.sys.sunset*1000).toLocaleTimeString();

    /* SUGGESTION */
    let temp = data.main.temp;
    let suggestion = temp>35 ? "🔥 Stay hydrated!" :
                     temp<15 ? "🥶 Wear warm clothes!" :
                     "🌤️ Enjoy weather!";

    document.getElementById("suggestion").innerText = suggestion;

    weatherDiv.style.display="block";
    errorDiv.style.display="none";
}

/* SEARCH */
searchBtn.onclick = ()=>checkWeather(searchBox.value);
searchBox.addEventListener("keypress",e=>{
    if(e.key==="Enter") checkWeather(searchBox.value);
});

/* FAVORITES */
favBtn.onclick = ()=>{
    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    if(!cities.includes(currentCity)){
        cities.push(currentCity);
        localStorage.setItem("cities",JSON.stringify(cities));
        loadFav();
    }
};

function loadFav(){
    favList.innerHTML = "";
    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    cities.forEach(city=>{
        let li = document.createElement("li");

        li.innerHTML = `
            ${city} 
            <span class="remove-btn">❌</span>
        `;

        // Click city → show weather
        li.onclick = () => checkWeather(city);

        // Click ❌ → remove
        li.querySelector(".remove-btn").onclick = (e) => {
            e.stopPropagation(); 
            removeFavorite(city);
        };

        favList.appendChild(li);
    });
}
loadFav();
function removeFavorite(city){
    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    cities = cities.filter(c => c !== city);

    localStorage.setItem("cities", JSON.stringify(cities));

    loadFav();
}
/* GPS */
document.getElementById("locationBtn").onclick=()=>{
    navigator.geolocation.getCurrentPosition(async pos=>{
        const {latitude,longitude}=pos.coords;
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        checkWeather(data.name);
    });
};

/* DARK MODE */
document.getElementById("toggleMode").onclick=()=>{
    document.body.classList.toggle("light");
};
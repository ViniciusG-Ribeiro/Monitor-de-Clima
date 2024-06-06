let cityValue = document.getElementById('city')
let searchCityButton = document.getElementById('searchButton')
const keyApi = "f2fb8ad721038a2a64920ffc9e0c90a2"
let contentHtml = document.getElementById('content')
let localHtml = document.getElementById('local')

searchCityButton.addEventListener('click',function(){
    if(cityValue.value == ""){
        alert("Insert with a city!")
    }else searchCity()
})

async function searchCity(){
    const geocodingCity = await Geocoding(cityValue.value);
    const WeatherData = await currentWeatherData(geocodingCity[0].lat,geocodingCity[0].lon)
    const kmWind = await conversaoVelocidadeVento(WeatherData.wind.speed)
    const urlWatherIcon = await watherIcon(WeatherData.weather[0].icon)

    await buildingHtml(geocodingCity[0].name, geocodingCity[0].state, geocodingCity[0].country, WeatherData.weather[0].description, urlWatherIcon, Math.round(WeatherData.main.temp), WeatherData.main.humidity, Math.round(WeatherData.main.feels_like), Math.round(WeatherData.main.pressure), WeatherData.wind.speed, kmWind)
}



async function Geocoding(city){
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${keyApi}`
    const resposta = await fetch(url)
    const repostaJson = resposta.json()
    // console.log(repostaJson)
    return await repostaJson
}

async function currentWeatherData(latitude,longitude){
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${keyApi}&units=metric&lang=pt_br`
    const resposta = await fetch(url)
    const repostaJson = resposta.json()
    // console.log(repostaJson)
    return await repostaJson
}

async function conversaoVelocidadeVento(ms){
    const conversao = Math.round(ms * 3.6)
    return conversao
}

async function watherIcon(icon){
    const url = `https://openweathermap.org/img/wn/${icon}@2x.png`
    return url
}

async function buildingHtml(nameCity,nameState,nameCountry,description,icon,temperature,humidity,feelsLike,pressure,speedWindMs,speedWindKM){

    localHtml.textContent = `${nameCity} - ${nameState} - ${nameCountry}`

    function limpaItens(){
        contentHtml.innerHTML = '';
    }

    limpaItens()

    // funções para adicionar os itens
    function adicionarItem(nomePropriedade, valor) {
        const novoElemento = document.createElement('h3');
        if(nomePropriedade == ""){
            novoElemento.textContent = `${valor}`;
        }else{
            novoElemento.textContent = `${nomePropriedade}: ${valor}`;
        }
        contentHtml.appendChild(novoElemento);
    }

    const descriptionHtml = document.createElement('h3');
    descriptionHtml.textContent = description
    contentHtml.appendChild(descriptionHtml)

    const iconHtml = document.createElement('img');
    iconHtml.src = icon
    iconHtml.classList.add("wather-icon")
    contentHtml.appendChild(iconHtml)

    
    // Valor da Temperatura
    adicionarItem('Temperatura', temperature);
    
     // Valor da umidade
    adicionarItem('Umidade', `${humidity}%`);

    adicionarItem('Sens.Térmica', feelsLike);

    adicionarItem('Pressão', `${pressure} hpa`);
    
     // Valor da velocidade do vento em metros por segundo
    adicionarItem('Vel.Vento', `${speedWindMs} M/s`);
    
    // Valor da velocidade do vento em quilômetros por hora
    adicionarItem('', `${speedWindKM} KM/h`);

}
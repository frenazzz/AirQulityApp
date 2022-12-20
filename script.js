document.addEventListener('DOMContentLoaded', () => {
    const searchCityInput = document.querySelector('.search-area__input');
    const getDataBtn = document.querySelector('.search-area__btn--search');
    const getGeolocationBtn = document.querySelector('.search-area__btn--geolocation');
    const city = document.querySelector('.search-area__city');
    const searchErrorText = document.querySelector('.search-area__error-text');
    const airQualityValue = document.querySelector('.search-area__aqi-value');
    const aqiLink = document.querySelector('.search-area__aqi-link');
    const pm25Value = document.querySelector('.data__pm25');
    const pm10Value = document.querySelector('.data__pm10');
    const co2Value = document.querySelector('.data__co2');
    const nh3Value = document.querySelector('.data__nh3');
    const noValue = document.querySelector('.data__no');
    const no2Value = document.querySelector('.data__no2');
    const o3Value = document.querySelector('.data__o3');
    const so2Value = document.querySelector('.data__so2');

    const geoCoordinatesLink = 'https://api.openweathermap.org/data/2.5/weather?q=';
    const apiKey = '&appid=807633ef3afec7e816b53ccd84cc123f';
    const dataUnits = '&units=metric';
    const airPolutionLink = 'http://api.openweathermap.org/data/2.5/air_pollution?';

    const getGeoCoordinatesData = () => {
        let geoCoordinatesData = geoCoordinatesLink + searchCityInput.value + apiKey + dataUnits;
        const handleErr = response => {
            if (!response.ok) {
                throw new Error(response.status) 
            }
            return response.json();
        }
        fetch(geoCoordinatesData)
            .then(handleErr)
            .then(data1 => {
                const {
                    coord: {
                        lat,
                        lon
                    },
                    name,
                    sys: {
                    }
                } = data1;
                city.textContent = name;
                searchErrorText.textContent = '';
                let getAirPollutionData2 = `${airPolutionLink}lat=${lat}&lon=${lon}${apiKey}`;
                return fetch(getAirPollutionData2)
                    .then(handleErr)
                    .then(data2 => {
                        const {
                            list: [{
                                components: {
                                    co,
                                    nh3,
                                    no,
                                    no2,
                                    o3,
                                    pm2_5,
                                    pm10,
                                    so2
                                },
                                main: {
                                    aqi
                                }
                            }]
                        } = data2;
                        aqiLink.style.display = 'block';
                        searchErrorText.textContent = '';
                        airQualityValue.textContent = `AQI: ${aqi}`;
                        pm25Value.textContent = pm2_5;
                        pm10Value.textContent = pm10;
                        co2Value.textContent = co;
                        nh3Value.textContent = nh3;
                        noValue.textContent = no;
                        no2Value.textContent = no2;
                        o3Value.textContent = o3;
                        so2Value.textContent = so2;
                    })
                    .catch(error => {
                        console.error(error);
                        searchErrorText.textContent = 'Nie udało się pobrać danych'
                    });
            })
            .catch(error => {
                console.error(error);
                searchErrorText.textContent = 'Nie udało się pobrać danych';
            });

    }
    const checkInputValue = () => {
        if (!/^[a-ząćęłńóśźżA-ZĄĆĘŁŃÓŚŹŻ]+$/.test(searchCityInput.value.trim())) {
            searchErrorText.textContent = 'Wpisz poprawną nazwę';
        } else {
            getGeoCoordinatesData()
            searchErrorText.textContent = '';
        }
    }
    const getDataByKeyup = e => {
        if (e.keyCode === 13) {
            getGeoCoordinatesData();
        }
    }

    function getLocation() {

        if (navigator.geolocation) {
            const options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
            navigator.geolocation.getCurrentPosition(getLocationSuccess, getLocationError, options);
        } else {
            searchErrorText.textContent = 'Twoja przeglądarka nie wspiera geolokalizacji.';
        }
        function getLocationSuccess({
            coords: {
                latitude,
                longitude
            }
        }) {
            return fetch(`${airPolutionLink}lat=${latitude}&lon=${longitude}${apiKey}`)
                .then(response => {
                    if(!response.ok){
                        throw new Error(response.status);
                    }
                    return response.json();
                })
                .then(data3 => {
                    const {
                        list: [{
                            components: {
                                co,
                                nh3,
                                no,
                                no2,
                                o3,
                                pm2_5,
                                pm10,
                                so2
                            },
                            main: {
                                aqi
                            }
                        }]
                    } = data3;
                    city.textContent = 'Dane dla Twojej lokalizacji: '
                    aqiLink.style.display = 'block';
                    searchErrorText.textContent = '';
                    airQualityValue.textContent = `AQI: ${aqi}`;
                    pm25Value.textContent = pm2_5;
                    pm10Value.textContent = pm10;
                    co2Value.textContent = co;
                    nh3Value.textContent = nh3;
                    noValue.textContent = no;
                    no2Value.textContent = no2;
                    o3Value.textContent = o3;
                    so2Value.textContent = so2;

                })
                .catch(error => {
                    console.error(error);
                    searchErrorText.textContent = 'Nie udało się pobrać danych';
                });
        }
        function getLocationError(positionError) {
            switch (positionError.code) {
                case positionError.TIMEOUT:
                    console.warn("The request to get user location has aborted as it has taken too long.");
                    searchErrorText.textContent = 'Uzyskanie lokalizacji trwało zbyt długo.'
                    break;
                case positionError.POSITION_UNAVAILABLE:
                    console.warn("Location information is not available.");
                    searchErrorText.textContent = 'Informacje o lokalizacji są niedostepne.'
                    break;
                case positionError.PERMISSION_DENIED:
                    console.warn("Permission to share location information has been denied!");
                    searchErrorText.textContent = 'Brak zezwolenia na dostęp do lokalizacji, sprawdź ustawienia przeglądarki.'
                    break;
                default:
                    console.warn("An unknown error occurred.");
                    searchErrorText.textContent = 'Wystąpił niezidentyfikowany błąd.';
            }
            console.log('get location error');
            console.log(positionError);
        }
    }

    getDataBtn.addEventListener('click', checkInputValue); 
    searchCityInput.addEventListener('keyup', getDataByKeyup); 
    getGeolocationBtn.addEventListener('click', getLocation);
});
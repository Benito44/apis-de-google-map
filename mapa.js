let gMaps;    // Mapa Google Maps
let gMark;    // Marcador Institut
// Crear marcador de Google Maps
function crearMarcador(latitut, longitut, text) {
    return new google.maps.Marker(
        {
            position: {lat: latitut, lng: longitut},    // Latitut i longitut
            title: text                                 // Text del "tooltip"
        });
}

let gMarks = [];    // Array de marcadores

// Posar un marcador en el mapa
function marcarSaPa(latitud, longitud, descr) {
    // Crear marcador
    const marker = crearMarcador(latitud, longitud, descr);
    // Situar-lo en el mapa
    marker.setMap(gMaps);
    // Agregar el marcador al array
    gMarks.push(marker);
}
// Crear mapa Google Maps
function crearMapa() {
    gMaps = new google.maps.Map(
        document.getElementById('mapa'),    // Element on dibuixar el mapa
        {
            center: {lat:  42.707864851 , lng:  -73.734167655 },    // Latitut i longitut del centre del mapa
            zoom: 6                          // Ampliació
        });

    marcarSaPa(41.6781,2.78065);

}
function limpiarMarcadores() {
    gMarks.forEach(marker => {
        marker.setMap(null);
    });
    gMarks = [];
}
window.crearMapa = crearMapa;    // Necessari si s'utilitzen mòduls

const url1 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct CEMID';
const url2 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct CemeteryName';
const url3 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct MailingAddressStreet';
const url4 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct CityTownName';

async function cargarDireccionesCorreo() {
    try {
        const response = await fetch(url3);
        const data = await response.json();

        const selectMailing = document.getElementById('MailingAddressStreet')

        selectMailing.innerHTML = '<option value="">Selecciona una direcció</option>';

        data.forEach(item => {
            const mailingAddress = item.MailingAddressStreet;
            const option = document.createElement('option');
            option.value = mailingAddress;
            option.textContent = mailingAddress;
            selectMailing.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las direcciones de correo:', error);
    }
}

window.addEventListener('load', cargarDireccionesCorreo);

async function fetchDataConcurrently(cemid, cemetery, mailing, TownName) {
    try {
        let queryString = "";

        if (cemid || cemetery || mailing || TownName) {
            const queryParams = [];

            if (cemid) queryParams.push(`CEMID="${cemid}"`);
            if (cemetery) queryParams.push(`CemeteryName="${cemetery}"`);
            if (mailing) queryParams.push(`MailingAddressStreet="${mailing}"`);
            if (TownName) queryParams.push(`CityTownName="${TownName}"`);

            queryString = "WHERE " + queryParams.join(" AND ");
        }

        const url = `https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct CEMID, CemeteryName, MailingAddressStreet, CityTownName, Latitude, Longitude ${queryString}`;
        
        const response = await fetch(url);
        const data = await response.json();

        let tableHTML = "";
        limpiarMarcadores();
        if (data.length > 0) {
            data.forEach(item => {
                const { CEMID, CemeteryName, MailingAddressStreet, CityTownName, Latitude, Longitude } = item;
                tableHTML += `<tr><td>${CEMID}</td><td>${CemeteryName}</td><td>${MailingAddressStreet}</td><td>${CityTownName}</td></tr>`;
                if (Latitude && Longitude) {
                    marcarSaPa(parseFloat(Latitude), parseFloat(Longitude),CemeteryName);
                }
            });

        } else {
            alert("No s'han trobat registres amb els criteris de cerca proporcionats.");
        }

        const contenidorTaula = document.getElementById('taulaResultats');
        contenidorTaula.innerHTML = tableHTML;
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}



document.addEventListener('DOMContentLoaded',function() {
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const cemid = document.getElementById('cemidInput').value.trim();
    const cemetery = document.getElementById('CemeteryName').value.trim();
    const mailing = document.getElementById('MailingAddressStreet').value.trim();
    const TownName = document.getElementById('CityTownName').value.trim();
    fetchDataConcurrently(cemid,cemetery,mailing,TownName);
});

let table = new DataTable('#myTable');
});
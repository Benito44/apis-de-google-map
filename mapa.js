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
// Función para cargar las direcciones de correo electrónico disponibles
async function cargarDireccionesCorreo() {
    try {
        const response = await fetch(url3);
        const data = await response.json();

        const selectMailing = document.getElementById('MailingAddressStreet');
        // Limpiar opciones anteriores
        selectMailing.innerHTML = '<option value="">Selecciona una dirección de correo</option>';

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

// Llamar a la función para cargar las direcciones de correo al cargar la página
window.addEventListener('load', cargarDireccionesCorreo);

async function fetchDataConcurrently(cemid, cemetery, mailing, TownName) {
    try {
        const queryParams = [];
        if (cemid) queryParams.push(`CEMID="${cemid}"`);
        if (cemetery) queryParams.push(`CemeteryName="${cemetery}"`);
        if (mailing) queryParams.push(`MailingAddressStreet="${mailing}"`);
        if (TownName) {queryParams.push(`CityTownName="${TownName}"`) } else { TownName = '';};

        const queryString = queryParams.join(" AND ");

        const url = `https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct CEMID, CemeteryName, MailingAddressStreet, CityTownName, Latitude, Longitude WHERE ${queryString}`;
        
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
            alert("No se encontraron registros con los criterios de búsqueda proporcionados.");
        }

        const tableContainer = document.getElementById('resultTableBody');
        tableContainer.innerHTML = tableHTML;
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}


// Manejar el envío del formulario
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que se envíe el formulario
    const cemid = document.getElementById('cemidInput').value.trim();
    const cemetery = document.getElementById('CemeteryName').value.trim();
    const mailing = document.getElementById('MailingAddressStreet').value.trim();
    const TownName = document.getElementById('CityTownName').value.trim();
    fetchDataConcurrently(cemid,cemetery,mailing,TownName);
});
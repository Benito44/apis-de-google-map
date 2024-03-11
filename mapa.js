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
    if (descr == null){
        descr = "Nada";
    }
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
            zoom: 6                            // Ampliació
        });

    marcarSaPa(41.6781,2.78065);

}

window.crearMapa = crearMapa;    // Necessari si s'utilitzen mòduls

const url1 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct CEMID';
const url2 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct CemeteryName';
const url3 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct MailingAddressStreet';
const url4 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct VillageMuniCode';

async function fetchDataConcurrently(cemid, cemetery, mailing, village) {
    try {
        const queryParams = [];
        if (cemid) queryParams.push(`CEMID="${cemid}"`);
        if (cemetery) queryParams.push(`CemeteryName="${cemetery}"`);
        if (mailing) queryParams.push(`MailingAddressStreet="${mailing}"`);
        if (village) queryParams.push(`VillageMuniCode="${village}"`);

        const queryString = queryParams.join(" AND ");

        const url = `https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct CEMID, CemeteryName, MailingAddressStreet, VillageMuniCode, Latitude, Longitude WHERE ${queryString}`;
        
        const response = await fetch(url);
        const data = await response.json();

        let tableHTML = "";
        if (data.length > 0) {
            data.forEach(item => {
                const { CEMID, CemeteryName, MailingAddressStreet, VillageMuniCode, Latitude, Longitude } = item;
                tableHTML += `<tr><td>${CEMID}</td><td>${CemeteryName}</td><td>${MailingAddressStreet}</td><td>${VillageMuniCode}</td></tr>`;
                if (Latitude && Longitude) {
                    marcarSaPa(parseFloat(Latitude), parseFloat(Longitude),CemeteryName);
                }
            });
        } else {
            alert("No se encontraron registros con los criterios de búsqueda proporcionados.");
        }

        const tableContainer = document.getElementById('tableContainer');
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
    const village = document.getElementById('VillageMuniCode').value.trim();
    fetchDataConcurrently(cemid,cemetery,mailing,village);
});
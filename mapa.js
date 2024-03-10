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

// Posar el marcador de l'institut en el mapa
function marcarSaPa(latitud, longitud) {
    // Esborrar marcador (si ja estava posat)
    if (gMark != null) gMark.setMap(null);
    // Crear marcador
    gMark = crearMarcador(latitud, longitud, "Institut Sa Palomera\nAula 2, Cicle DAW2");
    // Situar-lo en el mapa
    gMark.setMap(gMaps);
}

// Crear mapa Google Maps
function crearMapa() {
    gMaps = new google.maps.Map(
        document.getElementById('mapa'),    // Element on dibuixar el mapa
        {
            center: {lat: 41.82, lng: 1.7},    // Latitut i longitut del centre del mapa
            zoom: 8                            // Ampliació
        });

    marcarSaPa(41.6781,2.78065);
    //marcarSaPa(41.6783,22.78065);
}

window.crearMapa = crearMapa;    // Necessari si s'utilitzen mòduls

const url1 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct CEMID';
const url2 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct CemeteryName';
const url3 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct MailingAddressStreet';
const url4 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct VillageMuniCode';
async function fetchDataConcurrently(cemid,cemetery,mailing,village) {
    try {
        const [response1, response2, response3, response4] = await Promise.all([
            fetch(url1).then(response => response.json()),
            fetch(url2).then(response => response.json()),
            fetch(url3).then(response => response.json()),
            fetch(url4).then(response => response.json())
        ]);

        // Guardar los datos de cada respuesta en variables
        const data1 = response1.map(item => item.CEMID);
        const data2 = response2.map(item => item.CemeteryName);
        const data3 = response3.map(item => item.MailingAddressStreet);
        const data4 = response4.map(item => item.VillageMuniCode);

        // Buscar el índice correspondiente al CEMID especificado
        const index = data1.indexOf(cemid);
        let tableHTML = "";
        if (index !== -1) {
            const cemidValue = data1[index] !== undefined ? data1[index] : "";
            const cemeteryNameValue = data2[index] !== undefined ? data2[index] : "";
            const mailingAddressValue = data3[index] !== undefined ? data3[index] : "";
            const villageMuniCodeValue = data4[index] !== undefined ? data4[index] : "";
            tableHTML = `<tr><td>${cemidValue}</td><td>${cemeteryNameValue}</td><td>${mailingAddressValue}</td><td>${villageMuniCodeValue}</td></tr>`;
        } else {
            alert("No s'ha trobat cap registre amb aquestes dades");
        }

        // Agregar la nueva fila a la tabla HTML
        const tableContainer = document.getElementById('tableContainer');
        const newRow = tableContainer.insertRow(-1);
        newRow.innerHTML = tableHTML;

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
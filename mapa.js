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




async function fetchDataSequentially() {
    const startTime = Date.now();

    try {
        const response1 = await fetch(url1,{method:"GET"}).then(response1 => response1.json());
        const response2 = await fetch(url2,{method:"GET"}).then(response2 => response2.json());
        const response3 = await fetch(url3,{method:"GET"}).then(response3 => response3.json());
        const response4 = await fetch(url4,{method:"GET"}).then(response4 => response4.json());

        
         function selectsResultats(nom, response){
            console.log(nom);
            let variable = document.getElementById(nom);
            for (let i = 0; i < response.length; i++){
                const option = document.createElement("option");
                option.text = response[i].nom;
                variable.appendChild(option);
        
            }
        }
/*
        let variable = document.getElementById("borough_name");
        for (let i = 0; i < response1.length; i++){
            const option = document.createElement("option");
            option.text = response1[i].borough_name;
            variable.appendChild(option);
    
        }
*/
               
                selectsResultats("borough_name",response1);

                 /*selectsResultats("public_space_open_space");
                selectsResultats("public_space_open_space_name");
                selectsResultats("provider");
                */

        const endTime = Date.now();
        console.log('Datos obtenidos secuencialmente:');
        console.log('Datos de borough_name:', response1);
        console.log('Datos de public_space_open_space:', response2);
        console.log('Datos de public_space_open_space_name:', response3);
        console.log('Datos de provider:', response4);
        console.log('Tiempo transcurrido (milisegundos):', endTime - startTime);
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}
const url1 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct CEMID';
const url2 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct CemeteryName';
const url3 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct MailingAddressStreet';
const url4 = 'https://data.ny.gov/resource/bvve-d2q8.json?$query=select distinct VillageMuniCode';

async function fetchDataConcurrently() {
    const startTime = Date.now();

    try {
        const [response1, response2, response3, response4] = await Promise.allSettled([
            fetch(url1,{method:"GET"}).then(response1 => response1.json()),
            fetch(url2,{method:"GET"}).then(response2 => response2.json()),
            fetch(url3,{method:"GET"}).then(response3 => response3.json()),
            fetch(url4,{method:"GET"}).then(response4 => response4.json())
        ]);

        const endTime = Date.now();
        console.log('Datos obtenidos simultáneamente:');
        console.log('Datos de CEMID:', response1);
        console.log('Datos de CemeteryName:', response2);
        console.log('Datos de MailingAddressStreet:', response3);
        console.log('Datos de VillageMuniCode:', response4);
        console.log('Tiempo transcurrido (milisegundos):', endTime - startTime);
        
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

// Ejecutar las funciones para obtener los datos
fetchDataSequentially();
fetchDataConcurrently();

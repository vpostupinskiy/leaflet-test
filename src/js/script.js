(function (){

    // Initialize map
    let map = L.map('map').setView([59.95, 30.3], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

    const input = document.getElementById('file');
    input.addEventListener('change', (event) => {
       const filelist = event.target.files;
       for (let file of filelist){
            file.text().then(csv => {
                drawMarkers(parseCSVText(csv));
            })
        }
    });

    function parseCSVText(csv) {
        return csv
            .split('\n')
            .map((elem) => {
                return elem.split(';')
            })
            .filter(elem => {
                return elem[0] >= 1001 && elem[0] <= 1021
            })
    }

    function drawMarkers(arrPoints){
        const markers = [];
        const latlngs = [];
        arrPoints.map(point => {
            let latlng = [+point[7] , +point[6]];
            let title = point[5];
            latlngs.push(latlng);
            markers.push(L.marker(latlng).bindPopup(title).openPopup());
        });
        let polyline = L.polyline(latlngs, {color: 'yellow'});
        L.layerGroup([...markers])
            .addLayer(polyline)
            .addTo(map);
    }

}());


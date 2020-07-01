(function (){

    // Initialize map
    let map = L.map('map').setView([30, 60], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

    const input = document.getElementById('file');
    input.addEventListener('change', (event) => {
       const filelist = event.target.files;
       for (let file of filelist){
            file.text().then(csv => {
                drawMarkers(parseCSVText(csv));
                console.log(parseCSVText(csv))
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
            let latlng = [+point[6] , +point[7]];
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


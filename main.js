
window.fetch('https://json-server.burlingtoncodeacademy.now.sh/restaurants')
    .then(data => data.json())
    .then((jsonObj) => {

        const target = findElement();
        const restList = createParent();
        const items = makeListItems(jsonObj);
        const locales = getMainMapAddrs(jsonObj);
        console.log(locales);

        addChildrenToParent(items, restList);
        addListToBody(restList, target);

        for (const item of locales) {
            const latLng = getCoords(item.addr);
            item.coords = latLng;
        }
        console.log(items);
        console.log(typeof items);
        console.log(locales);
        addClicks();

        // for (const item of locales) {
        //     item.latLng = [getCoords(item.addr)];
        // }
        // console.log(locales);

        drawMainMap(locales);



        return undefined;

    });






function findElement() {
    // find list location
    const target = document.getElementById('restText');
    return target;
}

function createParent() {
    // create the parent of the list items
    const restList = document.createElement('ul');
    return restList;
}

function makeListItems(json) {
    // for each item in the JSON, make a list item
    const items = json.map((postData) => {
        const listItem = document.createElement('button');
        listItem.textContent = `${postData.name}`;
        listItem.setAttribute('class', 'listBtn');
        listItem.setAttribute('id', `${postData.id}`);
        const linkItem = document.createElement('li');

        linkItem.appendChild(listItem);
        return linkItem;
    });
    return items;
}

function addChildrenToParent(posts, restList) {
    // Add each post list item to the parent ol element
    posts.forEach(post => {

        restList.appendChild(post);
    });
};

function addListToBody(restList, target) {
    //Add parent list to body element
    target.appendChild(restList);
}

function getMainMapAddrs(json) {

    const addrs = json.map((postData) => {
        const id = `${postData.id}`;
        const addr = `${postData.address}`;
        const local = {};
        local.id = id;
        local.addr = addr;
        return local;
    });
    return addrs;
}

async function drawMainMap(addrList) {
    let map = L.map('main-map').setView([44.4781994, -73.2126357],15);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    for await (const ad of addrList) {
        const latArr = await getCoords(ad.addr);

        console.log({latArr});
        let { lat, lon } = latArr;
        console.log({lat})
        console.log({lon})
        latsLongs.push(latArr)
        let mark = L.marker([lat, lon]).addTo(map);
    }

    // addrList.forEach((ad) => {
    //     const latArr = await getCoords(ad.addr);

    //     console.log({latArr});
    //     let { lat, lon } = latArr;
    //     console.log({lat})
    //     console.log({lon})
    //     let mark = L.marker([lat, lon]).addTo(map);
    //     return mark;
    // })


}

function addClicks() {
    const listOfFood = document.getElementsByClassName('listBtn');
    for (let food of listOfFood) {
        food.addEventListener('click', function (f) {
            showItem(this.id);
        });

    }

}

async function getCoords(addr) {

    let urlAddress = encodeURIComponent(addr);

    const coordObj = {};

    let coords = await fetch(`https://nominatim.openstreetmap.org/search/?q=${urlAddress}&format=json`)
        .then(data => data.json())
        .then(addrObj => {
            coordObj.lat = parseFloat(addrObj[0].lat)
            coordObj.lng = parseFloat(addrObj[0].lon)
            console.log(coordObj);
            return {lat: coordObj.lat, lon: coordObj.lng};

        })
        return coords;
}

function showItem(passedId) {
    //Gather chosen elements
    const preview = document.getElementById('detail-modal');
    // const choice = document.getElementById(passedId);
    const close = document.getElementsByClassName('x-out');


    // When button is clicked, display modal with choice data populated

    fetch('https://json-server.burlingtoncodeacademy.now.sh/restaurants/' + passedId)
        .then(data => data.json())
        .then((choiceObj) => {
            const dHead = document.getElementById('detail-head');
            const dTel = document.getElementById('detail-tel');
            const dAddr = document.getElementById('detail-addr');
            const dHours = document.getElementById('detail-hours');
            const dWeb = document.getElementById('detail-website');
            const dMap = document.getElementById('detail-map');


            // console.log(mapSpot);
            // console.log(mapSpot[0]);
            // mapCoords = L.latLng(mapSpot);
            // console.log(mapCoords);
            dHead.textContent = `${choiceObj.name}`;
            dTel.textContent = `${choiceObj.phone}`;
            dAddr.textContent = `${choiceObj.address}`;
            dHours.textContent = `${choiceObj.hours}`;
            dWeb.textContent = `${choiceObj.website}`;

            const mapCoords = getCoords(`${choiceObj.address}`);
            console.log({mapCoords});
            detailMap(mapCoords);

        });



    preview.style.display = 'block';

    // When x-out span is clicked, close the preview
    close.onclick = function () {
        preview.style.display = "none";
    };
    //When clicks outside of preview, close the preview
    window.onclick = function (event) {
        if (event.target === preview) {
            preview.style.display = "none";
        };
    }

}

function detailMap(coords) {
    console.log('coords: ', coords);
    console.log('coords lat: ', coords.lat)
    console.log('coords lng: ', coords.lng)
    // coords[0] and coords[1] should be coords.lat and coords.lng
    let dMap = L.map('detail-map').setView(L.latLng(coords.lat, coords.lng), 12);

    dMap.invalidateSize();

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(dMap);
}



window.fetch('https://json-server.burlingtoncodeacademy.now.sh/restaurants')
    .then(data => data.json())
    .then((jsonObj) => {

        const target = findElement();
        const restList = createParent();
        const items = makeListItems(jsonObj);

        addChildrenToParent(items, restList);
        addListToBody(restList, target);

        console.log(items);
        console.log(typeof items);

        addClicks(); 
        

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
    // for each post in the JSON, make a list item
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

function addClicks () {
    const listOfFood = document.getElementsByClassName('listBtn');
    for (let food of listOfFood) {
        food.addEventListener('click', function (f) {
                 showItem(this.id);
        });
      
    }
   
}

// function getChoice () {
//     item.id === 
// }

function showItem(passedId) {
    //Gather chosen elements
    const preview = document.getElementById('detail-modal');
    const choice = document.getElementById(passedId);
    const close = document.getElementsByClassName('x-out');


    // When button is clicked, display modal with choice data populated
window.fetch('https://json-server.burlingtoncodeacademy.now.sh/restaurants/' + passedId)
        .then(data => data.json())
        .then((choiceObj) => {
            const dHead = document.getElementById('detail-head');
            const dTel = document.getElementById('detail-tel');
            const dHours = document.getElementById('detail-hours');
            const dWeb = document.getElementById('detail-website');

            dHead.textContent = `${choiceObj.name}`;
            dTel.textContent = `${choiceObj.address}`;
            dHours.textContent = `${choiceObj.phone}`;
            dWeb.textContent = `${choiceObj.website}`;

            
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
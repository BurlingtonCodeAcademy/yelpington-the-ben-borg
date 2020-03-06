
window.fetch('https://json-server.burlingtoncodeacademy.now.sh/restaurants')
    .then(data => data.json())
    .then((jsonObj) => {

        const target = findElement();
        const restList = createParent();
        const items = makeListItems(jsonObj);

        addChildrenToParent(items, restList);
        addListToBody(restList, target);

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
            const listItem = document.createElement('a');
            listItem.textContent = `${postData.name}`;
            listItem.setAttribute('href', `/${postData.id}`);
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
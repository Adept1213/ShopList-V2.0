let store = [
    {id : 1, name : 'Banana', count : '1', price: '65', type: 'needBuy', }, 
    {id : 2, name : 'Fruit', count : '0.8', price: '80', type: 'needBuy',},
    {id : 3, name : 'Bread', count : '3', price: '34', type: 'needBuy',},
    {id : 4, name : 'Milk', count : '2', price: '54', type: 'needBuy', },  
]


let totalCost = obj => obj.count * obj.price;
function updateTotalCost (node, obj) {
    node.parentElement.lastElementChild.textContent = totalCost (obj)
}
function clearTable () {
    let children = table.children;
    for (let i = 1; i < children.length; ) children[i].remove();
}


// show headTotalCost headTotalPrice
function showTotalCostPrice (obj, elemCost, elemPrice) {
    let price = 0;
    let cost = 0;
    for (let key of obj) {
        price += totalCost (key);
        key.type == 'bought' ? cost += totalCost (key) : null;
    }
    elemPrice.textContent = price;
    elemCost.textContent = cost;
}



// create new tr
buttonAdd.addEventListener ('click', addNewProduct);
function addNewProduct () {
    let id = store.length == 0 ?  1 : store[store.length - 1].id + 1;
    let newProduct = {id : id, name : '', count : '', price : '', type : 'needBuy'};
    store.push (newProduct);
    render();
};



//render for store
function render () {
    clearTable();
    for (let key of store) tr(key);
    showTotalCostPrice (store, headTotalCost, headTotalPrice)
    console.log (store)
};
function tr (obj) {
    let className = null;
    obj.type == 'bought' ? className = 'bought' : className = '';
    let tr = `
    <tr data-id=${obj.id} class="${className}">
        <td class="name" tabindex='1' >${obj.name}</td>
        <td class="count" tabindex='1'>${obj.count}</td>
        <td class="price" tabindex='1'>${obj.price}</td>
        <td class="totalCost" tabindex='1'>${totalCost(obj)}</td>
    </tr>`
    table.insertAdjacentHTML ('beforeend', tr);
};



// make writeable
table.addEventListener ('click', makeWriteable);

function makeWriteable (event) {
    let target = event.target;
    if (target.tagName != 'TD' || target.className == 'totalCost') return;
    replaceWithInput (target); 
}
function replaceWithInput (target) {
    target.outerHTML = `<input id='input' value='${target.textContent}' class='${target.className}' oninput='changeInput()'>`;
    let tdInput = document.getElementById ('input');
    tdInput.selectionStart = tdInput.value.length;
    tdInput.className != 'name' ? tdInput.setAttribute ('type', 'number') : null; 
    tdInput.focus()  
    tdInput.addEventListener ('blur', () => replaceWithTd (tdInput));
} 
function replaceWithTd (target) {
    target.outerHTML = `<td tabindex='1' class='${target.className}'>${target.value}</td> `;
}



// //byu bought
table.addEventListener ('pointerdown', byu)
function  byu (event) {
    if (event.target.tagName != 'TD' && event.target.tagName != 'INPUT'  ) return;

    let target = event.target.parentElement;
    let start = event.clientX;

    target.className != 'bought' ?
        target.addEventListener ('pointermove',  moveRight ) : 
        target.addEventListener ('pointermove',  moveLeft );
    
    document.addEventListener ('pointerup', removeEventListeners )

    function removeEventListeners () {
        target.removeEventListener('pointermove', moveRight);
        target.removeEventListener('pointermove', moveLeft);

        target.className != 'bought' ? 
            target.style.backgroundColor =  'white' :
            target.removeAttribute ('style');
    }

    function moveRight (e) {
        target.style.background = `rgb(255, ${255 - (e.clientX - start)}, ${255 - (e.clientX - start)})`;
        if (e.clientX > (start + 150)) setColor ();          
    }

    function moveLeft (e) {
        target.style.background = `rgb(255, ${0 + (start - e.clientX)}, ${0 + (start - e.clientX)})`; 
        if (e.clientX < (start - 150)) setColor(); 
    }           
        
    function setColor () {
        target.removeAttribute ('style');
        target.classList.toggle ('bought');
        console.log (store.find ( item => item.id == target.dataset.id).type)
        target.className == '' ? store.find ( item => item.id == target.dataset.id).type = 'needBuy' : store.find ( item => item.id == target.dataset.id).type = 'bought' ;
        showTotalCostPrice (store, headTotalCost, headTotalPrice);
        let e = new Event ('pointerup');
        document.dispatchEvent (e);
    }
}



//if change input change state and update totalCost
function changeInput () {
    let input = document.getElementById ('input');
    let id = input.parentElement.dataset.id;
    let name = input.className;

    for (let key of store ) {   
        if (key.id == id) {
            changeStore (id, name, input.value);
            updateTotalCost (input, key);
            showTotalCostPrice (store, headTotalCost, headTotalPrice)
        }
    }    
}
function changeStore (id, name, value) {
    for (let key of store) key.id == id ? key[name] = value : null;
}



//delete
document.addEventListener ('pointerdown', deleteTR);
function deleteTR (event) {
    let target = event.target;
    let interval;
    let delay = 1000;

    if (target.tagName == 'TD') {
        interval = setTimeout ( () => {
            let conf = confirm (`Are you sure want delete ${target.parentElement.firstElementChild.textContent}? `);
            if (conf == true) {
                for (let i = 0; i < store.length; i++) {
                    if (store[i].id == target.parentNode.dataset.id) store.splice(i, 1);
                }
                render()
            }
        }, delay)          
    }

    // delete timer if merely click
    document.addEventListener ('pointerup', () => clearTimeout (interval), {once : true})
        
    
}

 


render ();
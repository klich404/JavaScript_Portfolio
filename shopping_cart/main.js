const db = {
    methods: {
        find: (id) => {
            return db.items.find((item) => item.id == id);
        },
        remove: (items) => {
            items.forEach(item => {
                const product = db.methods.find(item.id);
                product.qty = product.qty - item.qty;
            });

            console.log(db);
        },
    },
    items: [
        {
            id: 0,
            title: 'GeForce RTX 3070',
            price: 350,
            qty: 10
        },
        {
            id: 1,
            title: 'GeForce RTX 3080 Ti',
            price: 800,
            qty: 5
        },
        {
            id: 2,
            title: 'GeForce RTX 3090',
            price: 1250,
            qty: 3
        }
    ]
};

const shoppingCart = {
    items: [],
    methods: {
        add: (id, qty) => {
            const cartItem = shoppingCart.methods.get(id);
            
            if(cartItem) {
                if(shoppingCart.methods.hasInventory(id, qty + cartItem.qty)) {
                    cartItem.qty++;
                } else {
                    alert('No hay inventario suficiente')
                }
            } else {
                shoppingCart.items.push({ id, qty });
            }
        },
        remove: (id, qty) => {
            const cartItem = shoppingCart.methods.get(id);
            if (cartItem.qty - 1 > 0) {
                cartItem.qty--;
            } else {
                shoppingCart.items = shoppingCart.items.filter((item) => item.id != id);
            }
        },
        count: () => {
            return shoppingCart.items.reduce((acc, item) => acc + item.qty, 0);
        },
        get: (id) => {
            const index = shoppingCart.items.findIndex((item) => item.id == id);
            return index >= 0 ? shoppingCart.items[index] : null;
        },
        getTotal: () => {
            let total = 0;
            shoppingCart.items.forEach((item) => {
                const found = db.methods.find(item.id);
                total += found.price * item.qty;
            });
            return total;
        },
        hasInventory: (id, qty) => {
            return db.items.find((item) => item.id == id).qty - qty >= 0;
        },
        purchase: () => {
            db.methods.remove(shoppingCart.items);
        }
    }
};

renderStore();

function renderStore() {
    const html = db.items.map((item) => {
        return `
            <div class="item">
                <div class="title">${item.title}</div>
                <div class="price">${numberToCurrency(item.price)}</div>
                <div class="qty">${item.qty} units</div>

                <div class="actions">
                    <button class="add" data-id="${item.id}">Add to Shopping Cart</button>
                </div>
            </div>
        `;
    });

    document.querySelector('#store-container').innerHTML = html.join("");

    document.querySelectorAll('.item .actions .add').forEach((button) => {
        button.addEventListener('click', (e) =>{
            const id = parseInt(button.getAttribute('data-id'));
            const item = db.methods.find(id);

            if(item && item.qty - 1 > 0) {
                //añadir a shopping cart
                shoppingCart.methods.add(id, 1);
                renderShoppingCart();
            } else {
                alert("Ya no hay inventario");
            }
        });
    });
}

function renderShoppingCart() {
    const html = shoppingCart.items.map ((item) => {
        const dbItem = db.methods.find(item.id);
        return `
            <div class="item">
                <div class="title">${dbItem.title}</div>
                <div class="price">${numberToCurrency(dbItem.price)}</div>
                <div class="qty">${item.qty} units</div>
                <div class="subtotal">
                    Subtotal:${numberToCurrency(item.qty * dbItem.price)}
                </div>
                <div class="actions">
                    <button class="addOne" data-id="${item.id}">+</button>
                    <button class="removeOne" data-id="${item.id}">-</button>
                </div>
            </div>
        `;
    });

    const closeButton = `
        <div class="cart-header">
            <button id="bClose">Close</button>
        </div>
    `;
    const purchaseButton = 
        shoppingCart.items.length > 0
            ? `<div class="cart-actions">
        <button id="bPurchase">Purchase</button>
    </div>`
        : "";

    const total = shoppingCart.methods.getTotal();
    const totalContainer = `<div class="total">Total: ${numberToCurrency(total)}</div>`;

    document.querySelector('#shopping-cart-container').innerHTML = closeButton + html.join("") + totalContainer + purchaseButton;

    document.querySelector('#shopping-cart-container').classList.remove("hide");
    document.querySelector('#shopping-cart-container').classList.add("show");

    document.querySelectorAll('.addOne').forEach((button) => {
        button.addEventListener('click', (e) => {
            const id = parseInt(button.getAttribute('data-id'));
            shoppingCart.methods.add(id, 1);
            renderShoppingCart();
        });
    });

    document.querySelectorAll('.removeOne').forEach((button) => {
        button.addEventListener('click', (e) => {
            const id = parseInt(button.getAttribute('data-id'));
            shoppingCart.methods.remove(id, 1);
            renderShoppingCart();
        });
    });

    document.querySelector('#bClose').addEventListener('click', (e) => {
        document.querySelector('#shopping-cart-container').classList.remove("show");
        document.querySelector('#shopping-cart-container').classList.add("hide");
    });

    const bPurchase = document.querySelector('#bPurchase');
    if(bPurchase) {
        bPurchase.addEventListener('click', (e) => {
            shoppingCart.methods.purchase();
        });
    }
}

function numberToCurrency(num) {
    return new Intl.NumberFormat('en-US', {
        maximumSignificantDigits:2,
        style: 'currency',
        currency: 'USD'
    }).format(num);
}
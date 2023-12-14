const cartId = '656b4c4e224e10796e927367';

(function () {
    const cartButton = document.getElementById('cart-button');
    const cartContainer = document.getElementById('cart-container');
    const overlay = document.getElementById('overlay');

    cartButton.addEventListener('click', () => {
        console.log('abierto');
        cartContainer.classList.add('open-cart');
        overlay.classList.add('show-overlay');
    });

    const closeButton = document.getElementById('close-cart-button');
    closeButton.addEventListener('click', () => {
        console.log('cerrar');
        cartContainer.classList.remove('open-cart');
        overlay.classList.remove('show-overlay');
    });

    window.onclick = function (event) {
        if (event.target === overlay) {
            cartContainer.classList.remove('open-cart');
            overlay.classList.remove('show-overlay');
        }
    }
})();



async function loadCart() {
    const response = await fetch(`api/carts/${cartId}`);
    const cart = await response.json();
    let totalQuantity = 0;
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Limpiar el contenedor

    cart.products.forEach(item => {
        let thumbnail = item.product.thumbnail ? item.product.thumbnail : '/assets/image/no-image.jpg';

        const productElement = document.createElement('div');
        productElement.classList.add('product')
        productElement.innerHTML = `
        <div class="product-info">
            <img src="${thumbnail}"/>
            <span>${item.product.title}</span> Cantidad: ${item.quantity}
        </div>
        <button onclick="deleteProductFromCart('${item.product._id}')">Eliminar</button>
        <hr>
        `;
        cartItemsContainer.appendChild(productElement);
        totalQuantity += item.quantity;

        console.log(totalQuantity)
    });




    // Actualizar total
    const total = cart.products.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);
    document.getElementById('cart-total').innerText = `Total: $${total}`;
    document.getElementById('cart-total-items').innerText = `${totalQuantity}`;
}

// Ejemplo de uso
loadCart();



async function addProductToCart(productId) {
    console.log('intentando agregar a cart');
    // Asumiendo que tienes una variable con el ID del carrito
    // const cartId = cartId; // Reemplaza con el ID de carrito actual

    try {
        // Configura el cuerpo de la solicitud
        const requestBody = {
            productId: productId,
            quantity: 1 // Puedes ajustar esto si permites especificar la cantidad
        };

        // Realiza la solicitud al backend
        const response = await fetch(`api/carts/${cartId}`, {
            method: 'PUT', // o POST, según tu implementación de backend
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();

        if (response.ok) {
            loadCart();
        } else {
            alert('Error al agregar producto al carrito: ' + responseData.message);
        }
    } catch (error) {
        console.error('Hubo un problema con la solicitud fetch:', error);
    }
}

async function deleteProductFromCart(productId) {
    try {
        const response = await fetch(`api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });

        const responseData = await response.json();

        if (response.ok) {
            loadCart(); // Recargar el carrito para reflejar los cambios
        } else {
            alert('Error al eliminar producto: ' + responseData.message);
        }
    } catch (error) {
        console.error('Hubo un problema con la solicitud fetch:', error);
    }
}




document.addEventListener('DOMContentLoaded', async () => {
    const subscriptionForm = document.getElementById('subscription-form');
    const unsubscribeForm = document.getElementById('unsubscribe-form');
    const productSelect = document.getElementById('product-select');
    const unsubscribeProductSelect = document.getElementById('unsubscribe-product-select');
    const messageArea = document.getElementById('message-area');

    const WORKER_URL = 'http://localhost:8787'; // Replace with your deployed Worker URL

    // Helper to display messages
    function showMessage(message, type) {
        messageArea.textContent = message;
        messageArea.className = `message-area ${type}`;
        setTimeout(() => {
            messageArea.textContent = '';
            messageArea.className = 'message-area';
        }, 5000);
    }

    // Fetch products and populate dropdowns
    async function fetchProducts() {
        try {
            const response = await fetch(`${WORKER_URL}/products`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();

            productSelect.innerHTML = '';
            unsubscribeProductSelect.innerHTML = '';

            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product._id;
                option.textContent = product.name;
                productSelect.appendChild(option);

                const unsubscribeOption = document.createElement('option');
                unsubscribeOption.value = product._id;
                unsubscribeOption.textContent = product.name;
                unsubscribeProductSelect.appendChild(unsubscribeOption);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            showMessage('Failed to load products. Please try again later.', 'error');
        }
    }

    await fetchProducts();

    // Handle subscription form submission
    subscriptionForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const phoneNumber = document.getElementById('phone-number').value;
        const email = document.getElementById('email').value;
        const whatsappOptin = document.getElementById('whatsapp-optin').checked;

        if (!whatsappOptin) {
            showMessage('You must agree to receive WhatsApp notifications.', 'error');
            return;
        }

        const selectedProductIds = Array.from(productSelect.selectedOptions).map(option => option.value);

        if (selectedProductIds.length === 0) {
            showMessage('Please select at least one product to monitor.', 'error');
            return;
        }

        try {
            const response = await fetch(`${WORKER_URL}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber,
                    email,
                    productIds: selectedProductIds,
                }),
            });

            if (response.ok) {
                showMessage('Subscription successful! You will be notified when products are back in stock.', 'success');
                subscriptionForm.reset();
            } else {
                const errorText = await response.text();
                showMessage(`Subscription failed: ${errorText}`, 'error');
            }
        } catch (error) {
            console.error('Error during subscription:', error);
            showMessage('An error occurred during subscription. Please try again.', 'error');
        }
    });

    // Handle unsubscription form submission
    unsubscribeForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const phoneNumber = document.getElementById('unsubscribe-phone-number').value;
        const selectedProductIds = Array.from(unsubscribeProductSelect.selectedOptions).map(option => option.value);

        try {
            const response = await fetch(`${WORKER_URL}/unsubscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber,
                    productIds: selectedProductIds.length > 0 ? selectedProductIds : undefined, // Send undefined if no specific products selected
                }),
            });

            if (response.ok) {
                showMessage('Unsubscription successful!', 'success');
                unsubscribeForm.reset();
            } else {
                const errorText = await response.text();
                showMessage(`Unsubscription failed: ${errorText}`, 'error');
            }
        } catch (error) {
            console.error('Error during unsubscription:', error);
            showMessage('An error occurred during unsubscription. Please try again.', 'error');
        }
    });
});

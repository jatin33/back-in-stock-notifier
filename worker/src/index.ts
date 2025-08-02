/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// Define interfaces for product and user data
interface Product {
	_id: string;
	name: string;
	alias: string;
	available: number;
	inventory_quantity: number;
	price: number;
	images: { image: string }[];
}

interface UserSubscription {
	phoneNumber: string;
	email?: string; // For future fallback
	subscribedProductIds: string[];
}

// Helper function to fetch product data from Amul API
async function fetchAmulProducts(env: Env): Promise<Product[]> {
	const url = `${env.AMUL_API_URL}?fields[name]=1&fields[brand]=1&fields[categories]=1&fields[collections]=1&fields[alias]=1&fields[sku]=1&fields[price]=1&fields[compare_price]=1&fields[original_price]=1&fields[images]=1&fields[metafields]=1&fields[discounts]=1&fields[catalog_only]=1&fields[is_catalog]=1&fields[seller]=1&fields[available]=1&fields[inventory_quantity]=1&fields[net_quantity]=1&fields[num_reviews]=1&fields[avg_rating]=1&fields[inventory_low_stock_quantity]=1&fields[inventory_allow_out_of_stock]=1&fields[default_variant]=1&fields[variants]=1&fields[lp_seller_ids]=1&filters[0][field]=categories&filters[0][value][0]=protein&filters[0][operator]=in&filters[0][original]=1&facets=true&facetgroup=default_category_facet&limit=32&total=1&start=0`;

	const headers = {
		'accept': 'application/json, text/plain, */*',
		'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
		'base_url': 'https://shop.amul.com/en/browse/protein',
		// Note: The 'cookie' header from the original curl is highly dynamic and session-specific.
		// Including it directly might cause issues or be unnecessary for API access.
		// If the API requires specific cookies for public product listing, this might need adjustment.
		// For now, omitting it as it's usually for browser sessions.
		'frontend': '1',
		'priority': 'u=1, i',
		'referer': 'https://shop.amul.com/',
		'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
		'sec-ch-ua-mobile': '?0',
		'sec-ch-ua-platform': '"macOS"',
		'sec-fetch-dest': 'empty',
		'sec-fetch-mode': 'cors',
		'sec-fetch-site': 'same-origin',
		// 'tid': '1754124205091:674:fb632da58086237ddb46490b7f48f2293b09833a7c8b350b2db177a9d0dc1568', // Also dynamic
		'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
	};

	try {
		const response = await fetch(url, { headers });
		if (!response.ok) {
			console.error(`Failed to fetch products: ${response.status} ${response.statusText}`);
			return [];
		}
		const data = await response.json() as { data: Product[] };
		return data.data || [];
	} catch (error) {
		console.error('Error fetching Amul products:', error);
		return [];
	}
}

// Helper function to send WhatsApp notification
async function sendWhatsAppNotification(
	phoneNumber: string,
	productName: string,
	productLink: string,
	env: Env
): Promise<void> {
	const whatsappApiUrl = `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
	const headers = {
		'Authorization': `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
		'Content-Type': 'application/json',
	};

	// Using 'hello_world' template as agreed for initial implementation
	// The actual template for back-in-stock would be different and require approval.
	// For a real back-in-stock template, 'components' would be used for dynamic values.
	const body = JSON.stringify({
		messaging_product: 'whatsapp',
		to: phoneNumber,
		type: 'template',
		template: {
			name: 'hello_world', // Replace with your approved template name
			language: {
				code: 'en_US',
			},
			// For a real back-in-stock template, you'd use components like this:
			// components: [
			// 	{
			// 		type: 'body',
			// 		parameters: [
			// 			{ type: 'text', text: productName },
			// 			{ type: 'text', text: productLink },
			// 		],
			// 	},
			// 	{
			// 		type: 'button',
			// 		sub_type: 'url',
			// 		index: 0,
			// 		parameters: [{ type: 'text', text: productLink }],
			// 	},
			// ],
		},
	});

	try {
		const response = await fetch(whatsappApiUrl, {
			method: 'POST',
			headers,
			body,
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error(`Failed to send WhatsApp message to ${phoneNumber}: ${response.status} ${response.statusText}`, errorData);
			// Log the error for future email fallback
		} else {
			console.log(`WhatsApp notification sent to ${phoneNumber} for ${productName}`);
		}
	} catch (error) {
		console.error(`Error sending WhatsApp message to ${phoneNumber}:`, error);
		// Log the error for future email fallback
	}
}

// Handle API requests from the frontend
async function handleFetch(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const path = url.pathname;

	if (request.method === 'GET' && path === '/products') {
		// Endpoint to get the list of products for the dropdown
		const products = await fetchAmulProducts(env);
		return new Response(JSON.stringify(products), {
			headers: { 'Content-Type': 'application/json' },
		});
	} else if (request.method === 'POST' && path === '/subscribe') {
		// Endpoint for user subscription
		try {
			const { phoneNumber, email, productIds } = await request.json() as {
				phoneNumber: string;
				email?: string;
				productIds: string[];
			};

			if (!phoneNumber || !productIds || productIds.length === 0) {
				return new Response('Missing phoneNumber or productIds', { status: 400 });
			}

			// Store user subscription in USERS_KV
			await env.USERS_KV.put(phoneNumber, JSON.stringify({ email, subscribedProductIds: productIds }));
			console.log(`User ${phoneNumber} subscribed to products: ${productIds.join(', ')}`);

			return new Response('Subscription successful', { status: 200 });
		} catch (error) {
			console.error('Error handling subscription:', error);
			return new Response('Internal Server Error', { status: 500 });
		}
	} else if (request.method === 'POST' && path === '/unsubscribe') {
		// Endpoint for user unsubscription
		try {
			const { phoneNumber, productIds } = await request.json() as {
				phoneNumber: string;
				productIds?: string[]; // Optional: if specific products are unsubscribed
			};

			if (!phoneNumber) {
				return new Response('Missing phoneNumber', { status: 400 });
			}

			const userRecord = await env.USERS_KV.get(phoneNumber, 'json') as UserSubscription | null;

			if (userRecord) {
				if (productIds && productIds.length > 0) {
					// Unsubscribe from specific products
					const newSubscribedProductIds = userRecord.subscribedProductIds.filter(
						(id) => !productIds.includes(id)
					);
					if (newSubscribedProductIds.length === 0) {
						// If no products left, remove the user entirely
						await env.USERS_KV.delete(phoneNumber);
						console.log(`User ${phoneNumber} unsubscribed from all products and removed.`);
					} else {
						await env.USERS_KV.put(phoneNumber, JSON.stringify({ ...userRecord, subscribedProductIds: newSubscribedProductIds }));
						console.log(`User ${phoneNumber} unsubscribed from products: ${productIds.join(', ')}. Remaining: ${newSubscribedProductIds.join(', ')}`);
					}
				} else {
					// Unsubscribe from all products (delete user record)
					await env.USERS_KV.delete(phoneNumber);
					console.log(`User ${phoneNumber} unsubscribed from all products.`);
				}
				return new Response('Unsubscription successful', { status: 200 });
			} else {
				return new Response('User not found', { status: 404 });
			}
		} catch (error) {
			console.error('Error handling unsubscription:', error);
			return new Response('Internal Server Error', { status: 500 });
		}
	}

	return new Response('Not Found', { status: 404 });
}

// Handle scheduled events (cron trigger)
async function handleScheduled(env: Env): Promise<void> {
	console.log('Running scheduled stock check...');

	const currentProducts = await fetchAmulProducts(env);
	if (currentProducts.length === 0) {
		console.log('No products fetched from Amul API. Skipping stock check.');
		return;
	}

	// Fetch all subscribed users
	const { keys: userKeys } = await env.USERS_KV.list();
	const usersPromises = userKeys.map(key => env.USERS_KV.get(key.name, 'json') as Promise<UserSubscription>);
	const users = await Promise.all(usersPromises);

	for (const product of currentProducts) {
		const productId = product._id;
		const currentAvailability = product.available;
		const currentQuantity = product.inventory_quantity;
		const productLink = `https://shop.amul.com/en/browse/protein/${product.alias}`; // Construct product link

		// Get last known stock status from PRODUCTS_KV
		const lastKnownStatus = await env.PRODUCTS_KV.get(productId, 'json') as {
			available: number;
			inventory_quantity: number;
		} | null;

		// Check if product is back in stock
		const isBackInStock =
			(currentAvailability === 1 && (lastKnownStatus?.available === 0 || lastKnownStatus === null)) ||
			(currentQuantity > 0 && (lastKnownStatus?.inventory_quantity === 0 || lastKnownStatus === null));

		if (isBackInStock) {
			console.log(`Product ${product.name} is back in stock!`);

			// Notify subscribed users
			for (const user of users) {
				if (user && user.subscribedProductIds.includes(productId)) {
					await sendWhatsAppNotification(user.phoneNumber, product.name, productLink, env);
				}
			}
		}

		// Update last known stock status in PRODUCTS_KV
		await env.PRODUCTS_KV.put(
			productId,
			JSON.stringify({ available: currentAvailability, inventory_quantity: currentQuantity })
		);
	}
	console.log('Scheduled stock check complete.');
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		console.log("testing......++");
		return handleFetch(request, env);
	},
	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
		console.log("scheduling testing.....");
		await handleScheduled(env);
	},
} satisfies ExportedHandler<Env>;

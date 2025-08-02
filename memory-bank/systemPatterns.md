# System Patterns: Amul Protein Back-in-Stock Notification System

## System Architecture
The system follows a client-server architecture with a static frontend and a serverless backend.

```mermaid
graph TD
    User[User] --> WebPage[Frontend Web Page]
    WebPage --> CloudflareWorker[Cloudflare Worker (Backend)]
    CloudflareWorker -- Periodically Fetch --> AmulAPI[Amul Product API]
    CloudflareWorker -- Store/Retrieve --> CloudflareKV[Cloudflare Workers KV]
    CloudflareWorker -- Send Notification --> WhatsAppCloudAPI[WhatsApp Cloud API]
    WhatsAppCloudAPI --> User[User]
```

## Key Technical Decisions
*   **Monorepo Structure**: Frontend and Worker code will reside in a single GitHub repository for simplified development, shared code, and atomic commits.
*   **Cloudflare Workers**: Chosen for backend logic due to its serverless nature, scalability, cost-effectiveness, and built-in cron triggers.
*   **Cloudflare Workers KV**: Utilized for persistent storage of product data (last known stock status) and user subscription data.
*   **WhatsApp Cloud API**: Selected for direct, cost-effective, and interactive user notifications.
*   **Dynamic Product List**: The frontend will dynamically fetch the list of protein products from the Worker, which in turn fetches from Amul API, ensuring the product list is always up-to-date.

## Design Patterns in Use
*   **Polling**: The Cloudflare Worker will poll the Amul API at regular intervals (every 5 minutes) to check for stock changes.
*   **Event-Driven (Conceptual)**: A "back in stock" event triggers the notification process.
*   **API Gateway (Implicit)**: The Cloudflare Worker acts as an implicit API gateway for the frontend to interact with user data and product lists.

## Component Relationships
*   **Frontend & Worker**: The frontend communicates with the Worker via HTTP requests for user registration, subscription management, and fetching product lists.
*   **Worker & Amul API**: The Worker makes outbound HTTP requests to the Amul product listing API.
*   **Worker & Cloudflare KV**: The Worker interacts with KV for reading and writing product stock status and user subscription data.
*   **Worker & WhatsApp Cloud API**: The Worker makes outbound HTTP requests to the WhatsApp Cloud API to send notifications.

## Critical Implementation Paths
*   **Stock Change Detection**: Accurate and efficient comparison of current vs. last known stock status.
*   **Reliable Notification Delivery**: Ensuring WhatsApp messages are sent successfully and handling failures.
*   **User Data Integrity**: Secure and consistent storage and retrieval of user subscriptions in KV.
*   **API Key Management**: Secure handling of WhatsApp Cloud API credentials and other sensitive information.

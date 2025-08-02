# Active Context: Amul Protein Back-in-Stock Notification System

## Current Work Focus
Planning and initial setup of the back-in-stock notification system. The current focus is on defining the MVP scope, system architecture, and code management strategy.

## Recent Changes
*   Initial curl command executed to understand Amul API response structure.
*   Clarified requirements for product selection, monitoring frequency, notification method (WhatsApp), system type (Cloudflare Worker + Web Frontend), and user interaction.
*   Confirmed WhatsApp Cloud API as the preferred notification method, acknowledging direct integration capabilities and favorable utility message pricing in India.
*   Decided on a monorepo structure for code management, with `frontend/` and `worker/` subdirectories, compatible with GitHub-based CI/CD for Cloudflare Workers and Pages.
*   Defined MVP scope and future features.

## Next Steps
1.  Initialize the monorepo structure: create `frontend/` and `worker/` directories.
2.  Set up the Cloudflare Worker project within `worker/` using `npm create cloudflare@latest`.
3.  Develop the Cloudflare Worker logic for:
    *   Fetching and storing product data from Amul API in KV.
    *   Implementing cron trigger for stock monitoring.
    *   User management API endpoints (subscribe/unsubscribe).
    *   Sending WhatsApp notifications.
4.  Develop the frontend web page for user registration and product selection.
5.  Implement GitHub Actions for CI/CD for both the Worker and Frontend.

## Active Decisions and Considerations
*   **WhatsApp API Credentials**: User has WhatsApp Business Account and Cloud API access. API credentials (permanent access token, Phone Number ID) will be needed for Worker configuration.
*   **WhatsApp Message Templates**: User has a template in review; `hello_world` will be used initially.
*   **Product Link in Notification**: Notifications will include product name and a link to the product page.
*   **User Opt-in**: A clear checkbox on the web form will be used for WhatsApp opt-in.
*   **Data Storage**: Cloudflare Workers KV will store WhatsApp phone numbers, email addresses, and subscribed product IDs.
*   **Error Handling**: Initial MVP will log WhatsApp notification failures; email fallback is a future feature.

## Learnings and Project Insights
*   Amul API provides `available` and `inventory_quantity` fields for stock status.
*   WhatsApp Cloud API offers competitive pricing for utility messages in India, making it a viable primary notification channel.
*   Monorepos are well-suited for this project, enabling shared code and streamlined development/deployment with Cloudflare's GitHub integrations.

## Important Patterns and Preferences
*   **Monitoring Frequency**: Every 5 minutes.
*   **Notification Content**: Product name + link.
*   **User Interaction**: Web form for registration/subscription, WhatsApp for notifications.

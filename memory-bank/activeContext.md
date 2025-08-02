# Active Context: Amul Protein Back-in-Stock Notification System

## Current Work Focus
Project infrastructure setup complete. Current focus is on deployment configuration and core feature implementation for the back-in-stock notification system.

## Recent Changes
*   ✅ Created monorepo structure with `frontend/` and `worker/` directories.
*   ✅ Initialized Cloudflare Worker project with TypeScript configuration.
*   ✅ Created basic frontend structure (HTML, CSS, JavaScript files).
*   ✅ Configured GitHub Actions workflows for automated deployment of both frontend and worker.
*   ✅ Set up proper project structure with configuration files (wrangler.jsonc, package.json, etc.).

## Next Steps
1.  **Deployment Setup**:
    *   Configure GitHub repository secrets (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, WHATSAPP_* credentials).
    *   Create Cloudflare Pages project named "amul-stock-notifier-frontend".
    *   Test GitHub Actions workflows with a sample commit.
2.  **Core Worker Development**:
    *   Implement Amul API fetching logic.
    *   Set up KV storage for product data and user subscriptions.
    *   Configure cron triggers for stock monitoring.
    *   Build user management API endpoints.
    *   Implement WhatsApp notification functionality.
3.  **Frontend Enhancement**:
    *   Build dynamic product selection interface.
    *   Implement form validation and user feedback.
    *   Connect frontend to worker API endpoints.

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

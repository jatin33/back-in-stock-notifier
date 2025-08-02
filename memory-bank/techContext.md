# Tech Context: Amul Protein Back-in-Stock Notification System

## Technologies Used
*   **Backend**:
    *   **Cloudflare Workers**: Serverless execution environment for the backend logic.
    *   **Node.js**: Programming language for the Worker.
    *   **Cloudflare Workers KV**: Key-value store for persistent data storage.
    *   **WhatsApp Cloud API**: For sending WhatsApp notifications.
    *   **`fetch` API**: For making HTTP requests to the Amul product API and WhatsApp Cloud API.
*   **Frontend**:
    *   **HTML5**: Structure of the web page.
    *   **CSS3**: Styling of the web page.
    *   **JavaScript (ES6+)**: Client-side logic for form handling, product selection, and communication with the Worker.

## Development Setup
*   **Monorepo**: Project will be structured as a monorepo with `frontend/` and `worker/` directories.
*   **Cloudflare Wrangler CLI**: Used for local development, testing, and deployment of the Cloudflare Worker.
*   **GitHub**: Version control and integration with Cloudflare for CI/CD.

## Technical Constraints
*   **Cloudflare Workers Limits**: Adherence to Workers' CPU time, memory, and request limits.
*   **Cloudflare Workers KV Limits**: Awareness of KV key/value size limits and read/write rates.
*   **Amul API Rate Limits**: Need to be mindful of potential rate limits on the Amul product listing API to avoid being blocked.
*   **WhatsApp Cloud API Policies**: Strict adherence to WhatsApp's messaging policies, including explicit user opt-in and use of pre-approved message templates.
*   **Cron Trigger Frequency**: Fixed at every 5 minutes as per requirement.

## Dependencies
*   **Worker**: Standard Node.js `fetch` API. No external npm packages are strictly required for basic functionality, but `itty-router` or similar lightweight router could be considered for API endpoints.
*   **Frontend**: No external libraries are strictly required for the MVP, but a lightweight library for the searchable dropdown could be considered if a custom implementation becomes too complex.

## Tool Usage Patterns
*   **`wrangler dev`**: For local development and testing of the Cloudflare Worker.
*   **`wrangler deploy`**: For deploying the Worker to Cloudflare.
*   **GitHub Actions**: For automated CI/CD pipeline to deploy both frontend (via Cloudflare Pages) and Worker.

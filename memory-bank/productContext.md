# Product Context: Amul Protein Back-in-Stock Notification System

## Why this project exists
To address the frustration of users missing out on their favorite Amul protein products due to stock unavailability. It provides a proactive way for users to be informed immediately when desired products are back in stock.

## Problems it solves
*   **Manual Checking**: Eliminates the need for users to constantly check the Amul website for product availability.
*   **Missed Opportunities**: Ensures users don't miss out on purchasing products when they become available.
*   **User Convenience**: Provides a convenient and direct notification method via WhatsApp.

## How it should work
1.  Users visit a web page to register and select protein products they wish to monitor.
2.  The backend system (Cloudflare Worker) periodically checks the Amul website's product API for stock changes.
3.  If a selected product is back in stock, a WhatsApp notification is sent to the subscribed users.
4.  Users can manage their subscriptions (add/remove products) via the web interface.

## User Experience Goals
*   **Simplicity**: Easy and intuitive registration and product selection process.
*   **Reliability**: Notifications are sent promptly and accurately.
*   **Clarity**: Notifications clearly state which product is back in stock and provide a direct link.
*   **Control**: Users have full control over their subscriptions.

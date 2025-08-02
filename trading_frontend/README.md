# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

This project is a modern, responsive, minimal React SPA for the SmartTrade.AI trading platform.

### Prerequisites

- Node.js >= 16, npm >= 8
- Copy the `.env.example` to `.env` and set variables:
  ```
  cp .env.example .env
  ```
- ⚠️ All backend API calls (REST & WebSocket) are hardcoded to:
  
      http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/

  There is no fallback to environment variables—this ensures a single consistent backend endpoint as required.

- If you deploy the frontend from HTTPS (such as https://ai-powered-trading-app.kavia.app) but the backend is HTTP, most browsers will block API/WebSocket calls due to mixed-content CORS restrictions. The app will display clear error messages in this case.

### Development

- `npm install`
- `npm start`
  - Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### Features
- User onboarding/registration
- KYC/risk questionnaire
- Real-time dashboard (holdings, P&L, predictions)
- Signal explorer & sentiment
- Portfolio management (manual/automated)
- Trade execution UI
- Notifications & alerts (including WebSocket live)
- Account/API key management
- Responsive dark/modern UI

### Backend API Routing

**Important:**  
All REST API and WebSocket requests are **hardcoded** to use:
  
    http://kavia-alb-59004123-1657625787.us-east-1.elb.amazonaws.com/
  
This is enforced in all API modules and cannot be changed via environment variables or `.env` files.  
If you need to adjust this, update the backend base URLs at the top of each `src/api/*.js` module and `src/api/websocket.js`.

### CORS and Mixed Content

If you serve the frontend over HTTPS but the backend is only HTTP, most browsers will block all requests for security (mixed-content policy).  
You will get "Network Error" or "Failed to fetch" errors, and the UI explains this to end users.


## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

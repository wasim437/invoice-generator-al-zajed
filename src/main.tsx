import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Aggressive reset to fix persistent white screen
if (typeof window !== 'undefined') {
    window.onerror = function (message, source, lineno, colno, error) {
        console.error('GLOBAL ERROR:', message, error);
        return false;
    };

    // Force unregister ALL service workers
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
                registration.unregister();
            }
        });
    }

    // Force clear all browser caches for this site
    if ('caches' in window) {
        caches.keys().then(names => {
            for (let name of names) caches.delete(name);
        });
    }
}

createRoot(document.getElementById("root")!).render(<App />);

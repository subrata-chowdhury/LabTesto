'use client';

// it will only work on PWA app
export default function notify(message: string, title: string) {
    if (window.AndroidNotify && window.AndroidNotify.notify) {
        window.AndroidNotify.notify(message || 'You Got a new Notification', title || "LabTesto");
    }
}

declare global {
    interface Window {
        AndroidNotify: {
            notify: (message: string, title: string) => void;
        };
    }
}
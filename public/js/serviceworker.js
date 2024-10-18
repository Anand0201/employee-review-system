const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
};

const saveSubscription = async (subscription) => {
    console.log("Saving subscription:", subscription);
    try {
        const response = await fetch('http://localhost:2000/save-subscription', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
        });
        console.log("Subscription saved response:", response);
        return response.json();
    } catch (error) {
        console.error("Error saving subscription:", error);
    }
};

const publickey = "BG44jWIl2m2qX7GTK63EJktrrJBwH7hAFlCbJkN20yIe-4kOc8S9V9zRWKTe9pRp_aG1I_TY7mczspCosVkc6S4"

self.addEventListener("activate", async (e) => {
    console.log("Service worker activating...");
    try {
        const subscription = await self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publickey)
        });
        console.log("Subscription:", subscription);
        const response = await saveSubscription(subscription);
        console.log("Save subscription response:", response);
    } catch (error) {
        console.error("Error during subscription:", error);
    }
});

self.addEventListener('push', function(event) {
    const data = JSON.parse(event.data.text());

    const options = {
        body: data.body,
        icon: '/images/O.png',
        badge: '/images/OTE NEW LOGO.png',
        image: '/images/OTE LOGO NEW.png',
        data: {
            url: data.url
        },
        actions: [
            {
                action: 'open_url',
                title: 'Update'
            }
        ],
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const url = event.notification.data.url;
    event.waitUntil(
        clients.openWindow(url)
    );
});

const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker!")
    }

    if (!('Notification' in window)) {
        throw new Error("No support for notification API");
    }

    if (!('PushManager' in window)) {
        throw new Error("No support for Push API")
    }
}

const registerSW = async () => {
    console.log("Registering service worker...");
    try {
        const registration = await navigator.serviceWorker.register('/js/serviceworker.js');
        console.log("Service worker registered:", registration);
        return registration;
    } catch (error) {
        console.error("Error registering service worker:", error);
    }
}

const requestNotificationPermission = async () => {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();
    console.log("Notification permission status:", permission);
    if (permission !== 'granted') {
        throw new Error("Notification permission not granted");
    }
}

const main = async () => {
    try {
        checkPermission();
        await requestNotificationPermission();
        await registerSW();
    } catch (error) {
        console.error("Error in main function:", error);
    }
}

window.onload = () => {
    main();
};
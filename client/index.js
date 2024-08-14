const client = (() => {
  let sw = undefined;
  const btn = document.getElementById('btn-notify');

  const checkNotificationSupport = () => {
    if (!('Notification' in window)) {
      return Promise.reject('The browser does not support notifications');
    }
    return Promise.resolve();
  };

  const registerServiceWorker = () => {
    if (!('serviceWorker' in navigator)) {
      return Promise.reject('ServiceWorker support is not available');
    }
    return navigator.serviceWorker
      .register('service-worker.js')
      .then((swObj) => {
        console.log('service worker registered successfully');
        sw = swObj;
        btn.style.display = 'block';
        btn.addEventListener('click', async () => {
          navigator.serviceWorker.getRegistration().then((reg) =>
            reg.showNotification('Hi', {
              body: 'This is a text body',
              actions: [
                { action: 'search', title: 'try searching' },
                { action: 'close', title: 'try closing' },
              ],
              data: {
                notificationTime: Date.now(),
                githubUser: 'jaylamping',
              },
            })
          );
        });
      })
      .catch((err) => {
        console.error('Unable to register service-worker', err);
      });
  };

  const requestNotificationPermissions = () => {
    return Notification.requestPermission((status) => {
      console.log('Permission status: ', status);
    });
  };

  checkNotificationSupport()
    .then(registerServiceWorker)
    .then(requestNotificationPermissions)
    .catch((err) => console.error(err));
})();

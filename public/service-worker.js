const CACHE_NAME = 'api-cache-v2';

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Kiểm tra xem URL có chứa "/svc/v1/trends/region" hoặc "/svc/v1/trends/time" hay không
  if (url.pathname.includes('/svc/v1/trends/region') || url.pathname.includes('/svc/v1/trends/time')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            // Lưu response vào cache với key là URL đầy đủ (bao gồm cả query string)
            return caches.open(CACHE_NAME).then((cache) => {
              console.log('Caching response:', event.request.url);
              cache.put(event.request, response.clone());
              return response;
            });
          } else {
            // Nếu response không thành công, trả về từ cache nếu có
            return caches.match(event.request).then((cachedResponse) => {
              return cachedResponse || new Response('No cached data available.', {
                status: 404,
                statusText: 'Not Found',
              });
            });
          }
        })
        .catch(() => {
          // Nếu fetch thất bại (do mất mạng), trả về từ cache nếu có
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || new Response('Network error and no cached data available.', {
              status: 500,
              statusText: 'Network Error',
            });
          });
        })
    );
  }
});

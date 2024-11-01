const fetchCache = new Map();

export function customFetch(url: string, options = {}) {
  const now = Date.now();
  if (fetchCache.has(url)) {
    const lastFetchTime = fetchCache.get(url);
    if (now - lastFetchTime < 1200) {
      return Promise.resolve(null);
    }
  }
  fetchCache.set(url, now);
  const host = `${window.location.origin}${window.location.pathname === '/' ? '' : window.location.pathname}`
  return window.fetch(`${host}${url}`, options)
    .then(response => {
      if (response.status === 404) {
        // dialog({
        //     content: "You may be missing dependencies at the moment. For details, please refer to the ComfyUI logs.",
        //     type: 'error',
        //     noText: 'Close'
        // })
        alert('You may be missing dependencies at the moment. For details, please refer to the ComfyUI logs.')
      }
      return response.json();
    })
    .then(data => {
      const { code, message } = data;
      if (code !== 20000) {
        // dialog({
        //     type: 'warning',
        //     content: message,
        //     noText: 'Close',
        //     onNo: () => {
        //         if (code === 401000) {
        //             document.querySelector('.menus-item-key').click()
        //         }
        //     }
        // })
        alert(message)
        return;
      }
      return data;
    })
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
}
const API_BASE = "http://localhost:4041";

export function openLiveStream(path, handlers = {}) {
  if (!window.EventSource) return null;

  const source = new EventSource(`${API_BASE}${path}`, { withCredentials: true });

  Object.entries(handlers).forEach(([event, handler]) => {
    source.addEventListener(event, handler);
  });

  return source;
}

export { API_BASE };

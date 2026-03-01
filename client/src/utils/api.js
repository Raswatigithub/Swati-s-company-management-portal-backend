const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const auth = () => ({});
export const jsonAuth = () => ({ 'Content-Type': 'application/json' });

// Setup global fetch interceptor if not already done
const originalFetch = window.fetch;
if (!window.fetch.__intercepted) {
    window.fetch = async function () {
        const [resource, config] = arguments;
        const init = config || {};
        if (resource && typeof resource === 'string' && resource.startsWith(API)) {
            init.credentials = 'include';
        }
        return originalFetch.call(this, resource, init);
    };
    window.fetch.__intercepted = true;
}

export default API;

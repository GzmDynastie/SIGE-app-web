import { useUser } from "../hooks/useUser"

const { refreshAccessToken, accessToken } = useUser();

export async function fetchWithAuth(url: string, options: RequestInit = {}) {

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
    };

    let response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
            options.headers = {
                ...options.headers,
                Aurhorization: `Bearer ${newAccessToken}`,
            };
            response = await fetch(url, options);
        }
    }

    if (!response.ok) {
        throw new Error("Error en la solicitud");
    }
    return response.json();
}
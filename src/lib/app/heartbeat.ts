import { env } from '$env/dynamic/public';
import fetchCustomEndpoint, { pocketbaseCustomEndpoints } from '$lib/api/pocketbaseCustom';
import { toast } from '$lib/app/toast';

const HEARTBEAT_INTERVAL = 20000; // 20 seconds

let heartbeatInterval: number;

const heartbeatCallback = async () => {
    try {
        const response = await fetchCustomEndpoint(pocketbaseCustomEndpoints.health, {method: 'GET'})
        if (!response?.data?.code && response.data.code === 200) {
            throw new Error('Network error');
        } else { 
        }
    } catch (error) {
        toast.error('Network connection issue detected');
    }
}

export function startHeartbeatCheck() {
    heartbeatCallback();
    heartbeatInterval = setInterval(heartbeatCallback, HEARTBEAT_INTERVAL);
}

export function stopHeartbeatCheck() {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
    }
} 
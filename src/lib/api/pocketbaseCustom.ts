import axios, { Axios, type AxiosResponse } from 'axios';
import { currentUser } from '$lib/pocketbase';
import { env } from '$env/dynamic/public';

const HOST = 'https://kroadmapapp.pockethost.io/' ?? env.PUBLIC_POCKETBASE_URL;

export const pocketbaseCustomEndpoints = {
	health: HOST + 'api/health'
} as const;

interface ApiData {
	url?: [
		{
			key: string;
			value: string;
		}
	];
	payload?: any;
	method: string;
}

export async function fetchCustomEndpoint(
	endpoint: string,
	data: ApiData
): Promise<AxiosResponse<any>> {
	try {
		let token;
		currentUser.subscribe((value) => {
			token = value?.token;
		});

		let path = endpoint.toString();
		if (data.url) {
			for (const item of data.url) {
				path = path.replace(':' + item.key, item.value);
			}
		}
		if (data.method === 'get' && data.payload) {
			const queryParams = new URLSearchParams();
			for (const key in data.payload) {
				queryParams.set(key, data.payload[key]);
			}
			path += '?' + queryParams.toString();
		}
		const res = await axios({
			method: data.method ?? 'post',
			url: path,
			headers: {
				Authorization: token
			},
			data: data.method === 'post' ? data.payload : undefined
		});
		return res;
	} catch (e) {
		console.error(e);
		return e;
	}
}

export default fetchCustomEndpoint;

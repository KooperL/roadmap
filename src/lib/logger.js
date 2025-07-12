class Logger {
	session = '';
	session_inc = 0;

	constructor() {
		this.session = this.generateSession();
	}

	generateSession() {
		return (
			Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		);
	}

	async getIdentifier() {
		try {
			const id = await localStorage.getItem('identifier');
			return id || 'no-identifier';
		} catch (e) {
			console.error('Error accessing localStorage:', e);
			return 'no-identifier';
		}
	}

	async makeOpts(payload) {
		const identifier = await this.getIdentifier();
		return {
			...payload,
			submitted_on: new Date().toISOString().split('T')[0],
			source: 'prod',
			host: window.navigator.userAgent,
			identifier,
			session: this.session,
			session_inc: this.session_inc
		};
	}

	async fetch(loggerPayload) {
		const url = 'https://events.logridge.net/api/log/xxxxxxx';
		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Auth-Token': 'xxxxxxxxxx'
			},
			body: JSON.stringify(loggerPayload)
		};

		try {
			// return await fetch(url, options);
		} catch (e) {
			console.error('Network error during logging:', e);
			throw e;
		}
	}

	async log(level, title, body, telemetryEnabled = true) {
		try {
			// Call appropriate console method
			const consoleMethod = level === 'trace' ? 'log' : level;
			console[consoleMethod]?.(body);

			if (telemetryEnabled) {
				const loggerPayload = {
					title,
					detail: body,
					channel: 'frontend',
					level
				};

				const enrichedPayload = await this.makeOpts(loggerPayload);
				await this.fetch(enrichedPayload);
			}

			this.session_inc++;
		} catch (e) {
			console.error('==============', e);
		}
	}

	// Public logging methods
	async error(title, body, telemetryEnabled = true) {
		return this.log('error', title, body, telemetryEnabled);
	}

	async warn(title, body, telemetryEnabled = true) {
		return this.log('warn', title, body, telemetryEnabled);
	}

	async info(title, body, telemetryEnabled = true) {
		return this.log('info', title, body, telemetryEnabled);
	}

	async debug(title, body, telemetryEnabled = true) {
		return this.log('debug', title, body, telemetryEnabled);
	}

	async trace(title, body, telemetryEnabled = true) {
		return this.log('trace', title, body, telemetryEnabled);
	}
}

export const logger = new Logger();

import { AgentConfiguration, BuildConfiguration } from 'modern-clippy';

export function isAgentConfiguration(value: any): value is AgentConfiguration {
	// TODO improve
	return value && typeof value === 'object';
}

export function isBuildConfiguration(data: any): data is BuildConfiguration {
	// TODO improve
	return typeof data === 'object';
}

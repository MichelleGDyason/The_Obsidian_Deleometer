// Stub file for webApiService.ts
import { ApiService } from './apiService';

export class WebApiService {
    apiService: ApiService;
    apiKey: string;
    port: number;
    
    constructor(apiService: ApiService, apiKey: string, port: number) {
        this.apiService = apiService;
        this.apiKey = apiKey;
        this.port = port;
    }
    
    async start(): Promise<void> {
        console.log("WebApiService.start() called but not implemented");
    }
    
    async stop(): Promise<void> {
        console.log("WebApiService.stop() called but not implemented");
    }
}

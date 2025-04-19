// Stub file for mobileAdapter.ts
import { ApiService } from './apiService';

interface MobileAdapterOptions {
    syncEnabled: boolean;
    syncInterval: number;
}

export class MobileAdapter {
    apiService: ApiService;
    options: MobileAdapterOptions;
    
    constructor(apiService: ApiService, options: MobileAdapterOptions) {
        this.apiService = apiService;
        this.options = options;
    }
    
    async start(): Promise<void> {
        console.log("MobileAdapter.start() called but not implemented");
    }
    
    async stop(): Promise<void> {
        console.log("MobileAdapter.stop() called but not implemented");
    }
    
    async sync(): Promise<void> {
        console.log("MobileAdapter.sync() called but not implemented");
    }
}

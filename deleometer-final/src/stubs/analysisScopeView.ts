// Stub file for analysisScopeView.ts
import { App, Modal } from 'obsidian';

export class AnalysisScopeModal extends Modal {
    constructor(app: App) {
        super(app);
    }
    
    onOpen() {
        console.log("AnalysisScopeModal.onOpen() called but not implemented");
    }
    
    onClose() {
        console.log("AnalysisScopeModal.onClose() called but not implemented");
    }
}

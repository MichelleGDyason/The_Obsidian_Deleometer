// Stub file for journalAnalysisModal.ts
import { App, Modal } from 'obsidian';
import { AnalysisResult } from './types';

export class JournalAnalysisModal extends Modal {
    result: AnalysisResult;
    
    constructor(app: App, result: AnalysisResult) {
        super(app);
        this.result = result;
    }
    
    onOpen() {
        console.log("JournalAnalysisModal.onOpen() called but not implemented");
    }
    
    onClose() {
        console.log("JournalAnalysisModal.onClose() called but not implemented");
    }
}

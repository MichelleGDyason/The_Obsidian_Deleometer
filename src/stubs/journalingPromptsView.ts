// Stub file for journalingPromptsView.ts
import { App, Modal } from 'obsidian';

export class JournalingPromptsModal extends Modal {
    constructor(app: App) {
        super(app);
    }
    
    onOpen() {
        console.log("JournalingPromptsModal.onOpen() called but not implemented");
    }
    
    onClose() {
        console.log("JournalingPromptsModal.onClose() called but not implemented");
    }
}

import { App, Modal, Notice, setIcon } from 'obsidian';
import { AdvancedAI } from './advancedAI';

/**
 * Voice journaling component for the Deleometer plugin
 * Provides voice recording and transcription functionality
 */
export class VoiceJournaling {
    private app: App;
    private advancedAI: AdvancedAI;
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private isRecording = false;
    
    constructor(app: App, advancedAI: AdvancedAI) {
        this.app = app;
        this.advancedAI = advancedAI;
    }
    
    /**
     * Starts voice recording
     * @returns Promise<void>
     */
    public async startRecording(): Promise<void> {
        if (this.isRecording) {
            return;
        }
        
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Create media recorder
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            // Set up event handlers
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };
            
            this.mediaRecorder.onstop = async () => {
                // Create audio blob
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                
                // Show transcription modal
                new VoiceTranscriptionModal(this.app, audioBlob, this.advancedAI).open();
                
                // Reset recording state
                this.isRecording = false;
                
                // Stop all tracks in the stream
                stream.getTracks().forEach(track => track.stop());
            };
            
            // Start recording
            this.mediaRecorder.start();
            this.isRecording = true;
            
            new Notice('Voice recording started. Click the icon again to stop.');
        } catch (error) {
            console.error('Error starting voice recording:', error);
            new Notice('Failed to start voice recording. Please check microphone permissions.');
        }
    }
    
    /**
     * Stops voice recording
     */
    public stopRecording(): void {
        if (!this.isRecording || !this.mediaRecorder) {
            return;
        }
        
        try {
            this.mediaRecorder.stop();
            new Notice('Voice recording stopped. Transcribing...');
        } catch (error) {
            console.error('Error stopping voice recording:', error);
            new Notice('Failed to stop voice recording.');
        }
    }
    
    /**
     * Toggles voice recording
     */
    public toggleRecording(): void {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }
    
    /**
     * Checks if voice recording is supported
     * @returns boolean True if supported
     */
    public static isSupported(): boolean {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
}

/**
 * Modal for voice transcription
 */
export class VoiceTranscriptionModal extends Modal {
    private audioBlob: Blob;
    private advancedAI: AdvancedAI;
    private transcribedText: string = '';
    private isTranscribing = false;
    private audioElement: HTMLAudioElement | null = null;
    
    constructor(app: App, audioBlob: Blob, advancedAI: AdvancedAI) {
        super(app);
        this.audioBlob = audioBlob;
        this.advancedAI = advancedAI;
    }
    
    async onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('deleometer-voice-modal');
        
        // Create header
        const headerEl = contentEl.createEl('div', { cls: 'deleometer-modal-header' });
        headerEl.createEl('h2', { text: 'Voice Journal Entry' });
        
        // Create audio player
        const audioUrl = URL.createObjectURL(this.audioBlob);
        const audioContainerEl = contentEl.createEl('div', { cls: 'deleometer-audio-container' });
        this.audioElement = audioContainerEl.createEl('audio', { 
            attr: { controls: 'true', src: audioUrl }
        });
        
        // Create transcription container
        const transcriptionEl = contentEl.createEl('div', { cls: 'deleometer-transcription-container' });
        const loadingEl = transcriptionEl.createEl('div', { cls: 'deleometer-loading' });
        const spinnerEl = loadingEl.createEl('div', { cls: 'deleometer-spinner' });
        setIcon(spinnerEl, 'loader');
        loadingEl.createEl('div', { text: 'Transcribing your voice journal entry...' });
        
        // Create text area (hidden initially)
        const textAreaEl = transcriptionEl.createEl('textarea', { 
            cls: 'deleometer-transcription-text',
            attr: { 
                placeholder: 'Your transcribed journal entry will appear here. You can edit it before saving.',
                rows: '10'
            },
            text: ''
        });
        textAreaEl.style.display = 'none';
        
        // Create buttons
        const buttonsEl = contentEl.createEl('div', { cls: 'deleometer-modal-buttons' });
        const cancelBtn = buttonsEl.createEl('button', { text: 'Cancel' });
        const saveBtn = buttonsEl.createEl('button', { cls: 'mod-cta', text: 'Save to Journal' });
        saveBtn.style.display = 'none';
        
        // Add event listeners
        cancelBtn.addEventListener('click', () => {
            this.close();
        });
        
        saveBtn.addEventListener('click', () => {
            this.saveToJournal(textAreaEl.value);
        });
        
        // Start transcription
        this.startTranscription(loadingEl, textAreaEl, saveBtn);
    }
    
    /**
     * Starts the transcription process
     * @param loadingEl The loading element
     * @param textAreaEl The text area element
     * @param saveBtn The save button
     */
    private async startTranscription(
        loadingEl: HTMLElement, 
        textAreaEl: HTMLTextAreaElement,
        saveBtn: HTMLButtonElement
    ): Promise<void> {
        if (this.isTranscribing) {
            return;
        }
        
        this.isTranscribing = true;
        
        try {
            // Process voice input
            this.transcribedText = await this.advancedAI.processVoiceInput(this.audioBlob);
            
            // Hide loading, show text area
            loadingEl.style.display = 'none';
            textAreaEl.style.display = 'block';
            textAreaEl.value = this.transcribedText;
            saveBtn.style.display = 'block';
            
            // Focus text area
            textAreaEl.focus();
        } catch (error) {
            console.error('Error transcribing voice:', error);
            
            // Hide loading, show error
            loadingEl.style.display = 'none';
            const errorEl = this.contentEl.createEl('div', { 
                cls: 'deleometer-error',
                text: `Failed to transcribe voice: ${error.message || 'Unknown error'}`
            });
            
            // Add retry button
            const retryBtn = errorEl.createEl('button', { text: 'Retry' });
            retryBtn.addEventListener('click', () => {
                errorEl.remove();
                loadingEl.style.display = 'flex';
                this.isTranscribing = false;
                this.startTranscription(loadingEl, textAreaEl, saveBtn);
            });
        }
    }
    
    /**
     * Saves the transcribed text to a journal entry
     * @param text The text to save
     */
    private async saveToJournal(text: string): Promise<void> {
        try {
            // Create a new markdown file
            const fileName = `Voice_Journal_${new Date().toISOString().slice(0, 10)}.md`;
            const fileContent = `# Voice Journal Entry - ${new Date().toLocaleString()}\n\n${text}`;
            
            await this.app.vault.create(fileName, fileContent);
            
            new Notice(`Voice journal entry saved as ${fileName}`);
            this.close();
            
            // Open the file
            const file = this.app.vault.getAbstractFileByPath(fileName);
            if (file) {
                const leaf = this.app.workspace.getLeaf(false);
                await leaf.openFile(file as any);
            }
        } catch (error) {
            console.error('Error saving voice journal entry:', error);
            new Notice('Failed to save voice journal entry.');
        }
    }
    
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        
        // Clean up audio URL
        if (this.audioElement) {
            URL.revokeObjectURL(this.audioElement.src);
        }
    }
}

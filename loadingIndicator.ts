import { setIcon } from 'obsidian';

export class LoadingIndicator {
    private container: HTMLElement;
    private text: HTMLElement;
    private spinner: HTMLElement;
    private isVisible = false;
    private animationFrame: number | null = null;
    private rotation = 0;

    constructor(parentEl: HTMLElement, initialText = 'Loading...') {
        // Create container
        this.container = parentEl.createDiv({ cls: 'deleometer-loading-indicator' });
        this.container.style.display = 'none';
        
        // Create spinner
        this.spinner = this.container.createDiv({ cls: 'deleometer-spinner' });
        setIcon(this.spinner, 'loader');
        
        // Create text element
        this.text = this.container.createDiv({ cls: 'deleometer-loading-text', text: initialText });
    }

    public show(text?: string): void {
        if (text) {
            this.text.textContent = text;
        }
        
        this.container.style.display = 'flex';
        this.isVisible = true;
        
        // Start animation
        this.startAnimation();
    }

    public hide(): void {
        this.container.style.display = 'none';
        this.isVisible = false;
        
        // Stop animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    public updateText(text: string): void {
        this.text.textContent = text;
    }

    private startAnimation(): void {
        const animate = () => {
            if (!this.isVisible) return;
            
            this.rotation += 5;
            this.spinner.style.transform = `rotate(${this.rotation}deg)`;
            
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        this.animationFrame = requestAnimationFrame(animate);
    }

    public remove(): void {
        this.hide();
        this.container.remove();
    }
}

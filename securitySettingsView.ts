import { App, PluginSettingTab, Setting, Modal, Notice } from 'obsidian';
import { SecurityService, SecurityLevel, SecurityOptions } from './securityService';
import { LocalProcessingService, LocalProcessingOptions } from './localProcessingService';
import { Deleometer } from './main';

/**
 * Settings tab for security settings
 */
export class SecuritySettingsTab extends PluginSettingTab {
    private plugin: Deleometer;
    private securityService: SecurityService;
    private localProcessingService: LocalProcessingService | null;

    constructor(app: App, plugin: Deleometer, securityService: SecurityService, localProcessingService: LocalProcessingService | null = null) {
        super(app, plugin);
        this.plugin = plugin;
        this.securityService = securityService;
        this.localProcessingService = localProcessingService;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Deleometer Security Settings' });
        
        // Security level
        new Setting(containerEl)
            .setName('Security Level')
            .setDesc('Set the overall security level for the plugin')
            .addDropdown(dropdown => {
                dropdown.addOption(SecurityLevel.STANDARD, 'Standard')
                dropdown.addOption(SecurityLevel.HIGH, 'High')
                dropdown.addOption(SecurityLevel.MAXIMUM, 'Maximum')
                dropdown.setValue(this.securityService.getOptions().securityLevel)
                dropdown.onChange(async (value: SecurityLevel) => {
                    // Update security level
                    const options = this.securityService.getOptions();
                    
                    // Apply preset settings based on security level
                    if (value === SecurityLevel.STANDARD) {
                        this.securityService.updateOptions({
                            securityLevel: SecurityLevel.STANDARD,
                            enableEncryption: false,
                            localProcessingOnly: false,
                            enableAuditLog: true,
                            passwordProtection: false,
                            autoLockTimeout: 0,
                            secureDeleteEnabled: false
                        });
                    } else if (value === SecurityLevel.HIGH) {
                        this.securityService.updateOptions({
                            securityLevel: SecurityLevel.HIGH,
                            enableEncryption: true,
                            localProcessingOnly: false,
                            enableAuditLog: true,
                            passwordProtection: true,
                            autoLockTimeout: 30,
                            secureDeleteEnabled: true
                        });
                        
                        // Prompt for password if not set
                        if (!options.encryptionPassword) {
                            new PasswordModal(this.app, this.securityService).open();
                        }
                    } else if (value === SecurityLevel.MAXIMUM) {
                        this.securityService.updateOptions({
                            securityLevel: SecurityLevel.MAXIMUM,
                            enableEncryption: true,
                            localProcessingOnly: true,
                            enableAuditLog: true,
                            passwordProtection: true,
                            autoLockTimeout: 15,
                            secureDeleteEnabled: true
                        });
                        
                        // Prompt for password if not set
                        if (!options.encryptionPassword) {
                            new PasswordModal(this.app, this.securityService).open();
                        }
                        
                        // Initialize local processing if not already
                        if (this.localProcessingService && !this.localProcessingService.isLocalModelLoaded()) {
                            this.localProcessingService.initialize();
                        }
                    }
                    
                    // Refresh the settings view
                    this.display();
                });
            });
        
        // Encryption
        new Setting(containerEl)
            .setName('Enable Encryption')
            .setDesc('Encrypt sensitive data to protect your privacy')
            .addToggle(toggle => toggle
                .setValue(this.securityService.getOptions().enableEncryption)
                .onChange(async (value) => {
                    if (value && !this.securityService.getOptions().encryptionPassword) {
                        // Prompt for password if enabling encryption
                        new PasswordModal(this.app, this.securityService).open();
                    }
                    
                    this.securityService.updateOptions({
                        enableEncryption: value
                    });
                }));
        
        // Password protection
        new Setting(containerEl)
            .setName('Password Protection')
            .setDesc('Require a password to access sensitive data')
            .addToggle(toggle => toggle
                .setValue(this.securityService.getOptions().passwordProtection)
                .onChange(async (value) => {
                    if (value && !this.securityService.getOptions().encryptionPassword) {
                        // Prompt for password if enabling password protection
                        new PasswordModal(this.app, this.securityService).open();
                    }
                    
                    this.securityService.updateOptions({
                        passwordProtection: value
                    });
                }));
        
        // Change password button
        if (this.securityService.getOptions().enableEncryption || this.securityService.getOptions().passwordProtection) {
            new Setting(containerEl)
                .setName('Change Password')
                .setDesc('Change the encryption and protection password')
                .addButton(button => button
                    .setButtonText('Change Password')
                    .onClick(() => {
                        new PasswordModal(this.app, this.securityService, true).open();
                    }));
        }
        
        // Auto-lock timeout
        new Setting(containerEl)
            .setName('Auto-Lock Timeout')
            .setDesc('Automatically lock after a period of inactivity (in minutes, 0 to disable)')
            .addSlider(slider => slider
                .setLimits(0, 60, 5)
                .setValue(this.securityService.getOptions().autoLockTimeout)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.securityService.updateOptions({
                        autoLockTimeout: value
                    });
                }));
        
        // Local processing only
        new Setting(containerEl)
            .setName('Local Processing Only')
            .setDesc('Process all data locally without sending it to external services')
            .addToggle(toggle => toggle
                .setValue(this.securityService.getOptions().localProcessingOnly)
                .onChange(async (value) => {
                    this.securityService.updateOptions({
                        localProcessingOnly: value
                    });
                    
                    // Initialize local processing if enabling
                    if (value && this.localProcessingService && !this.localProcessingService.isLocalModelLoaded()) {
                        this.localProcessingService.initialize();
                    }
                }));
        
        // Audit logging
        new Setting(containerEl)
            .setName('Enable Audit Logging')
            .setDesc('Keep a log of all security-related actions')
            .addToggle(toggle => toggle
                .setValue(this.securityService.getOptions().enableAuditLog)
                .onChange(async (value) => {
                    this.securityService.updateOptions({
                        enableAuditLog: value
                    });
                }));
        
        // Secure deletion
        new Setting(containerEl)
            .setName('Secure Deletion')
            .setDesc('Securely delete files to prevent recovery')
            .addToggle(toggle => toggle
                .setValue(this.securityService.getOptions().secureDeleteEnabled)
                .onChange(async (value) => {
                    this.securityService.updateOptions({
                        secureDeleteEnabled: value
                    });
                }));
        
        // View audit log button
        if (this.securityService.getOptions().enableAuditLog) {
            new Setting(containerEl)
                .setName('View Audit Log')
                .setDesc('View the security audit log')
                .addButton(button => button
                    .setButtonText('View Log')
                    .onClick(() => {
                        new AuditLogModal(this.app, this.securityService).open();
                    }));
        }
        
        // Generate privacy report button
        new Setting(containerEl)
            .setName('Privacy Report')
            .setDesc('Generate a privacy report')
            .addButton(button => button
                .setButtonText('Generate Report')
                .onClick(() => {
                    new PrivacyReportModal(this.app, this.securityService).open();
                }));
        
        // Local processing settings
        if (this.securityService.getOptions().localProcessingOnly && this.localProcessingService) {
            containerEl.createEl('h3', { text: 'Local Processing Settings' });
            
            const localOptions = this.localProcessingService.getOptions();
            
            // Model path
            new Setting(containerEl)
                .setName('Model Path')
                .setDesc('Path to the local model files')
                .addText(text => text
                    .setValue(localOptions.modelPath)
                    .onChange(async (value) => {
                        this.localProcessingService?.updateOptions({
                            modelPath: value
                        });
                    }));
            
            // Low resource mode
            new Setting(containerEl)
                .setName('Low Resource Mode')
                .setDesc('Use less memory and CPU at the cost of quality')
                .addToggle(toggle => toggle
                    .setValue(localOptions.lowResourceMode)
                    .onChange(async (value) => {
                        this.localProcessingService?.updateOptions({
                            lowResourceMode: value
                        });
                    }));
            
            // Max tokens
            new Setting(containerEl)
                .setName('Max Tokens')
                .setDesc('Maximum number of tokens to generate')
                .addSlider(slider => slider
                    .setLimits(100, 2000, 100)
                    .setValue(localOptions.maxTokens)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.localProcessingService?.updateOptions({
                            maxTokens: value
                        });
                    }));
            
            // Batch processing
            new Setting(containerEl)
                .setName('Enable Batching')
                .setDesc('Process data in batches to improve performance')
                .addToggle(toggle => toggle
                    .setValue(localOptions.enableBatching)
                    .onChange(async (value) => {
                        this.localProcessingService?.updateOptions({
                            enableBatching: value
                        });
                    }));
            
            // Batch size
            if (localOptions.enableBatching) {
                new Setting(containerEl)
                    .setName('Batch Size')
                    .setDesc('Number of items to process in each batch')
                    .addSlider(slider => slider
                        .setLimits(1, 10, 1)
                        .setValue(localOptions.batchSize)
                        .setDynamicTooltip()
                        .onChange(async (value) => {
                            this.localProcessingService?.updateOptions({
                                batchSize: value
                            });
                        }));
            }
        }
        
        // Privacy policy
        containerEl.createEl('h3', { text: 'Privacy Policy' });
        
        const privacyPolicy = containerEl.createDiv();
        privacyPolicy.innerHTML = `
            <p>The Deleometer plugin is designed with your privacy in mind. Here's how we protect your data:</p>
            <ul>
                <li><strong>Local Storage:</strong> All your journal entries and analysis results are stored locally in your Obsidian vault.</li>
                <li><strong>Encryption:</strong> When enabled, your sensitive data is encrypted using AES-256 encryption.</li>
                <li><strong>Local Processing:</strong> When enabled, all analysis is performed locally on your device without sending data to external services.</li>
                <li><strong>Audit Logging:</strong> When enabled, all security-related actions are logged for your review.</li>
                <li><strong>No Data Collection:</strong> We do not collect any personal data or usage statistics.</li>
            </ul>
            <p>Your journal entries and personal insights are yours alone. We believe in providing tools that respect your privacy and security.</p>
        `;
    }
}

/**
 * Modal for setting or changing password
 */
class PasswordModal extends Modal {
    private securityService: SecurityService;
    private isChangingPassword: boolean;

    constructor(app: App, securityService: SecurityService, isChangingPassword: boolean = false) {
        super(app);
        this.securityService = securityService;
        this.isChangingPassword = isChangingPassword;
    }

    onOpen() {
        const { contentEl } = this;
        
        contentEl.createEl('h2', { text: this.isChangingPassword ? 'Change Password' : 'Set Password' });
        
        if (this.isChangingPassword) {
            // Current password field
            contentEl.createEl('p', { text: 'Enter your current password:' });
            const currentPasswordInput = contentEl.createEl('input', {
                type: 'password',
                attr: {
                    placeholder: 'Current password'
                }
            });
            
            contentEl.createEl('br');
            contentEl.createEl('br');
        }
        
        // New password field
        contentEl.createEl('p', { text: 'Enter a strong password:' });
        const passwordInput = contentEl.createEl('input', {
            type: 'password',
            attr: {
                placeholder: 'New password'
            }
        });
        
        contentEl.createEl('br');
        contentEl.createEl('br');
        
        // Confirm password field
        contentEl.createEl('p', { text: 'Confirm your password:' });
        const confirmPasswordInput = contentEl.createEl('input', {
            type: 'password',
            attr: {
                placeholder: 'Confirm password'
            }
        });
        
        contentEl.createEl('br');
        contentEl.createEl('br');
        
        // Password strength meter
        const strengthMeter = contentEl.createEl('div', { cls: 'password-strength-meter' });
        const strengthLabel = contentEl.createEl('div', { cls: 'password-strength-label' });
        
        // Update password strength as user types
        passwordInput.addEventListener('input', () => {
            const strength = this.calculatePasswordStrength(passwordInput.value);
            strengthMeter.style.width = `${strength}%`;
            strengthMeter.style.backgroundColor = this.getStrengthColor(strength);
            strengthLabel.setText(this.getStrengthLabel(strength));
        });
        
        contentEl.createEl('br');
        
        // Submit button
        const submitButton = contentEl.createEl('button', {
            text: 'Save Password',
            cls: 'mod-cta'
        });
        
        // Cancel button
        const cancelButton = contentEl.createEl('button', {
            text: 'Cancel'
        });
        
        // Handle submit
        submitButton.addEventListener('click', () => {
            if (passwordInput.value !== confirmPasswordInput.value) {
                new Notice('Passwords do not match');
                return;
            }
            
            if (passwordInput.value.length < 8) {
                new Notice('Password must be at least 8 characters');
                return;
            }
            
            const strength = this.calculatePasswordStrength(passwordInput.value);
            if (strength < 50) {
                new Notice('Please use a stronger password');
                return;
            }
            
            // Update password
            this.securityService.updateOptions({
                encryptionPassword: passwordInput.value
            });
            
            new Notice('Password saved');
            this.close();
        });
        
        // Handle cancel
        cancelButton.addEventListener('click', () => {
            this.close();
        });
        
        // Add some CSS
        contentEl.createEl('style', {
            text: `
                .password-strength-meter {
                    height: 10px;
                    background-color: #ddd;
                    border-radius: 5px;
                    margin-top: 10px;
                    width: 0%;
                    transition: width 0.3s, background-color 0.3s;
                }
                
                .password-strength-label {
                    margin-top: 5px;
                    font-size: 12px;
                }
                
                input[type="password"] {
                    width: 100%;
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
                
                button {
                    margin-right: 10px;
                    padding: 8px 16px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                }
                
                button.mod-cta {
                    background-color: var(--interactive-accent);
                    color: var(--text-on-accent);
                }
            `
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    /**
     * Calculate password strength (0-100)
     * @param password Password to check
     * @returns Strength score (0-100)
     */
    private calculatePasswordStrength(password: string): number {
        if (!password) return 0;
        
        let score = 0;
        
        // Length
        score += Math.min(password.length * 4, 40);
        
        // Complexity
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^a-zA-Z0-9]/.test(password)) score += 10;
        
        // Variety
        const uniqueChars = new Set(password.split('')).size;
        score += Math.min(uniqueChars * 2, 20);
        
        return Math.min(score, 100);
    }

    /**
     * Get color for password strength
     * @param strength Strength score (0-100)
     * @returns Color string
     */
    private getStrengthColor(strength: number): string {
        if (strength < 30) return '#ff4d4d';
        if (strength < 60) return '#ffaa00';
        if (strength < 80) return '#ffff00';
        return '#00cc00';
    }

    /**
     * Get label for password strength
     * @param strength Strength score (0-100)
     * @returns Strength label
     */
    private getStrengthLabel(strength: number): string {
        if (strength < 30) return 'Very Weak';
        if (strength < 60) return 'Weak';
        if (strength < 80) return 'Good';
        return 'Strong';
    }
}

/**
 * Modal for viewing audit log
 */
class AuditLogModal extends Modal {
    private securityService: SecurityService;

    constructor(app: App, securityService: SecurityService) {
        super(app);
        this.securityService = securityService;
    }

    onOpen() {
        const { contentEl } = this;
        
        contentEl.createEl('h2', { text: 'Security Audit Log' });
        
        try {
            const auditLog = this.securityService.getAuditLog();
            
            if (auditLog.length === 0) {
                contentEl.createEl('p', { text: 'No audit log entries found.' });
                return;
            }
            
            // Create table
            const table = contentEl.createEl('table', { cls: 'audit-log-table' });
            
            // Create header
            const header = table.createEl('tr');
            header.createEl('th', { text: 'Time' });
            header.createEl('th', { text: 'Action' });
            header.createEl('th', { text: 'Resource' });
            header.createEl('th', { text: 'Details' });
            
            // Create rows
            auditLog.slice().reverse().forEach(entry => {
                const row = table.createEl('tr');
                row.createEl('td', { text: new Date(entry.timestamp).toLocaleString() });
                row.createEl('td', { text: entry.action });
                row.createEl('td', { text: entry.resource });
                row.createEl('td', { text: entry.details });
            });
            
            // Add clear button
            const clearButton = contentEl.createEl('button', {
                text: 'Clear Audit Log',
                cls: 'mod-warning'
            });
            
            clearButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear the audit log? This action cannot be undone.')) {
                    this.securityService.clearAuditLog();
                    new Notice('Audit log cleared');
                    this.close();
                }
            });
            
            // Add some CSS
            contentEl.createEl('style', {
                text: `
                    .audit-log-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    
                    .audit-log-table th, .audit-log-table td {
                        padding: 8px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    
                    .audit-log-table th {
                        background-color: var(--background-secondary);
                    }
                    
                    button.mod-warning {
                        background-color: #ff4d4d;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 4px;
                        border: none;
                        cursor: pointer;
                    }
                `
            });
        } catch (error) {
            contentEl.createEl('p', { text: 'Error accessing audit log. The system may be locked.' });
            
            // Add unlock button
            const unlockButton = contentEl.createEl('button', {
                text: 'Unlock System',
                cls: 'mod-cta'
            });
            
            unlockButton.addEventListener('click', () => {
                new UnlockModal(this.app, this.securityService, () => {
                    this.close();
                    new AuditLogModal(this.app, this.securityService).open();
                }).open();
            });
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

/**
 * Modal for unlocking the system
 */
class UnlockModal extends Modal {
    private securityService: SecurityService;
    private onUnlock: () => void;

    constructor(app: App, securityService: SecurityService, onUnlock: () => void) {
        super(app);
        this.securityService = securityService;
        this.onUnlock = onUnlock;
    }

    onOpen() {
        const { contentEl } = this;
        
        contentEl.createEl('h2', { text: 'Unlock System' });
        
        contentEl.createEl('p', { text: 'Enter your password to unlock the system:' });
        
        const passwordInput = contentEl.createEl('input', {
            type: 'password',
            attr: {
                placeholder: 'Password'
            }
        });
        
        contentEl.createEl('br');
        contentEl.createEl('br');
        
        const unlockButton = contentEl.createEl('button', {
            text: 'Unlock',
            cls: 'mod-cta'
        });
        
        const cancelButton = contentEl.createEl('button', {
            text: 'Cancel'
        });
        
        unlockButton.addEventListener('click', () => {
            if (this.securityService.unlock(passwordInput.value)) {
                new Notice('System unlocked');
                this.close();
                this.onUnlock();
            } else {
                new Notice('Incorrect password');
            }
        });
        
        cancelButton.addEventListener('click', () => {
            this.close();
        });
        
        // Add some CSS
        contentEl.createEl('style', {
            text: `
                input[type="password"] {
                    width: 100%;
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
                
                button {
                    margin-right: 10px;
                    padding: 8px 16px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                }
                
                button.mod-cta {
                    background-color: var(--interactive-accent);
                    color: var(--text-on-accent);
                }
            `
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

/**
 * Modal for viewing privacy report
 */
class PrivacyReportModal extends Modal {
    private securityService: SecurityService;

    constructor(app: App, securityService: SecurityService) {
        super(app);
        this.securityService = securityService;
    }

    onOpen() {
        const { contentEl } = this;
        
        contentEl.createEl('h2', { text: 'Privacy Report' });
        
        try {
            const report = this.securityService.generatePrivacyReport();
            
            // Create markdown content
            const reportContent = contentEl.createDiv();
            reportContent.innerHTML = this.markdownToHtml(report);
            
            // Add export button
            const exportButton = contentEl.createEl('button', {
                text: 'Export Report',
                cls: 'mod-cta'
            });
            
            exportButton.addEventListener('click', async () => {
                try {
                    const fileName = `deleometer_privacy_report_${new Date().toISOString().split('T')[0]}.md`;
                    await this.app.vault.create(fileName, report);
                    new Notice(`Privacy report exported to ${fileName}`);
                } catch (error) {
                    console.error('Error exporting privacy report:', error);
                    new Notice('Error exporting privacy report');
                }
            });
            
            // Add some CSS
            contentEl.createEl('style', {
                text: `
                    button.mod-cta {
                        background-color: var(--interactive-accent);
                        color: var(--text-on-accent);
                        padding: 8px 16px;
                        border-radius: 4px;
                        border: none;
                        cursor: pointer;
                        margin-top: 20px;
                    }
                `
            });
        } catch (error) {
            contentEl.createEl('p', { text: 'Error generating privacy report. The system may be locked.' });
            
            // Add unlock button
            const unlockButton = contentEl.createEl('button', {
                text: 'Unlock System',
                cls: 'mod-cta'
            });
            
            unlockButton.addEventListener('click', () => {
                new UnlockModal(this.app, this.securityService, () => {
                    this.close();
                    new PrivacyReportModal(this.app, this.securityService).open();
                }).open();
            });
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    /**
     * Convert markdown to HTML
     * @param markdown Markdown text
     * @returns HTML string
     */
    private markdownToHtml(markdown: string): string {
        // Very simple markdown to HTML conversion
        // In a real implementation, use a proper markdown parser
        return markdown
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    }
}

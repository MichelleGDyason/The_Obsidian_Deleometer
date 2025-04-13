import { App, Notice } from 'obsidian';
import * as CryptoJS from 'crypto-js';

/**
 * Security levels for the application
 */
export enum SecurityLevel {
    STANDARD = 'standard',
    HIGH = 'high',
    MAXIMUM = 'maximum'
}

/**
 * Security options for the application
 */
export interface SecurityOptions {
    securityLevel: SecurityLevel;
    enableEncryption: boolean;
    localProcessingOnly: boolean;
    enableAuditLog: boolean;
    passwordProtection: boolean;
    encryptionPassword?: string;
    autoLockTimeout: number; // in minutes
    secureDeleteEnabled: boolean;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
    timestamp: number;
    action: 'read' | 'write' | 'analyze' | 'delete' | 'export' | 'import' | 'login' | 'logout';
    resource: string;
    details: string;
    userId?: string;
}

/**
 * Service for handling security and privacy features
 */
export class SecurityService {
    private app: App;
    private options: SecurityOptions;
    private auditLog: AuditLogEntry[] = [];
    private isLocked: boolean = false;
    private lockTimer: NodeJS.Timeout | null = null;
    private encryptionKey: string | null = null;

    constructor(app: App, options: SecurityOptions) {
        this.app = app;
        this.options = options;
        
        // Initialize encryption key if encryption is enabled
        if (options.enableEncryption && options.encryptionPassword) {
            this.setEncryptionKey(options.encryptionPassword);
        }
        
        // Start auto-lock timer if enabled
        if (options.autoLockTimeout > 0) {
            this.startLockTimer();
        }
    }

    /**
     * Set the encryption key based on password
     * @param password The encryption password
     */
    public setEncryptionKey(password: string): void {
        // Generate a strong encryption key from the password
        this.encryptionKey = CryptoJS.PBKDF2(
            password,
            'deleometer-salt', // In a real implementation, use a unique salt per user
            { keySize: 256 / 32, iterations: 1000 }
        ).toString();
        
        this.logAction('login', 'system', 'Encryption key set');
    }

    /**
     * Encrypt text
     * @param text Text to encrypt
     * @returns Encrypted text
     */
    public encrypt(text: string): string {
        if (!this.options.enableEncryption || !this.encryptionKey) {
            return text;
        }
        
        try {
            const encrypted = CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
            return encrypted;
        } catch (error) {
            console.error('Encryption error:', error);
            new Notice('Error encrypting data. Using unencrypted data.');
            return text;
        }
    }

    /**
     * Decrypt text
     * @param encryptedText Encrypted text
     * @returns Decrypted text
     */
    public decrypt(encryptedText: string): string {
        if (!this.options.enableEncryption || !this.encryptionKey) {
            return encryptedText;
        }
        
        if (this.isLocked) {
            throw new Error('System is locked. Please unlock first.');
        }
        
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedText, this.encryptionKey).toString(CryptoJS.enc.Utf8);
            return decrypted;
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Failed to decrypt data. The encryption key may be incorrect.');
        }
    }

    /**
     * Check if content is encrypted
     * @param content Content to check
     * @returns Whether the content is encrypted
     */
    public isEncrypted(content: string): boolean {
        // Simple heuristic: encrypted content is base64 and doesn't look like normal text
        const base64Regex = /^[A-Za-z0-9+/=]+$/;
        return base64Regex.test(content) && !content.includes(' ');
    }

    /**
     * Lock the system
     */
    public lock(): void {
        this.isLocked = true;
        this.encryptionKey = null;
        this.logAction('logout', 'system', 'System locked');
        new Notice('System locked for security');
    }

    /**
     * Unlock the system
     * @param password The encryption password
     * @returns Whether unlock was successful
     */
    public unlock(password: string): boolean {
        try {
            this.setEncryptionKey(password);
            this.isLocked = false;
            this.startLockTimer();
            this.logAction('login', 'system', 'System unlocked');
            return true;
        } catch (error) {
            console.error('Unlock error:', error);
            return false;
        }
    }

    /**
     * Start the auto-lock timer
     */
    private startLockTimer(): void {
        if (this.lockTimer) {
            clearTimeout(this.lockTimer);
        }
        
        if (this.options.autoLockTimeout > 0) {
            this.lockTimer = setTimeout(() => {
                this.lock();
            }, this.options.autoLockTimeout * 60 * 1000);
        }
    }

    /**
     * Reset the auto-lock timer (call this on user activity)
     */
    public resetLockTimer(): void {
        if (this.options.autoLockTimeout > 0) {
            this.startLockTimer();
        }
    }

    /**
     * Log an action to the audit log
     * @param action The action performed
     * @param resource The resource affected
     * @param details Additional details
     */
    public logAction(action: 'read' | 'write' | 'analyze' | 'delete' | 'export' | 'import' | 'login' | 'logout', resource: string, details: string): void {
        if (!this.options.enableAuditLog) {
            return;
        }
        
        const entry: AuditLogEntry = {
            timestamp: Date.now(),
            action,
            resource,
            details
        };
        
        this.auditLog.push(entry);
        
        // In a real implementation, you might want to persist the audit log
        this.saveAuditLog();
    }

    /**
     * Save the audit log to disk
     */
    private async saveAuditLog(): Promise<void> {
        try {
            const auditLogPath = '.obsidian/plugins/deleometer/audit_log.json';
            
            // Encrypt the audit log if encryption is enabled
            const auditLogContent = this.options.enableEncryption && this.encryptionKey
                ? this.encrypt(JSON.stringify(this.auditLog))
                : JSON.stringify(this.auditLog);
            
            await this.app.vault.adapter.write(auditLogPath, auditLogContent);
        } catch (error) {
            console.error('Error saving audit log:', error);
        }
    }

    /**
     * Get the audit log
     * @returns The audit log
     */
    public getAuditLog(): AuditLogEntry[] {
        if (this.isLocked) {
            throw new Error('System is locked. Please unlock first.');
        }
        
        return [...this.auditLog];
    }

    /**
     * Clear the audit log
     */
    public clearAuditLog(): void {
        if (this.isLocked) {
            throw new Error('System is locked. Please unlock first.');
        }
        
        this.auditLog = [];
        this.saveAuditLog();
        this.logAction('delete', 'audit_log', 'Audit log cleared');
    }

    /**
     * Securely delete a file
     * @param filePath Path to the file
     */
    public async secureDelete(filePath: string): Promise<void> {
        if (!this.options.secureDeleteEnabled) {
            throw new Error('Secure deletion is not enabled');
        }
        
        try {
            // First, overwrite the file with random data
            const fileSize = await this.getFileSize(filePath);
            const randomData = this.generateRandomData(fileSize);
            await this.app.vault.adapter.write(filePath, randomData);
            
            // Then delete the file
            await this.app.vault.adapter.remove(filePath);
            
            this.logAction('delete', filePath, 'File securely deleted');
        } catch (error) {
            console.error('Secure delete error:', error);
            throw new Error('Failed to securely delete file');
        }
    }

    /**
     * Get the size of a file
     * @param filePath Path to the file
     * @returns Size of the file in bytes
     */
    private async getFileSize(filePath: string): Promise<number> {
        try {
            const stat = await this.app.vault.adapter.stat(filePath);
            return stat?.size || 0;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Generate random data
     * @param size Size of the data in bytes
     * @returns Random data
     */
    private generateRandomData(size: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < size; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Check if the system is locked
     * @returns Whether the system is locked
     */
    public isSystemLocked(): boolean {
        return this.isLocked;
    }

    /**
     * Update security options
     * @param options New security options
     */
    public updateOptions(options: Partial<SecurityOptions>): void {
        this.options = { ...this.options, ...options };
        
        // Update encryption key if password changed
        if (options.encryptionPassword) {
            this.setEncryptionKey(options.encryptionPassword);
        }
        
        // Update auto-lock timer
        if (options.autoLockTimeout !== undefined) {
            this.startLockTimer();
        }
        
        this.logAction('write', 'security_options', 'Security options updated');
    }

    /**
     * Get current security options
     * @returns Current security options (without sensitive data)
     */
    public getOptions(): Omit<SecurityOptions, 'encryptionPassword'> {
        const { encryptionPassword, ...safeOptions } = this.options;
        return safeOptions;
    }

    /**
     * Check if local processing only is enabled
     * @returns Whether local processing only is enabled
     */
    public isLocalProcessingOnly(): boolean {
        return this.options.localProcessingOnly;
    }

    /**
     * Generate a privacy report
     * @returns Privacy report
     */
    public generatePrivacyReport(): string {
        const report = `
# Deleometer Privacy Report

## Security Settings
- Security Level: ${this.options.securityLevel}
- Encryption: ${this.options.enableEncryption ? 'Enabled' : 'Disabled'}
- Local Processing Only: ${this.options.localProcessingOnly ? 'Enabled' : 'Disabled'}
- Audit Logging: ${this.options.enableAuditLog ? 'Enabled' : 'Disabled'}
- Password Protection: ${this.options.passwordProtection ? 'Enabled' : 'Disabled'}
- Auto-Lock: ${this.options.autoLockTimeout > 0 ? `${this.options.autoLockTimeout} minutes` : 'Disabled'}
- Secure Deletion: ${this.options.secureDeleteEnabled ? 'Enabled' : 'Disabled'}

## Data Storage
- All data is stored locally in your Obsidian vault
- ${this.options.enableEncryption ? 'Data is encrypted at rest' : 'Data is not encrypted'}
- ${this.options.localProcessingOnly ? 'All processing happens locally on your device' : 'Some processing may use external services'}

## Audit Summary
- Total actions logged: ${this.auditLog.length}
- First activity: ${this.auditLog.length > 0 ? new Date(this.auditLog[0].timestamp).toLocaleString() : 'N/A'}
- Last activity: ${this.auditLog.length > 0 ? new Date(this.auditLog[this.auditLog.length - 1].timestamp).toLocaleString() : 'N/A'}

## Recommendations
${this.generateSecurityRecommendations()}
`;
        
        return report;
    }

    /**
     * Generate security recommendations
     * @returns Security recommendations
     */
    private generateSecurityRecommendations(): string {
        const recommendations = [];
        
        if (!this.options.enableEncryption) {
            recommendations.push('- Enable encryption for better data protection');
        }
        
        if (!this.options.passwordProtection) {
            recommendations.push('- Enable password protection to prevent unauthorized access');
        }
        
        if (this.options.autoLockTimeout === 0) {
            recommendations.push('- Enable auto-lock to secure your data when you\'re away');
        } else if (this.options.autoLockTimeout > 30) {
            recommendations.push('- Consider reducing auto-lock timeout for better security');
        }
        
        if (!this.options.secureDeleteEnabled) {
            recommendations.push('- Enable secure deletion for sensitive data');
        }
        
        if (!this.options.localProcessingOnly) {
            recommendations.push('- Consider enabling local processing only for maximum privacy');
        }
        
        return recommendations.length > 0 
            ? recommendations.join('\n')
            : '- Your security settings are already at a high level';
    }
}

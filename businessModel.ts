import { Notice } from 'obsidian';
import { AnalysisResult } from './types';

/**
 * Business Model Module for Deleometer
 * Implements the freemium approach with premium features and subscription management
 */
export class BusinessModel {
    private settings: BusinessModelSettings;
    private subscriptionStatus: SubscriptionStatus | null = null;
    private usageStats: UsageStats = {
        freeAnalyses: 0,
        premiumAnalyses: 0,
        lastResetDate: new Date().toISOString()
    };
    
    constructor(settings: BusinessModelSettings) {
        this.settings = settings;
        this.initializeSubscription();
    }
    
    /**
     * Initializes the subscription
     */
    private async initializeSubscription(): Promise<void> {
        try {
            // In a real implementation, we would fetch the subscription status from a server
            // For now, we'll use the settings
            if (this.settings.licenseKey) {
                await this.validateLicenseKey(this.settings.licenseKey);
            } else {
                this.subscriptionStatus = {
                    type: 'free',
                    expirationDate: null,
                    features: this.getFreeTierFeatures()
                };
            }
            
            // Reset usage stats if needed
            this.checkUsageReset();
        } catch (error) {
            console.error('[BusinessModel] Error initializing subscription:', error);
            
            // Default to free tier
            this.subscriptionStatus = {
                type: 'free',
                expirationDate: null,
                features: this.getFreeTierFeatures()
            };
        }
    }
    
    /**
     * Validates a license key
     * @param licenseKey The license key
     * @returns Promise<void>
     */
    private async validateLicenseKey(licenseKey: string): Promise<void> {
        try {
            console.log(`[BusinessModel] Validating license key: ${licenseKey}`);
            
            // In a real implementation, we would validate the license key with a server
            // For now, we'll simulate it
            if (licenseKey.startsWith('PREMIUM-')) {
                // Premium tier
                this.subscriptionStatus = {
                    type: 'premium',
                    expirationDate: this.addMonths(new Date(), 12).toISOString(),
                    features: this.getPremiumTierFeatures()
                };
                
                console.log('[BusinessModel] Premium license key validated');
            } else if (licenseKey.startsWith('PRO-')) {
                // Pro tier
                this.subscriptionStatus = {
                    type: 'pro',
                    expirationDate: this.addMonths(new Date(), 12).toISOString(),
                    features: this.getProTierFeatures()
                };
                
                console.log('[BusinessModel] Pro license key validated');
            } else {
                // Invalid license key
                throw new Error('Invalid license key');
            }
        } catch (error) {
            console.error('[BusinessModel] Error validating license key:', error);
            throw new Error(`Failed to validate license key: ${error.message || 'Unknown error'}`);
        }
    }
    
    /**
     * Adds months to a date
     * @param date The date
     * @param months The number of months to add
     * @returns Date The new date
     */
    private addMonths(date: Date, months: number): Date {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }
    
    /**
     * Gets the free tier features
     * @returns Record<string, boolean> The features
     */
    private getFreeTierFeatures(): Record<string, boolean> {
        return {
            basicEmotionAnalysis: true,
            psychoanalysis: true,
            personalityAnalysis: false,
            schizoanalysis: false,
            dashboard: true,
            dataExport: false,
            advancedTemplates: false,
            voiceJournaling: false,
            apiAccess: false,
            unlimitedAnalyses: false
        };
    }
    
    /**
     * Gets the premium tier features
     * @returns Record<string, boolean> The features
     */
    private getPremiumTierFeatures(): Record<string, boolean> {
        return {
            basicEmotionAnalysis: true,
            psychoanalysis: true,
            personalityAnalysis: true,
            schizoanalysis: true,
            dashboard: true,
            dataExport: true,
            advancedTemplates: true,
            voiceJournaling: false,
            apiAccess: false,
            unlimitedAnalyses: false
        };
    }
    
    /**
     * Gets the pro tier features
     * @returns Record<string, boolean> The features
     */
    private getProTierFeatures(): Record<string, boolean> {
        return {
            basicEmotionAnalysis: true,
            psychoanalysis: true,
            personalityAnalysis: true,
            schizoanalysis: true,
            dashboard: true,
            dataExport: true,
            advancedTemplates: true,
            voiceJournaling: true,
            apiAccess: true,
            unlimitedAnalyses: true
        };
    }
    
    /**
     * Checks if a feature is available
     * @param feature The feature to check
     * @returns boolean True if the feature is available
     */
    public isFeatureAvailable(feature: string): boolean {
        if (!this.subscriptionStatus) {
            return false;
        }
        
        return this.subscriptionStatus.features[feature] || false;
    }
    
    /**
     * Checks if the user can perform an analysis
     * @returns boolean True if the user can perform an analysis
     */
    public canPerformAnalysis(): boolean {
        if (!this.subscriptionStatus) {
            return false;
        }
        
        // If unlimited analyses are available, always return true
        if (this.subscriptionStatus.features.unlimitedAnalyses) {
            return true;
        }
        
        // Check if the user has reached the free tier limit
        if (this.subscriptionStatus.type === 'free') {
            return this.usageStats.freeAnalyses < this.settings.freeTierLimit;
        }
        
        // Check if the user has reached the premium tier limit
        if (this.subscriptionStatus.type === 'premium') {
            return this.usageStats.premiumAnalyses < this.settings.premiumTierLimit;
        }
        
        // Pro tier has unlimited analyses
        return true;
    }
    
    /**
     * Records an analysis
     * @param isPremiumFeature Whether the analysis used a premium feature
     * @returns Promise<void>
     */
    public async recordAnalysis(isPremiumFeature: boolean): Promise<void> {
        if (!this.subscriptionStatus) {
            return;
        }
        
        // Check usage reset
        this.checkUsageReset();
        
        // Record the analysis
        if (isPremiumFeature) {
            this.usageStats.premiumAnalyses++;
        } else {
            this.usageStats.freeAnalyses++;
        }
        
        // Check if the user is approaching the limit
        this.checkUsageLimits();
    }
    
    /**
     * Checks if usage stats need to be reset
     */
    private checkUsageReset(): void {
        const lastResetDate = new Date(this.usageStats.lastResetDate);
        const now = new Date();
        
        // Reset monthly usage
        if (lastResetDate.getMonth() !== now.getMonth() || lastResetDate.getFullYear() !== now.getFullYear()) {
            console.log('[BusinessModel] Resetting usage stats');
            
            this.usageStats.freeAnalyses = 0;
            this.usageStats.premiumAnalyses = 0;
            this.usageStats.lastResetDate = now.toISOString();
        }
    }
    
    /**
     * Checks if the user is approaching usage limits
     */
    private checkUsageLimits(): void {
        if (!this.subscriptionStatus) {
            return;
        }
        
        // Check free tier limit
        if (this.subscriptionStatus.type === 'free') {
            const remaining = this.settings.freeTierLimit - this.usageStats.freeAnalyses;
            
            if (remaining <= 5 && remaining > 0) {
                new Notice(`You have ${remaining} free analyses remaining this month. Upgrade to Premium for more!`);
            } else if (remaining <= 0) {
                new Notice('You have reached your free analysis limit for this month. Upgrade to Premium for more!');
            }
        }
        
        // Check premium tier limit
        if (this.subscriptionStatus.type === 'premium') {
            const remaining = this.settings.premiumTierLimit - this.usageStats.premiumAnalyses;
            
            if (remaining <= 10 && remaining > 0) {
                new Notice(`You have ${remaining} premium analyses remaining this month. Upgrade to Pro for unlimited analyses!`);
            } else if (remaining <= 0) {
                new Notice('You have reached your premium analysis limit for this month. Upgrade to Pro for unlimited analyses!');
            }
        }
    }
    
    /**
     * Upgrades the subscription
     * @param tier The tier to upgrade to
     * @param licenseKey The license key
     * @returns Promise<boolean> True if the upgrade was successful
     */
    public async upgradeSubscription(tier: 'premium' | 'pro', licenseKey: string): Promise<boolean> {
        try {
            console.log(`[BusinessModel] Upgrading to ${tier} tier with license key: ${licenseKey}`);
            
            // Validate the license key
            await this.validateLicenseKey(licenseKey);
            
            // Update settings
            this.settings.licenseKey = licenseKey;
            
            // Save settings (in a real implementation)
            console.log('[BusinessModel] Subscription upgraded successfully');
            
            return true;
        } catch (error) {
            console.error('[BusinessModel] Error upgrading subscription:', error);
            throw new Error(`Failed to upgrade subscription: ${error.message || 'Unknown error'}`);
        }
    }
    
    /**
     * Gets the subscription status
     * @returns SubscriptionStatus | null The subscription status
     */
    public getSubscriptionStatus(): SubscriptionStatus | null {
        return this.subscriptionStatus;
    }
    
    /**
     * Gets the usage stats
     * @returns UsageStats The usage stats
     */
    public getUsageStats(): UsageStats {
        return this.usageStats;
    }
    
    /**
     * Updates the business model settings
     * @param settings The new settings
     */
    public async updateSettings(settings: BusinessModelSettings): Promise<void> {
        const licenseKeyChanged = this.settings.licenseKey !== settings.licenseKey;
        
        this.settings = settings;
        
        // Reinitialize subscription if license key changed
        if (licenseKeyChanged) {
            await this.initializeSubscription();
        }
    }
    
    /**
     * Generates a subscription summary
     * @returns string The subscription summary in markdown format
     */
    public generateSubscriptionSummary(): string {
        if (!this.subscriptionStatus) {
            return '# Subscription Status\n\nNo subscription information available.';
        }
        
        const { type, expirationDate, features } = this.subscriptionStatus;
        
        let summary = `# Subscription Status\n\n`;
        
        // Add subscription type
        summary += `## ${type.charAt(0).toUpperCase() + type.slice(1)} Tier\n\n`;
        
        // Add expiration date
        if (expirationDate) {
            const expirationDateObj = new Date(expirationDate);
            summary += `**Expires:** ${expirationDateObj.toLocaleDateString()}\n\n`;
        }
        
        // Add usage stats
        summary += `## Usage This Month\n\n`;
        
        if (type === 'free') {
            summary += `**Analyses:** ${this.usageStats.freeAnalyses} / ${this.settings.freeTierLimit}\n\n`;
        } else if (type === 'premium') {
            summary += `**Analyses:** ${this.usageStats.premiumAnalyses} / ${this.settings.premiumTierLimit}\n\n`;
        } else {
            summary += `**Analyses:** ${this.usageStats.premiumAnalyses} (Unlimited)\n\n`;
        }
        
        // Add features
        summary += `## Features\n\n`;
        
        for (const [feature, available] of Object.entries(features)) {
            const formattedFeature = feature
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
            
            summary += `- ${formattedFeature}: ${available ? '✅' : '❌'}\n`;
        }
        
        // Add upgrade information
        if (type === 'free') {
            summary += `\n## Upgrade to Premium\n\n`;
            summary += `Upgrade to Premium to unlock personality analysis, data export, and advanced templates!\n\n`;
            summary += `[Upgrade Now](https://deleometer.app/upgrade)\n`;
        } else if (type === 'premium') {
            summary += `\n## Upgrade to Pro\n\n`;
            summary += `Upgrade to Pro to unlock voice journaling, API access, and unlimited analyses!\n\n`;
            summary += `[Upgrade Now](https://deleometer.app/upgrade)\n`;
        }
        
        return summary;
    }
}

/**
 * Business model settings
 */
export interface BusinessModelSettings {
    licenseKey: string;
    freeTierLimit: number;
    premiumTierLimit: number;
}

/**
 * Subscription status
 */
export interface SubscriptionStatus {
    type: 'free' | 'premium' | 'pro';
    expirationDate: string | null;
    features: Record<string, boolean>;
}

/**
 * Usage stats
 */
export interface UsageStats {
    freeAnalyses: number;
    premiumAnalyses: number;
    lastResetDate: string;
}

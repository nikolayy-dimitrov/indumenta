export interface UserProfile {
    subscriptionStatus: 'active' | 'canceled' | 'free';
    planId?: string;
    trialEnd?: Date;
}
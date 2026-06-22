import { Platform } from 'react-native';
import Purchases, {
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
  type PurchasesError,
  PURCHASES_ERROR_CODE,
} from 'react-native-purchases';

const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '',
};

/**
 * Initializes the RevenueCat Purchases SDK for the current user.
 */
export async function initializePurchases(userId: string): Promise<void> {
  const key = Platform.select({
    ios: API_KEYS.ios,
    android: API_KEYS.android,
    default: '',
  });

  if (!key) {
    console.warn('RevenueCat API key not found. Skipping initialization.');
    return;
  }

  Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey: key, appUserID: userId });
}

/**
 * Gets the current offerings available for purchase.
 */
export async function getActiveOffering(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (err: unknown) {
    console.warn('Failed to fetch RevenueCat offerings:', err);
    return null;
  }
}

/**
 * Executes a purchase for a package. Returns true if successful.
 */
export async function purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active['premium']?.isActive ?? false;
  } catch (err: unknown) {
    const error = err as Partial<PurchasesError>;
    const isCancelled =
      error?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR ||
      error?.userCancelled === true;

    if (!isCancelled) {
      console.error('RevenueCat purchase error:', err);
    }
    return false;
  }
}

/**
 * Restores previous purchases. Returns true if premium entitlement is active.
 */
export async function restorePurchases(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active['premium']?.isActive ?? false;
  } catch (err: unknown) {
    console.error('RevenueCat restore error:', err);
    return false;
  }
}

/**
 * Checks if the premium entitlement is currently active.
 */
export async function checkPremiumEntitlement(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['premium']?.isActive ?? false;
  } catch (err: unknown) {
    console.warn('Failed to retrieve RevenueCat customer info:', err);
    return false;
  }
}


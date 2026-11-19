/**
 * Khan Jacket House - Formatter Utilities for Mobile App
 * Cleans up display names, currency formatting, and pieces formatting.
 */

export const formatPieces = (qty: number | string | undefined | null): string => {
  const n = Number(qty);
  if (isNaN(n)) return '0 Pcs';
  return `${n.toLocaleString()} Pcs`;
};

export const formatCurrency = (amount: number | string | undefined | null): string => {
  const n = Number(amount);
  if (isNaN(n)) return 'Rs. 0';
  return `Rs. ${n.toLocaleString()}`;
};

/**
 * Clean Customer / Shop Display Name Formatter:
 * - If shopName & distinct ownerName exist: "Shop Name (Owner Name)"
 * - If only shopName exists: "Shop Name" (NO empty or redundant brackets!)
 * - If only ownerName exists: "Owner Name" (NO empty or redundant brackets!)
 * - If ownerName is identical or redundant to shopName: "Shop Name" (NO duplicate brackets!)
 */
export const formatCustomerDisplayName = (
  custOrShop?: any,
  maybeOwner?: string
): string => {
  let shop = '';
  let owner = '';

  if (typeof custOrShop === 'object' && custOrShop !== null) {
    shop = (custOrShop.shopName || custOrShop.customerName || custOrShop.name || '').trim();
    owner = (custOrShop.shopkeeperName || custOrShop.ownerName || '').trim();
  } else {
    shop = (custOrShop || '').trim();
    owner = (maybeOwner || '').trim();
  }

  // Strip any empty parentheses like "()", "( )", "(-)" anywhere
  shop = shop.replace(/\s*\(\s*[-—]?\s*\)/g, '').trim();
  if (owner) {
    owner = owner.replace(/\s*\(\s*[-—]?\s*\)/g, '').trim();
  }

  // If already formatted with brackets e.g. "MK Collection ()" or "Mubashar shop (mubashar)"
  if (shop && !owner) {
    const bracketMatch = shop.match(/^(.+?)\s*\((.*?)\)$/);
    if (bracketMatch) {
      const mainPart = bracketMatch[1].trim();
      const bracketPart = bracketPartCleaner(bracketMatch[2].trim());
      if (!bracketPart) return mainPart;
      const mNorm = mainPart.toLowerCase().replace(/[^a-z0-9]/g, '');
      const bNorm = bracketPart.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (mNorm === bNorm || mNorm.includes(bNorm) || bNorm.includes(mNorm)) {
        return mainPart;
      }
      return `${mainPart} (${bracketPart})`;
    }
  }

  if (!shop && !owner) return 'Customer';
  if (shop && !owner) return shop;
  if (!shop && owner) return owner;

  // Both exist: check if redundant or identical
  const sNorm = shop.toLowerCase().replace(/[^a-z0-9]/g, '');
  const oNorm = owner.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (sNorm === oNorm || sNorm.includes(oNorm) || oNorm.includes(sNorm)) {
    return shop;
  }

  return `${shop} (${owner})`;
};

function bracketPartCleaner(str: string): string {
  if (!str || str === '-' || str === '—') return '';
  return str.trim();
}

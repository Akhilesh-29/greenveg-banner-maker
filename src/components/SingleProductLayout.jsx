import React from 'react';
import { Phone, MapPin, Sparkles, Tag, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { TRANSLATIONS } from '../constants/localization';
import { getAssetUrl } from '../utils/assetHelper';

export const SingleProductLayout = ({
  product,
  template,
  shopProfile,
  language = 'en',
  currency = '₹',
  aspectRatio = '1:1',
  fontClass = 'font-outfit',
  showDateStamp = true,
  dateStampText = ''
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const mrp = Number(product.mrp) || 0;
  const price = Number(product.price) || 0;
  const hasSavings = mrp > price && mrp > 0;
  const savingsAmount = hasSavings ? mrp - price : 0;
  const savingsPercent = hasSavings ? Math.round((savingsAmount / mrp) * 100) : 0;

  const isTall = aspectRatio === '9:16' || aspectRatio.includes('A4') || aspectRatio.includes('A5');
  const isWide = aspectRatio === '1.91:1' || aspectRatio === '16:9';

  return (
    <div className={`w-full h-full flex flex-col justify-between overflow-hidden relative ${template.bgStyle} ${fontClass} select-none`}>
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 -ml-20 w-[400px] h-[400px] rounded-full bg-black/15 blur-2xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 w-full px-10 pt-8 pb-3">
        {/* Shop Header Bar */}
        {shopProfile?.showShopHeader && (
          <div className="flex items-center justify-between pb-6 border-b border-white/20 mb-5">
            <div className="flex items-center gap-4">
              {shopProfile.logoUrl ? (
                <img
                  src={getAssetUrl(shopProfile.logoUrl)}
                  alt="Shop Logo"
                  className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white/40"
                />
              ) : (
                <div className="w-18 h-18 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border-2 border-white/30 font-black text-3xl shadow-md">
                  🥬
                </div>
              )}
              <div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md">
                  {shopProfile.name || 'GREENVEG BASKET'}
                </h1>
                {shopProfile.tagline && (
                  <p className="text-base sm:text-lg font-medium text-white/90 tracking-wide mt-1">
                    {shopProfile.tagline}
                  </p>
                )}
              </div>
            </div>

            {/* Header phone pill */}
            {shopProfile.showPhone && shopProfile.phone && (
              <div className="flex items-center gap-2.5 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30 text-white font-black text-base shadow">
                <Phone className="w-5 h-5 fill-white" />
                <span>{shopProfile.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Catchy Banner Ribbon / Offer Pill */}
        <div className="flex items-center justify-between gap-4">
          <div className={`inline-flex items-center gap-2.5 px-8 py-3 rounded-full uppercase tracking-wider font-black text-xl shadow-lg ${template.headerRibbon}`}>
            <Sparkles className="w-6 h-6" />
            <span>{product.offerTitle || t.megaOffer}</span>
          </div>

          {/* Date stamp pill */}
          {showDateStamp && (
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-black/35 backdrop-blur-md text-white border border-white/20 shadow">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>{dateStampText || t.validToday}</span>
            </div>
          )}
        </div>
      </div>

      {/* MAIN PRODUCT BODY */}
      <div className={`relative z-10 flex-1 px-10 py-2 flex ${isWide ? 'flex-row items-center gap-12' : 'flex-col items-center justify-center gap-6'}`}>
        
        {/* Product Visual Hero Card */}
        <div className={`relative flex items-center justify-center ${isWide ? 'w-5/12' : 'w-full'}`}>
          <div className={`relative group ${isTall ? 'w-[440px] h-[440px]' : isWide ? 'w-[380px] h-[380px]' : 'w-[420px] h-[420px]'} rounded-3xl bg-white p-4 shadow-2xl flex items-center justify-center border-4 border-white/90`}>
            {product.customImage ? (
              <img
                src={getAssetUrl(product.customImage)}
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl shadow-inner"
              />
            ) : (
              <span className={`${isTall ? 'text-9xl' : 'text-8xl'} select-none filter drop-shadow-xl`}>
                {product.emoji || '🍎'}
              </span>
            )}

            {/* % OFF Starburst / Floating Badge */}
            {hasSavings && savingsPercent > 0 && (
              <div className={`absolute -top-6 -right-6 px-6 py-3 rounded-3xl ${template.badgeStyle} flex flex-col items-center justify-center transform rotate-6 border-4 border-white shadow-2xl z-20`}>
                <span className="text-4xl font-black leading-none">{savingsPercent}%</span>
                <span className="text-xs font-black tracking-widest leading-none mt-1">{t.offBadge}</span>
              </div>
            )}

            {/* Direct Farm Fresh / Guarantee sticker */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-xs font-black px-5 py-1.5 rounded-full whitespace-nowrap shadow-xl border border-white/40 flex items-center gap-1.5 z-20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.farmFresh}</span>
            </div>
          </div>
        </div>

        {/* Product Details & Price Block */}
        <div className={`flex flex-col items-center text-center ${isWide ? 'w-7/12 items-start text-left' : 'w-full'} max-w-2xl`}>
          
          {/* Optional Tagline */}
          {product.tagline && (
            <div className={`inline-block px-5 py-2 rounded-2xl text-base font-black tracking-wide uppercase mb-3 shadow-md ${template.taglineBadge}`}>
              ✨ {product.tagline}
            </div>
          )}

          {/* Product Name */}
          <h2 className="text-5xl sm:text-6xl font-black text-white leading-tight drop-shadow-md tracking-tight">
            {product.name || 'Fresh Apple'}
          </h2>

          {/* Unit / Qty */}
          <div className="mt-1 text-2xl font-black text-white/90 tracking-wide">
            {product.unit ? `[ ${product.unit} ]` : '[ 1 kg ]'}
          </div>

          {/* PRICE HERO CARD */}
          <div className="mt-5 w-full bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-white/60 text-slate-900">
            <div className="flex items-center justify-center gap-8 sm:gap-10 flex-wrap">
              
              {/* Market Price (MRP) - Strikethrough */}
              {mrp > 0 && (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    {t.marketPrice}
                  </span>
                  <div className="relative text-3xl sm:text-4xl font-extrabold text-slate-400">
                    <span className="line-through decoration-red-500 decoration-4">
                      {currency}{mrp}
                    </span>
                  </div>
                </div>
              )}

              {/* Offer Price / Our Price - EXTRA LARGE */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-black uppercase tracking-widest text-slate-700 bg-slate-100 px-3 py-1 rounded-full mb-1">
                  {t.ourPrice}
                </span>
                <div className={`text-6xl sm:text-7xl font-black tracking-tight ${template.priceColor} leading-none flex items-baseline gap-1`}>
                  <span className="text-4xl sm:text-5xl font-extrabold">{currency}</span>
                  <span>{price}</span>
                </div>
              </div>

              {/* Auto Calculated "SAVE ₹X" Pill */}
              {hasSavings && (
                <div className="flex flex-col items-center bg-emerald-50 border-2 border-emerald-500/50 px-5 py-2.5 rounded-2xl shadow-sm">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                    {t.saveBadge}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                    {currency}{savingsAmount}
                  </span>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* FOOTER SECTION */}
      {shopProfile?.showShopFooter && (
        <div className={`relative z-10 w-full px-10 py-5 ${template.footerStyle} flex flex-wrap items-center justify-between gap-4 text-sm font-semibold`}>
          {/* Address */}
          {shopProfile.showAddress && shopProfile.address && (
            <div className="flex items-center gap-2 max-w-md">
              <MapPin className="w-5 h-5 shrink-0 text-amber-400" />
              <span className="line-clamp-1">{shopProfile.address}</span>
            </div>
          )}

          {/* Delivery & Ordering Callout */}
          <div className="flex items-center gap-4 ml-auto">
            {shopProfile.showHomeDeliveryBadge && (
              <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-emerald-300 font-bold border border-white/20 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.freeDelivery}</span>
              </div>
            )}

            {shopProfile.showPhone && shopProfile.phone && (
              <div className="flex items-center gap-2 font-black text-white bg-green-600 px-4 py-1.5 rounded-full shadow text-xs sm:text-sm">
                <Phone className="w-4 h-4 fill-white" />
                <span>{shopProfile.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

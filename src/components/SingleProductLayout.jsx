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
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[450px] h-[450px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 -ml-20 w-[350px] h-[350px] rounded-full bg-black/15 blur-2xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 w-full px-8 pt-7 pb-2 shrink-0">
        {/* Shop Header Bar */}
        {shopProfile?.showShopHeader && (
          <div className="flex items-center justify-between pb-4 border-b border-white/20 mb-3.5">
            <div className="flex items-center gap-3.5 min-w-0">
              {shopProfile.logoUrl ? (
                <img
                  src={getAssetUrl(shopProfile.logoUrl)}
                  alt="Shop Logo"
                  className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white/40 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border-2 border-white/30 font-black text-2xl shadow-md shrink-0">
                  🥬
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase drop-shadow-md whitespace-nowrap truncate">
                  {shopProfile.name || 'GREENVEG BASKET'}
                </h1>
                {shopProfile.tagline && (
                  <p className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide mt-0.5 truncate">
                    {shopProfile.tagline}
                  </p>
                )}
              </div>
            </div>

            {/* Header phone pill */}
            {shopProfile.showPhone && shopProfile.phone && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-black text-sm whitespace-nowrap shadow shrink-0 ml-4">
                <Phone className="w-4 h-4 fill-white shrink-0" />
                <span>{shopProfile.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Catchy Banner Ribbon & Date */}
        <div className="flex items-center justify-between gap-3">
          <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full uppercase tracking-wider font-black text-base sm:text-lg shadow-md whitespace-nowrap shrink-0 ${template.headerRibbon}`}>
            <Sparkles className="w-5 h-5 shrink-0" />
            <span>{product.offerTitle || t.megaOffer}</span>
          </div>

          {showDateStamp && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-black/35 backdrop-blur-md text-white border border-white/20 shadow whitespace-nowrap shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{dateStampText || t.validToday}</span>
            </div>
          )}
        </div>
      </div>

      {/* MAIN PRODUCT BODY */}
      <div className={`relative z-10 flex-1 px-8 py-2 flex ${isWide ? 'flex-row items-center gap-10' : 'flex-col items-center justify-center gap-4'} min-h-0`}>
        
        {/* Product Visual Hero Card */}
        <div className={`relative flex items-center justify-center ${isWide ? 'w-5/12' : 'w-full'} shrink-0`}>
          <div className={`relative group ${isTall ? 'w-[360px] h-[360px]' : isWide ? 'w-[320px] h-[320px]' : 'w-[350px] h-[350px]'} rounded-3xl bg-white p-3 shadow-2xl flex items-center justify-center border-4 border-white/90 shrink-0`}>
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
              <div className={`absolute -top-5 -right-5 px-5 py-2.5 rounded-2xl ${template.badgeStyle} flex flex-col items-center justify-center transform rotate-6 border-3 border-white shadow-xl z-20`}>
                <span className="text-3xl font-black leading-none">{savingsPercent}%</span>
                <span className="text-[11px] font-black tracking-widest leading-none mt-0.5">{t.offBadge}</span>
              </div>
            )}

            {/* Direct Farm Fresh sticker */}
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[11px] font-black px-4 py-1 rounded-full whitespace-nowrap shadow-xl border border-white/40 flex items-center gap-1.5 z-20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t.farmFresh}</span>
            </div>
          </div>
        </div>

        {/* Product Details & Price Block */}
        <div className={`flex flex-col items-center text-center ${isWide ? 'w-7/12 items-start text-left' : 'w-full'} max-w-xl shrink-0`}>
          
          {/* Optional Tagline */}
          {product.tagline && (
            <div className={`inline-block px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black tracking-wide uppercase mb-1.5 shadow-sm whitespace-nowrap ${template.taglineBadge}`}>
              ✨ {product.tagline}
            </div>
          )}

          {/* Product Name */}
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight drop-shadow-md tracking-tight px-2 max-w-full truncate">
            {product.name || 'Fresh Apple'}
          </h2>

          {/* Unit / Qty */}
          <div className="mt-0.5 text-lg sm:text-xl font-black text-white/90 tracking-wide whitespace-nowrap">
            {product.unit ? `[ ${product.unit} ]` : '[ 1 kg ]'}
          </div>

          {/* PRICE HERO CARD */}
          <div className="mt-3.5 w-full bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-white/60 text-slate-900">
            <div className="flex items-center justify-center gap-6 sm:gap-8 flex-nowrap">
              
              {/* Market Price (MRP) - Strikethrough */}
              {mrp > 0 && (
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 whitespace-nowrap">
                    {t.marketPrice}
                  </span>
                  <div className="relative text-2xl sm:text-3xl font-extrabold text-slate-400 whitespace-nowrap">
                    <span className="line-through decoration-red-500 decoration-3">
                      {currency}{mrp}
                    </span>
                  </div>
                </div>
              )}

              {/* Offer Price / Our Price - EXTRA LARGE */}
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full mb-1 whitespace-nowrap">
                  {t.ourPrice}
                </span>
                <div className={`text-5xl sm:text-6xl font-black tracking-tight ${template.priceColor} leading-none flex items-baseline gap-0.5 whitespace-nowrap`}>
                  <span className="text-3xl sm:text-4xl font-extrabold">{currency}</span>
                  <span>{price}</span>
                </div>
              </div>

              {/* Auto Calculated "SAVE ₹X" Pill */}
              {hasSavings && (
                <div className="flex flex-col items-center bg-emerald-50 border-2 border-emerald-500/50 px-4 py-2 rounded-2xl shadow-sm shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 whitespace-nowrap">
                    {t.saveBadge}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 whitespace-nowrap">
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
        <div className={`relative z-10 w-full px-8 py-3.5 ${template.footerStyle} flex items-center justify-between gap-3 text-xs font-semibold shrink-0`}>
          {shopProfile.showAddress && shopProfile.address && (
            <div className="flex items-center gap-1.5 max-w-sm truncate">
              <MapPin className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="truncate">{shopProfile.address}</span>
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto shrink-0">
            {shopProfile.showHomeDeliveryBadge && (
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-emerald-300 font-bold border border-white/20 text-xs whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{t.freeDelivery}</span>
              </div>
            )}

            {shopProfile.showPhone && shopProfile.phone && (
              <div className="flex items-center gap-1.5 font-black text-white bg-green-600 px-3.5 py-1 rounded-full shadow text-xs whitespace-nowrap">
                <Phone className="w-3.5 h-3.5 fill-white shrink-0" />
                <span>{shopProfile.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

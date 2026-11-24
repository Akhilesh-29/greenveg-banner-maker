import React from 'react';
import { Phone, MapPin, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { TRANSLATIONS } from '../constants/localization';
import { getAssetUrl } from '../utils/assetHelper';

export const MultiProductLayout = ({
  items = [],
  template,
  shopProfile,
  language = 'en',
  currency = '₹',
  aspectRatio = '1:1',
  fontClass = 'font-outfit',
  showDateStamp = true,
  dateStampText = '',
  boardTitle = ''
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isTall = aspectRatio === '9:16' || aspectRatio.includes('A4') || aspectRatio.includes('A5');

  return (
    <div className={`w-full h-full flex flex-col justify-between overflow-hidden relative ${template.bgStyle} ${fontClass} select-none`}>
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 w-80 h-80 rounded-full bg-black/10 blur-xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 w-full p-6 pb-2">
        {/* Shop Header Bar */}
        {shopProfile?.showShopHeader && (
          <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-3">
            <div className="flex items-center gap-3">
              {shopProfile.logoUrl ? (
                <img
                  src={shopProfile.logoUrl}
                  alt="Shop Logo"
                  className="w-12 h-12 rounded-xl object-cover shadow border border-white/40"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 font-black text-xl shadow">
                  🏪
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm leading-tight">
                  {shopProfile.name || 'FRESH GROCERY STORE'}
                </h1>
                {shopProfile.tagline && (
                  <p className="text-xs font-semibold text-white/80 tracking-wide">
                    {shopProfile.tagline}
                  </p>
                )}
              </div>
            </div>

            {shopProfile.showPhone && shopProfile.phone && (
              <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-white font-bold text-xs">
                <Phone className="w-3.5 h-3.5 fill-white" />
                <span>{shopProfile.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Rate Board Title Banner & Date */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-2xl uppercase tracking-wider font-black text-base sm:text-lg shadow-md ${template.headerRibbon}`}>
            <Sparkles className="w-5 h-5" />
            <span>{boardTitle || t.rateBoardTitle}</span>
          </div>

          {showDateStamp && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/30 backdrop-blur-md text-white border border-white/20">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{dateStampText || t.validToday}</span>
            </div>
          )}
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="relative z-10 flex-1 px-6 py-2 overflow-hidden flex flex-col justify-center">
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-white/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${template.tableHeaderBg} text-xs sm:text-sm uppercase tracking-wider font-extrabold`}>
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-4">{t.tableItem}</th>
                <th className="py-2.5 px-3 text-center">{t.tableQty}</th>
                <th className="py-2.5 px-3 text-center">{t.tableMrp}</th>
                <th className="py-2.5 px-4 text-center">{t.tableOurPrice}</th>
                <th className="py-2.5 px-3 text-center">{t.tableSave}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {items.map((item, idx) => {
                const mrp = Number(item.mrp) || 0;
                const price = Number(item.price) || 0;
                const hasSavings = mrp > price && mrp > 0;
                const save = hasSavings ? mrp - price : 0;
                const percent = hasSavings ? Math.round((save / mrp) * 100) : 0;

                return (
                  <tr
                    key={item.id || idx}
                    className={`transition-colors text-xs sm:text-sm ${
                      idx % 2 === 1 ? template.tableRowAltBg : 'bg-white'
                    }`}
                  >
                    <td className="py-2 px-3 text-center text-slate-400 font-bold">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        {item.customImage ? (
                          <img
                            src={getAssetUrl(item.customImage)}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                          />
                        ) : (
                          <span className="text-xl shrink-0">{item.emoji || '🥬'}</span>
                        )}
                        <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center font-semibold text-slate-600 whitespace-nowrap">
                      {item.unit || '1 kg'}
                    </td>
                    <td className="py-2 px-3 text-center text-slate-400 font-semibold whitespace-nowrap">
                      {mrp > 0 ? (
                        <span className="line-through decoration-red-500 decoration-2">
                          {currency}{mrp}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-2 px-4 text-center whitespace-nowrap">
                      <span className={`text-base sm:text-lg font-black ${template.priceColor} tracking-tight`}>
                        {currency}{price}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center whitespace-nowrap">
                      {hasSavings ? (
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-300">
                          {percent}% ({currency}{save})
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER SECTION */}
      {shopProfile?.showShopFooter && (
        <div className={`relative z-10 w-full px-6 py-3 ${template.footerStyle} flex flex-wrap items-center justify-between gap-3 text-xs font-medium`}>
          {shopProfile.showAddress && shopProfile.address && (
            <div className="flex items-center gap-1.5 max-w-sm">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="line-clamp-1">{shopProfile.address}</span>
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {shopProfile.showHomeDeliveryBadge && (
              <div className="flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full text-emerald-300 font-bold border border-white/20 text-[11px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t.freeDelivery}</span>
              </div>
            )}

            {shopProfile.showPhone && shopProfile.phone && (
              <div className="flex items-center gap-1.5 font-bold text-white bg-green-600 px-3 py-1 rounded-full shadow-sm text-xs">
                <Phone className="w-3 h-3 fill-white" />
                <span>{shopProfile.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

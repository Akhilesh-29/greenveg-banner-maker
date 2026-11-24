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
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[450px] h-[450px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 w-[400px] h-[400px] rounded-full bg-black/15 blur-2xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 w-full px-10 pt-8 pb-3">
        {/* Shop Header Bar */}
        {shopProfile?.showShopHeader && (
          <div className="flex items-center justify-between pb-5 border-b border-white/20 mb-4">
            <div className="flex items-center gap-4">
              {shopProfile.logoUrl ? (
                <img
                  src={getAssetUrl(shopProfile.logoUrl)}
                  alt="Shop Logo"
                  className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-white/40"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border-2 border-white/30 font-black text-2xl shadow-md">
                  🥬
                </div>
              )}
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md leading-tight">
                  {shopProfile.name || 'GREENVEG BASKET'}
                </h1>
                {shopProfile.tagline && (
                  <p className="text-sm sm:text-base font-semibold text-white/90 tracking-wide">
                    {shopProfile.tagline}
                  </p>
                )}
              </div>
            </div>

            {shopProfile.showPhone && shopProfile.phone && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-black text-sm shadow">
                <Phone className="w-4 h-4 fill-white" />
                <span>{shopProfile.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Rate Board Title Banner & Date */}
        <div className="flex items-center justify-between gap-3">
          <div className={`inline-flex items-center gap-2.5 px-7 py-2.5 rounded-2xl uppercase tracking-wider font-black text-lg sm:text-xl shadow-lg ${template.headerRibbon}`}>
            <Sparkles className="w-5 h-5" />
            <span>{boardTitle || t.rateBoardTitle}</span>
          </div>

          {showDateStamp && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-black/35 backdrop-blur-md text-white border border-white/20 shadow">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>{dateStampText || t.validToday}</span>
            </div>
          )}
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="relative z-10 flex-1 px-10 py-3 overflow-hidden flex flex-col justify-center">
        <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white/60">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${template.tableHeaderBg} text-sm sm:text-base uppercase tracking-wider font-black`}>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-5">{t.tableItem}</th>
                <th className="py-3.5 px-4 text-center">{t.tableQty}</th>
                <th className="py-3.5 px-4 text-center">{t.tableMrp}</th>
                <th className="py-3.5 px-5 text-center">{t.tableOurPrice}</th>
                <th className="py-3.5 px-4 text-center">{t.tableSave}</th>
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
                    className={`transition-colors text-sm sm:text-base ${
                      idx % 2 === 1 ? template.tableRowAltBg : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4 text-center text-slate-400 font-extrabold text-sm">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        {item.customImage ? (
                          <img
                            src={getAssetUrl(item.customImage)}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                          />
                        ) : (
                          <span className="text-2xl shrink-0">{item.emoji || '🥬'}</span>
                        )}
                        <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-600 whitespace-nowrap text-sm sm:text-base">
                      {item.unit || '1 kg'}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold whitespace-nowrap text-sm sm:text-base">
                      {mrp > 0 ? (
                        <span className="line-through decoration-red-500 decoration-2">
                          {currency}{mrp}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-5 text-center whitespace-nowrap">
                      <span className={`text-xl sm:text-2xl font-black ${template.priceColor} tracking-tight`}>
                        {currency}{price}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {hasSavings ? (
                        <span className="inline-block px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black border border-emerald-300 shadow-sm">
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
        <div className={`relative z-10 w-full px-10 py-5 ${template.footerStyle} flex flex-wrap items-center justify-between gap-4 text-sm font-semibold`}>
          {shopProfile.showAddress && shopProfile.address && (
            <div className="flex items-center gap-2 max-w-md">
              <MapPin className="w-5 h-5 shrink-0 text-amber-400" />
              <span className="line-clamp-1">{shopProfile.address}</span>
            </div>
          )}

          <div className="flex items-center gap-4 ml-auto">
            {shopProfile.showHomeDeliveryBadge && (
              <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1 rounded-full text-emerald-300 font-bold border border-white/20 text-xs sm:text-sm">
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

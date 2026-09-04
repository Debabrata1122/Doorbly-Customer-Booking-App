import React from 'react';
import { ServiceCategory } from '../types';
import { CATEGORIES_MASTER } from '../data/serviceCatalogMaster';
import { CategoryIcon } from './CategoryIcon';
import { VfxCard } from './VfxCard';
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';

interface CategoriesOverviewProps {
  categories: ServiceCategory[];
  onSelectCategory: (categorySlug: string) => void;
  onGoBack?: () => void;
}

export const CategoriesOverview: React.FC<CategoriesOverviewProps> = ({
  categories,
  onSelectCategory,
  onGoBack
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Back button */}
      {onGoBack && (
        <div className="mb-6">
          <button
            onClick={onGoBack}
            id="btn-goback-categories"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-emerald-700 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      )}

      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Full Service Master (30 Categories)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore All Services
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Select any verified hourly trade or specialist service across Odisha.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const masterDef = CATEGORIES_MASTER.find(m => m.slug === cat.slug);
          const iconName = masterDef?.icon || 'Wrench';

          return (
            <VfxCard
              key={cat.slug}
              id={`category-item-${cat.slug}`}
              onClick={() => onSelectCategory(cat.slug)}
              glowColor="emerald"
              className="h-full"
            >
              <div className="p-5 h-full flex flex-col justify-between relative bg-white transition-colors duration-200">
                <div className="relative z-10">
                  {/* Category Icon Badge with hover reaction */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-700 border border-slate-200/80 group-hover:border-emerald-200 flex items-center justify-center transition-all duration-200 shadow-xs">
                      <CategoryIcon name={iconName} className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-700 bg-slate-100 group-hover:bg-emerald-50 px-2.5 py-0.5 rounded-full border border-slate-200/60 group-hover:border-emerald-200 transition-all duration-200">
                      {cat.service_count || 12} Skills
                    </span>
                  </div>

                  <h3 className="text-slate-900 text-base card-title leading-snug mb-1.5 group-hover:text-emerald-700 transition-colors duration-200">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 card-text">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100/90 flex items-center justify-between text-xs relative z-10">
                  <span className="text-slate-500 text-[11px] card-subtext">
                    Transparent Hourly
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors card-action">
                    <span>Browse</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </VfxCard>
          );
        })}
      </div>
    </div>
  );
};



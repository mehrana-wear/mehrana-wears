import React, { useState } from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [guideCategory, setGuideCategory] = useState<'women' | 'men' | 'modest' | 'kids'>('women');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#FDFBF7] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8E2D8] p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col text-[#2D2D2D]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#3F4C27] text-[#FAF7F2] flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-[#2D2D2D] leading-none">Mehrana Sizing Guide</h3>
              <p className="text-xs text-[#A68F7A] mt-1">Master tailoring measurements & international conversions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#5F584E] hover:text-[#2D2D2D] hover:bg-[#FAF7F2] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category & Unit Selectors */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 pb-2">
          <div className="flex bg-[#FAF7F2] border border-[#E8E2D8] p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setGuideCategory('women')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                guideCategory === 'women' ? 'bg-[#3F4C27] text-white shadow-xs' : 'text-[#5F584E] hover:text-[#2D2D2D]'
              }`}
            >
              Women's Pret
            </button>
            <button
              onClick={() => setGuideCategory('men')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                guideCategory === 'men' ? 'bg-[#3F4C27] text-white shadow-xs' : 'text-[#5F584E] hover:text-[#2D2D2D]'
              }`}
            >
              Men's Tunics
            </button>
            <button
              onClick={() => setGuideCategory('modest')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                guideCategory === 'modest' ? 'bg-[#3F4C27] text-white shadow-xs' : 'text-[#5F584E] hover:text-[#2D2D2D]'
              }`}
            >
              Abayas
            </button>
            <button
              onClick={() => setGuideCategory('kids')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                guideCategory === 'kids' ? 'bg-[#3F4C27] text-white shadow-xs' : 'text-[#5F584E] hover:text-[#2D2D2D]'
              }`}
            >
              Kids
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex bg-[#FAF7F2] border border-[#E8E2D8] p-1 rounded-xl self-end sm:self-auto">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                unit === 'in' ? 'bg-[#3F4C27] text-white shadow-xs' : 'text-[#5F584E]'
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                unit === 'cm' ? 'bg-[#3F4C27] text-white shadow-xs' : 'text-[#5F584E]'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Sizing Table */}
        <div className="overflow-y-auto flex-1 py-4 space-y-6">
          <div className="border border-[#E8E2D8] rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#2D2D2D] font-semibold border-b border-[#E8E2D8]">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">US / UK</th>
                  <th className="p-3">Chest / Bust</th>
                  <th className="p-3">Waist</th>
                  <th className="p-3">Hips</th>
                  <th className="p-3">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8] text-[#5F584E]">
                {guideCategory === 'women' && (
                  <>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">XS</td>
                      <td className="p-3">US 2 / UK 6</td>
                      <td className="p-3">{unit === 'in' ? '34"' : '86 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '28"' : '71 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '37"' : '94 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '42"' : '106 cm'}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2] bg-[#F0F4E8]/50">
                      <td className="p-3 font-bold text-[#2D2D2D]">S</td>
                      <td className="p-3">US 4-6 / UK 8-10</td>
                      <td className="p-3">{unit === 'in' ? '36"' : '91 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '30"' : '76 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '39"' : '99 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '43"' : '109 cm'}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">M</td>
                      <td className="p-3">US 8-10 / UK 12</td>
                      <td className="p-3">{unit === 'in' ? '39"' : '99 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '33"' : '84 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '42"' : '107 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '44"' : '112 cm'}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">L</td>
                      <td className="p-3">US 12-14 / UK 14</td>
                      <td className="p-3">{unit === 'in' ? '42"' : '107 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '36"' : '91 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '45"' : '114 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '44"' : '112 cm'}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">XL</td>
                      <td className="p-3">US 16 / UK 16</td>
                      <td className="p-3">{unit === 'in' ? '45"' : '114 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '39"' : '99 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '48"' : '122 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '45"' : '114 cm'}</td>
                    </tr>
                  </>
                )}

                {guideCategory === 'men' && (
                  <>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">S (38)</td>
                      <td className="p-3">38 Chest</td>
                      <td className="p-3">{unit === 'in' ? '38"' : '96 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '34"' : '86 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '40"' : '102 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '40"' : '102 cm'}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">M (40)</td>
                      <td className="p-3">40 Chest</td>
                      <td className="p-3">{unit === 'in' ? '41"' : '104 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '37"' : '94 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '43"' : '109 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '41"' : '104 cm'}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">L (42)</td>
                      <td className="p-3">42 Chest</td>
                      <td className="p-3">{unit === 'in' ? '44"' : '112 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '40"' : '102 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '46"' : '117 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '42"' : '107 cm'}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">XL (44)</td>
                      <td className="p-3">44 Chest</td>
                      <td className="p-3">{unit === 'in' ? '47"' : '119 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '43"' : '109 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '49"' : '124 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '43"' : '109 cm'}</td>
                    </tr>
                  </>
                )}

                {guideCategory === 'modest' && (
                  <>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">52</td>
                      <td className="p-3">Height: 5'0" - 5'2"</td>
                      <td className="p-3">{unit === 'in' ? '42"' : '107 cm'}</td>
                      <td className="p-3">Free Flow</td>
                      <td className="p-3">Free Flow</td>
                      <td className="p-3">{unit === 'in' ? '52"' : '132 cm'}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">54</td>
                      <td className="p-3">Height: 5'3" - 5'4"</td>
                      <td className="p-3">{unit === 'in' ? '44"' : '112 cm'}</td>
                      <td className="p-3">Free Flow</td>
                      <td className="p-3">Free Flow</td>
                      <td className="p-3">{unit === 'in' ? '54"' : '137 cm'}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">56</td>
                      <td className="p-3">Height: 5'5" - 5'6"</td>
                      <td className="p-3">{unit === 'in' ? '46"' : '117 cm'}</td>
                      <td className="p-3">Free Flow</td>
                      <td className="p-3">Free Flow</td>
                      <td className="p-3">{unit === 'in' ? '56"' : '142 cm'}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">58</td>
                      <td className="p-3">Height: 5'7" - 5'9"</td>
                      <td className="p-3">{unit === 'in' ? '48"' : '122 cm'}</td>
                      <td className="p-3">Free Flow</td>
                      <td className="p-3">Free Flow</td>
                      <td className="p-3">{unit === 'in' ? '58"' : '147 cm'}</td>
                    </tr>
                  </>
                )}

                {guideCategory === 'kids' && (
                  <>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">2-3 Yrs</td>
                      <td className="p-3">Height: 92-98 cm</td>
                      <td className="p-3">{unit === 'in' ? '22"' : '56 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '20"' : '51 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '23"' : '58 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '22"' : '56 cm'}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">4-5 Yrs</td>
                      <td className="p-3">Height: 104-110 cm</td>
                      <td className="p-3">{unit === 'in' ? '24"' : '61 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '22"' : '56 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '25"' : '64 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '26"' : '66 cm'}</td>
                    </tr>
                    <tr className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#2D2D2D]">6-7 Yrs</td>
                      <td className="p-3">Height: 116-122 cm</td>
                      <td className="p-3">{unit === 'in' ? '26"' : '66 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '24"' : '61 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '27"' : '69 cm'}</td>
                      <td className="p-3">{unit === 'in' ? '30"' : '76 cm'}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] text-xs text-[#5F584E] space-y-1.5">
            <h5 className="font-bold text-[#2D2D2D] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8A9A5B]" />
              <span>Tailoring Fit Tip:</span>
            </h5>
            <p>
              If your measurements fall between two sizes, we recommend choosing the larger size for a relaxed traditional drape, or custom order via our WhatsApp concierge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

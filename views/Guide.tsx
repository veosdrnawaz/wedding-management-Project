import React from 'react';
import { AppData, Language, Task } from '../types';
import { BookOpen, Utensils, Info, PlusCircle, Check, AlertCircle } from 'lucide-react';

interface Props {
  lang: Language;
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

export const Guide: React.FC<Props> = ({ lang, data, setData }) => {
  const addToTasks = (requirement: string, eventName: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: `${requirement} for ${eventName}`,
      priority: 'Medium',
      assignedTo: 'Unassigned',
      completed: false
    };
    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
    alert(lang === 'en' ? 'Task added to checklist!' : 'کام لسٹ میں شامل کر دیا گیا!');
  };

  const events = [
    {
      id: 'milad',
      titleEn: 'Milad / Quran Khawani',
      titleUr: 'میلاد / قرآن خوانی',
      descriptionEn: 'A religious gathering to pray for the couple\'s blessed future.',
      descriptionUr: 'شادی کی برکت کے لیے گھر میں قرآن خوانی یا میلاد کا اہتمام۔',
      requirements: ['Qari / Naat Khawan', 'Floor Seating (Chandni)', 'Tabarruk / Food Boxes', 'Sound System']
    },
    {
      id: 'mangni',
      titleEn: 'Mangni (Engagement)',
      titleUr: 'منگنی',
      descriptionEn: 'The formal engagement ceremony where rings are exchanged.',
      descriptionUr: 'منگنی کی تقریب جس میں انگوٹھیوں کا تبادلہ ہوتا ہے اور مٹھائی بانٹی جاتی ہے۔',
      requirements: ['Rings (Angoothiyan)', 'Sweets (Mithai)', 'Flower Decor', 'Small Gift Baskets']
    },
    {
      id: 'dholki',
      titleEn: 'Dholki',
      titleUr: 'ڈھولکی',
      descriptionEn: 'Pre-wedding musical nights with family singing and dancing.',
      descriptionUr: 'شادی سے پہلے موسیقی کی راتیں جس میں خاندان والے گانے گاتے اور ڈھول بجاتے ہیں۔',
      requirements: ['Dholak', 'Song Book (Geet)', 'Floor Seating (Gao Takkiyay)', 'Spoons for Dhol', 'Simple Snacks']
    },
    {
      id: 'mehndi',
      titleEn: 'Mehndi / Rasm-e-Henna',
      titleUr: 'مہندی / رسم حنا',
      descriptionEn: 'A colorful event with henna application, dances, and traditional rites.',
      descriptionUr: 'ایک رنگا رنگ تقریب جس میں مہندی لگائی جاتی ہے، رقص ہوتا ہے اور روایتی رسومات ادا کی جاتی ہیں۔',
      requirements: ['Henna (Mehndi)', 'Thaals for Decor', 'Yellow/Green Dresses', 'Gajray (Flower Bracelets)', 'Mithai for Rasm']
    },
    {
      id: 'barat',
      titleEn: 'Barat (Wedding Day)',
      titleUr: 'بارات',
      descriptionEn: 'The groom processes to the bride\'s house/venue. The main wedding event.',
      descriptionUr: 'دولہا بارات لے کر دلہن کے گھر/ہال جاتا ہے۔ یہ شادی کی مرکزی تقریب ہوتی ہے۔',
      requirements: ['Sehra for Groom', 'Sherwani', 'Doodh Pilai Cash', 'Rasta Rokai Cash', 'Nikkah Khawan', 'Dried Dates (Chuwaray)']
    },
    {
      id: 'walima',
      titleEn: 'Walima',
      titleUr: 'ولیمہ',
      descriptionEn: 'Reception hosted by the groom, announcing the marriage.',
      descriptionUr: 'دولہا کی طرف سے دیا جانے والا استقبالیہ کھانا جو شادی کے اعلان کے طور پر ہوتا ہے۔',
      requirements: ['Reception Venue', 'Menu (Biryani/Qorma)', 'Stage Decor', 'Sofa Set', 'Guest Favors (Bid)'],
    }
  ];

  const expectations = [
    {
      titleEn: 'Bari (Gifts for Bride)',
      titleUr: 'بری (دلہن کے تحائف)',
      descEn: 'Clothes, shoes, and jewelry given by the groom\'s family to the bride. Usually displayed at the Mehndi or Barat.',
      descUr: 'دولہا والوں کی طرف سے دلہن کو دیے جانے والے کپڑے، جوتے اور زیورات۔ عام طور پر مہندی یا بارات پر نمائش کی جاتی ہے۔'
    },
    {
      titleEn: 'Jahez (Dowry Items)',
      titleUr: 'جہیز (سامان)',
      descEn: 'Furniture and household items given by the bride\'s family. (Note: Focus on ease, not burden).',
      descUr: 'دلہن والوں کی طرف سے دیا جانے والا فرنیچر اور گھریلو سامان۔ (نوٹ: نمائش سے گریز کریں)۔'
    },
    {
      titleEn: 'Haq Mehr',
      titleUr: 'حق مہر',
      descEn: 'A mandatory religious payment from groom to bride at the time of Nikkah.',
      descUr: 'نکاح کے وقت دولہا پر دلہن کے لیے واجب الادا رقم یا سونا۔ یہ شرعی حق ہے۔'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${lang === 'ur' ? 'font-urdu' : ''}`}>
          <BookOpen className="w-6 h-6 text-primary" />
          {lang === 'en' ? 'Wedding Guide (Rasm-o-Riwaj)' : 'شادی گائیڈ اور رسم و رواج'}
        </h2>
        <p className="text-slate-600">
          {lang === 'en' 
            ? 'A complete guide to functions, requirements, and cultural expectations. Click items to add them to your task list.' 
            : 'تقریبات، ضروریات اور ثقافتی توقعات کی مکمل گائیڈ۔ اپنی لسٹ میں شامل کرنے کے لیے آئٹمز پر کلک کریں۔'}
        </p>
      </div>

      {/* Events Section */}
      <div>
        <h3 className={`text-xl font-bold mb-4 text-slate-800 px-2 ${lang === 'ur' ? 'font-urdu' : ''}`}>
          {lang === 'en' ? 'Functions & Requirements' : 'تقریبات اور ضروریات'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="bg-gradient-to-r from-primary/10 to-purple-100 p-4 border-b border-primary/10">
                <h3 className={`text-xl font-bold text-primary ${lang === 'ur' ? 'font-urdu' : ''}`}>
                  {lang === 'en' ? event.titleEn : event.titleUr}
                </h3>
              </div>
              <div className="p-5">
                <p className={`text-sm text-slate-600 mb-4 h-12 ${lang === 'ur' ? 'font-urdu leading-relaxed' : ''}`}>
                  {lang === 'en' ? event.descriptionEn : event.descriptionUr}
                </p>
                
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <h4 className={`text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>
                    <Utensils className="w-3 h-3" />
                    {lang === 'en' ? 'Requirements (Click to Add):' : 'ضروریات (شامل کرنے کے لیے کلک کریں):'}
                  </h4>
                  <ul className="space-y-1">
                    {event.requirements.map((req, idx) => {
                      const eventName = lang === 'en' ? event.titleEn : event.titleUr;
                      return (
                        <li key={idx} className="flex items-center justify-between group/item text-sm text-slate-600 hover:bg-white p-1 rounded transition-colors cursor-pointer" onClick={() => addToTasks(req, eventName)}>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                            <span>{req}</span>
                          </div>
                          <PlusCircle className="w-4 h-4 text-slate-300 group-hover/item:text-green-500 opacity-0 group-hover/item:opacity-100 transition-all" />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cultural Expectations Section */}
      <div>
        <h3 className={`text-xl font-bold mb-4 text-slate-800 px-2 flex items-center gap-2 ${lang === 'ur' ? 'font-urdu' : ''}`}>
          <AlertCircle className="w-5 h-5 text-accent" />
          {lang === 'en' ? 'Cultural Demands & Expectations' : 'ثقافتی توقعات اور مطالبات'}
        </h3>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {expectations.map((exp, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                <h4 className={`text-lg font-bold text-slate-800 mb-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>
                  {lang === 'en' ? exp.titleEn : exp.titleUr}
                </h4>
                <p className={`text-slate-600 text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}>
                  {lang === 'en' ? exp.descEn : exp.descUr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
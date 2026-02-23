import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const AboutResearch = () => {
    const { t } = useLanguage()
    return (
        <div className="pt-40 pb-20 min-h-screen">
            <div className="container mx-auto px-6">
                {/* Introduction Section */}
                <div className="mb-32">
                    <div className="text-primary text-[10px] font-black tracking-widest uppercase mb-4">{t('About Us')}</div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-12">{t('연구소 소개')}</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold tracking-tight text-white/90">{t('신체 구조 움직임 연구소는')}<br />{t('최상의 움직임을 향한 깊이 있는 통찰을 제공합니다.')}</h2>
                            <p className="text-white/60 text-lg leading-relaxed font-medium">
                                {t('우리는 인체의 복잡한 구조와 동력 과학을 연구하여, 효율적이고 통증 없는 움직임을 실현하기 위한 학술적 기반을 마련합니다.')}
                                {t('전문적인 시술 분석과 연구 데이터를 통해 전문가와 일반인 모두가 신체의 가능성을 극대화할 수 있도록 돕고 있습니다.')}
                            </p>
                            <div className="p-8 rounded-[40px] glass-effect border border-white/5">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <div className="text-3xl font-black text-primary mb-2">10+</div>
                                        <div className="text-xs font-bold text-white/40 tracking-widest uppercase">Research Years</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-primary mb-2">500+</div>
                                        <div className="text-xs font-bold text-white/40 tracking-widest uppercase">Analysis Videos</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-primary mb-2">1.2k</div>
                                        <div className="text-xs font-bold text-white/40 tracking-widest uppercase">Members</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-primary mb-2">24/7</div>
                                        <div className="text-xs font-bold text-white/40 tracking-widest uppercase">Data Access</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-square rounded-[60px] overflow-hidden group">
                            <div className="absolute inset-0 premium-gradient opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80"
                                alt="Laboratory"
                                className="w-full h-full object-cover grayscale opacity-60"
                            />
                        </div>
                    </div>
                </div>

                {/* Map/Directions Section */}
                <div>
                    <div className="text-primary text-[10px] font-black tracking-widest uppercase mb-4">{t('Location')}</div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-12">{t('오시는 길')}</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 relative h-[500px] rounded-[60px] overflow-hidden glass-effect border border-white/5">
                            {/* Naver/Google Map Iframe Placeholder */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.28482424!2d127.027583!3d37.517235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3e76ea0f8a3%3A0xc330e713606990!2z7ISc7Jq47Yq567OE7IucIOqwleuCqOq1rCDshKDsgqzrj5kg6rCc7Y-s66GcIDE0MA!5e0!3m2!1sko!2skr!4v1700000000000!5m2!1sko!2skr"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Location Map"
                            ></iframe>
                        </div>

                        <div className="space-y-8 py-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center border border-white/10 shrink-0">
                                    <MapPin size={20} className="text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs font-black tracking-widest uppercase text-white/30 mb-1">{t('Address')}</div>
                                    <p className="text-white/80 font-medium leading-relaxed font-medium">{t('서울특별시 강남구 학동로 342')} <br />{t('SK허브 402호')}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center border border-white/10 shrink-0">
                                    <Phone size={20} className="text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs font-black tracking-widest uppercase text-white/30 mb-1">{t('Contact')}</div>
                                    <p className="text-white/80 font-medium font-medium">02-1234-5678</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center border border-white/10 shrink-0">
                                    <Mail size={20} className="text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs font-black tracking-widest uppercase text-white/30 mb-1">{t('Email')}</div>
                                    <p className="text-white/80 font-medium font-medium">info@movingarts.com</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center border border-white/10 shrink-0">
                                    <Clock size={20} className="text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs font-black tracking-widest uppercase text-white/30 mb-1">{t('Hours')}</div>
                                    <p className="text-white/80 font-medium font-medium">{t('평일 09:00 - 18:00')} <br />{t('토요일 09:00 - 13:00')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutResearch

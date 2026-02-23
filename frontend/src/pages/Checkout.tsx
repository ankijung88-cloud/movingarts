import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ShieldCheck, CreditCard, Wallet, Apple } from 'lucide-react'
import { paymentApi } from '../services/api'
import { useLanguage } from '../context/LanguageContext'

const Checkout = () => {
    const { t } = useLanguage()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const plan = searchParams.get('plan') || 'monthly'
    const amount = plan === 'monthly' ? 55000 : 490000
    const planName = plan === 'monthly' ? t('월간 연구 멤버십') : t('연간 연구 멤버십')

    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (!savedUser) {
            alert(t('결제를 위해 로그인이 필요합니다.'))
            navigate('/')
        } else {
            const parsedUser = JSON.parse(savedUser)
            setUser(parsedUser)
            if (parsedUser.role === 'admin') {
                alert(t('관리자님은 결제 없이 모든 콘텐츠를 이용하실 수 있습니다. 자료실로 이동합니다.'))
                navigate('/archive')
            }
        }
    }, [navigate, t])

    // PortOne SDK loader placeholder
    const handlePayment = async () => {
        setIsLoading(true)
        try {
            // 1. Simulate PortOne payment success (In real app, call window.IMP.request_pay)
            const mockImpUid = 'imp_' + Math.random().toString(36).substr(2, 9)
            const mockMerchantUid = 'merchant_' + Date.now()

            // 2. Verify with backend
            await paymentApi.verify({
                imp_uid: mockImpUid,
                merchant_uid: mockMerchantUid,
                plan,
                amount
            })

            alert(t('구독 결제가 완료되었습니다! 연구소 서비스를 이용하실 수 있습니다.'))
            navigate('/')
        } catch (err) {
            alert(t('결제 처리 중 오류가 발생했습니다.'))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="pt-40 pb-32">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column: Form */}
                    <div className="flex-grow">
                        <h1 className="text-4xl font-bold mb-10 tracking-tight">{t('구독 결제')}</h1>
                        <p className="text-white/50 mb-12">{t('연구 정보 구독을 위해 결제 정보를 입력해주세요.')}</p>

                        <div className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black tracking-widest uppercase text-white/40">{t('가입 이메일')}</label>
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black tracking-widest uppercase text-white/40">{t('신청인 이름')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('홍길동')}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-[10px] font-black tracking-widest uppercase text-white/40">{t('결제 수단 선택')}</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <button className="flex flex-col items-center gap-3 py-6 rounded-2xl bg-white/5 border border-primary text-primary transition-all font-bold">
                                        <CreditCard size={24} />
                                        <span className="text-xs">{t('신용/체크카드')}</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-3 py-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:border-white/20 transition-all font-bold">
                                        <Wallet size={24} />
                                        <span className="text-xs">{t('계좌이체')}</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-3 py-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:border-white/20 transition-all font-bold">
                                        <Apple size={24} />
                                        <span className="text-xs">{t('애플페이')}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-primary/10 border border-primary/20 rounded-[32px] p-8 flex gap-6 items-start">
                                <ShieldCheck size={24} className="text-primary shrink-0" />
                                <div>
                                    <h4 className="font-bold mb-2">{t('보안 결제 안내')}</h4>
                                    <p className="text-sm text-white/50 leading-relaxed">
                                        {t('본 연구소는 포트원(PortOne) 보안 시스템을 통해 귀하의 결제 정보를 암호화 기술로 보호합니다.')}
                                        {t('신용카드 번호는 서버에 직접 저장되지 않으며 결제사로 즉시 전달됩니다.')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-[400px]">
                        <div className="glass-effect rounded-[40px] p-10 sticky top-32">
                            <h3 className="text-[10px] font-black tracking-widest uppercase text-primary mb-8">ORDER SUMMARY</h3>
                            <div className="mb-10">
                                <div className="text-2xl font-bold mb-2 leading-tight">{planName}</div>
                                <div className="text-white/40 text-xs">{t('최종 승인일로부터 즉시 멤버십 권한이 부여됩니다.')}</div>
                            </div>

                            <div className="space-y-6 mb-12 border-y border-white/5 py-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">{t('기본 금액')}</span>
                                    <span>₩{amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">{t('할인 금액')}</span>
                                    <span className="text-emerald-400">- ₩0</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-lg font-bold">{t('총 합계')}</span>
                                    <span className="text-3xl font-black text-primary">₩{amount.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isLoading}
                                className="w-full py-6 premium-gradient rounded-full font-bold text-lg mb-6 shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform disabled:opacity-50"
                            >
                                {isLoading ? t('처리 중...') : `₩${amount.toLocaleString()} ${t('결제하기')}`}
                            </button>
                            <p className="text-center text-[10px] text-white/30 uppercase tracking-widest">
                                SSL SECURE PAYMENT | NO HIDDEN FEES
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout

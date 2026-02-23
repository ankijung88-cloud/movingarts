import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { contentApi, authApi } from '../services/api'
import { ArrowLeft, Clock, Tag, Share2, Printer } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const ContentDetailPage = () => {
    const { t } = useLanguage()
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [content, setContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isSubscriber, setIsSubscriber] = useState<boolean | null>(null)

    const [showShareToast, setShowShareToast] = useState(false)

    useEffect(() => {
        const checkAccessAndFetchDetail = async () => {
            try {
                const { data: profile } = await authApi.getProfile()
                if (profile.user.role === 'admin' || profile.membership) {
                    setIsSubscriber(true)
                    if (id) {
                        const { data } = await contentApi.getArchiveContentDetail(parseInt(id))
                        setContent(data)
                    }
                } else {
                    setIsSubscriber(false)
                }
            } catch (err: any) {
                console.error('Failed to load content detail:', err)
                setIsSubscriber(false)
            } finally {
                setLoading(false)
            }
        }

        checkAccessAndFetchDetail()
    }, [id])

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        setShowShareToast(true)
        setTimeout(() => setShowShareToast(false), 2000)
    }

    const handlePrint = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="pt-40 pb-20 min-h-screen flex items-center justify-center">
                <div className="text-white/30 font-black animate-pulse tracking-widest uppercase">{t('Deciphering Research Data...')}</div>
            </div>
        )
    }

    if (!isSubscriber) {
        return (
            <div className="pt-40 pb-20 min-h-screen container mx-auto px-6">
                <div className="glass-effect p-20 rounded-[40px] text-center">
                    <h2 className="text-3xl font-black mb-6">{t('접근 권한이 없습니다')}</h2>
                    <p className="text-white/50 mb-10">{t('이 콘텐츠를 보려면 멤버십 구독이 필요합니다.')}</p>
                    <button onClick={() => navigate('/subscription')} className="px-10 py-4 premium-gradient rounded-full font-bold">{t('멤버십 가입하기')}</button>
                </div>
            </div>
        )
    }

    if (!content) {
        return (
            <div className="pt-40 pb-20 min-h-screen container mx-auto px-6 text-center">
                <p className="text-white/30">{t('콘텐츠를 찾을 수 없습니다.')}</p>
                <button onClick={() => navigate(-1)} className="mt-6 text-primary font-bold">{t('뒤로 가기')}</button>
            </div>
        )
    }

    return (
        <div className="pt-40 pb-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">{t('Back to Library')}</span>
                </button>

                <div className="glass-effect p-12 md:p-20 rounded-[60px] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-50"></div>

                    <div className="flex flex-wrap items-center gap-6 mb-10">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20 flex items-center gap-2">
                            <Tag size={12} />
                            {t(content.category)}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold tracking-widest uppercase">
                            <Clock size={12} />
                            {new Date(content.created_at).toLocaleDateString()}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter leading-tight">
                        {t(content.title)}
                    </h1>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-white/70 text-lg md:text-xl leading-[1.8] font-medium whitespace-pre-wrap font-medium">
                            {t(content.content)}
                        </p>
                    </div>

                    <div className="mt-24 pt-12 border-t border-white/5 flex flex-wrap justify-between items-center gap-8">
                        <div className="flex gap-4 relative">
                            <button
                                onClick={handleShare}
                                className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center border border-white/10 text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95"
                                title={t('링크 복사하기')}
                            >
                                <Share2 size={20} />
                            </button>
                            <button
                                onClick={handlePrint}
                                className="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center border border-white/10 text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95"
                                title={t('출력하기')}
                            >
                                <Printer size={20} />
                            </button>

                            {showShareToast && (
                                <div className="absolute -top-12 left-0 whitespace-nowrap bg-primary text-white text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    Link Copied!
                                </div>
                            )}
                        </div>

                        <div className="text-[10px] font-black tracking-widest uppercase text-white/20">
                            © Moving Arts Theory Institute
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContentDetailPage

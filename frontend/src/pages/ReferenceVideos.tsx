import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { contentApi, authApi } from '../services/api'
import { Lock, ArrowRight, ChevronRight, VideoIcon } from 'lucide-react' // Added VideoIcon, removed BookOpen
import { useLanguage } from '../context/LanguageContext'

const ReferenceVideos = () => {
    const { t } = useLanguage()
    const [contents, setContents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isSubscriber, setIsSubscriber] = useState<boolean | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 9

    const checkAccess = async () => {
        try {
            const { data } = await authApi.getProfile()
            if (data.user.role === 'admin' || data.membership) {
                setIsSubscriber(true)
                fetchContents()
            } else {
                setIsSubscriber(false)
                setLoading(false)
            }
        } catch (err: any) {
            console.error('Access check failed:', err)
            setIsSubscriber(false)
            setLoading(false)
        }
    }

    const fetchContents = async () => {
        try {
            const { data } = await contentApi.getArchiveContents()
            if (Array.isArray(data)) {
                // '참고 영상' 카테고리만 필터링 (공백 resilience 추가)
                const filtered = data.filter((c: any) => c.category?.trim() === '참고 영상' || c.category?.trim() === '시술분석')
                setContents(filtered)
            } else {
                setContents([])
            }
        } catch (err: any) {
            console.error('Failed to fetch reference videos:', err)
            alert('영상을 불러오는데 실패했습니다: ' + (err.response?.data?.message || err.message))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAccess()
    }, [])

    const totalPages = Math.ceil(contents.length / ITEMS_PER_PAGE)
    const paginatedContents = contents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    if (loading) {
        return (
            <div className="pt-40 pb-20 min-h-screen flex items-center justify-center">
                <div className="text-white/30 font-black animate-pulse tracking-widest uppercase">{t('Streaming Reference Data...')}</div>
            </div>
        )
    }

    if (isSubscriber === false) {
        return (
            <div className="pt-40 pb-20 min-h-screen container mx-auto px-6">
                <div className="relative overflow-hidden p-20 md:p-32 rounded-[60px] glass-effect text-center flex flex-col items-center">
                    <div className="absolute top-0 left-0 w-full h-full premium-gradient opacity-10 -z-10"></div>
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-12 border border-primary/30">
                        <Lock size={40} className="text-primary" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter">{t('프리미엄 전용 영상')}</h2>
                    <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-16 font-medium">
                        {t('이 참고 영상 라이브러리는 멤버십 전용입니다.')} <br />
                        {t('고해상도 분석 영상과 전문 시술 테크닉을 확인하세요.')}
                    </p>
                    <Link to="/subscription" className="px-16 py-6 premium-gradient rounded-full text-xl font-bold hover:scale-105 transition-all flex items-center gap-4 shadow-2xl shadow-primary/50">
                        {t('멤버십 가입하기')} <ArrowRight size={24} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-40 pb-20 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="mb-20">
                    <div className="text-primary text-[10px] font-black tracking-widest uppercase mb-4">{t('Visual Library')}</div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">{t('참고 영상')}</h1>
                    <p className="text-white/50 text-lg font-medium">{t('동력 과학 이론의 실제 적용 사례를 고화질 영상으로 분석합니다.')}</p>
                </div>

                {contents.length === 0 ? (
                    <div className="py-40 text-center glass-effect rounded-[40px] border border-dashed border-white/10">
                        <VideoIcon className="mx-auto text-white/10 mb-6" size={64} />
                        <p className="text-white/30 font-medium">{t('등록된 참고 영상이 아직 없습니다.')}</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                            {paginatedContents.map((content) => (
                                <div key={content.id} className="group glass-effect p-10 rounded-[40px] hover:border-primary/50 transition-all flex flex-col h-full border border-white/5">
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                                            {t('참고 영상')}
                                        </span>
                                        <div className="text-[10px] text-white/30 font-bold tracking-widest uppercase">
                                            {new Date(content.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-6 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                                        {content.title}
                                    </h3>
                                    <p className="text-white/50 leading-relaxed mb-auto line-clamp-4 font-medium">
                                        {content.content}
                                    </p>
                                    <Link to={`/contents/${content.id}`} className="mt-12 flex items-center justify-between group/btn">
                                        <span className="text-xs font-black tracking-widest uppercase text-white/30">{t('Watch Video')}</span>
                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:border-primary transition-all">
                                            <ChevronRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 rounded-xl glass-effect flex items-center justify-center border border-white/5 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={18} className="rotate-180" />
                                </button>

                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === page
                                                ? 'premium-gradient text-white shadow-lg shadow-primary/20'
                                                : 'glass-effect border border-white/5 text-white/40 hover:text-white'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 rounded-xl glass-effect flex items-center justify-center border border-white/5 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default ReferenceVideos

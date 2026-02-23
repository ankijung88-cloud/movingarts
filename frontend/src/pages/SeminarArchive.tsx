import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { contentApi, authApi } from '../services/api'
import { BookOpen, Lock, ArrowRight, ChevronRight } from 'lucide-react'

const SeminarArchive = () => {
    const [contents, setContents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isSubscriber, setIsSubscriber] = useState<boolean | null>(null)
    const [category, setCategory] = useState('세미나')

    const categories = ['ALL', '연구정보', '참고 영상', '세미나']

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
                setContents(data)
            } else {
                setContents([])
            }
        } catch (err: any) {
            console.error('Failed to fetch archive:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAccess()
    }, [])

    const safeContents = Array.isArray(contents) ? contents : [];
    const filteredContents = category === 'ALL'
        ? safeContents
        : safeContents.filter((c: any) => c.category === category)

    if (loading) {
        return (
            <div className="pt-40 pb-20 min-h-screen flex items-center justify-center">
                <div className="text-white/30 font-black animate-pulse tracking-widest uppercase">Syncing Seminar Data...</div>
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
                    <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter">프리미엄 전용 콘텐츠</h2>
                    <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-16 font-medium">
                        이 학술 자료실은 유료 멤버십 회원에게만 공개됩니다. <br />
                        인증된 연구 데이터와 세미나 영상을 지금 바로 확인하세요.
                    </p>
                    <Link to="/subscription" className="px-16 py-6 premium-gradient rounded-full text-xl font-bold hover:scale-105 transition-all flex items-center gap-4 shadow-2xl shadow-primary/50">
                        멤버십 가입하기 <ArrowRight size={24} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-40 pb-20 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div>
                        <div className="text-primary text-[10px] font-black tracking-widest uppercase mb-4">Subscriber Only</div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">세미나</h1>
                        <p className="text-white/50 text-lg font-medium">학술 세미나 기록 및 전문 연구 발표 자료를 탐독하십시오.</p>
                    </div>

                    <div className="flex gap-2 p-1.5 glass-effect rounded-2xl border border-white/5">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${category === cat ? 'premium-gradient text-white' : 'hover:bg-white/5 text-white/40'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredContents.length === 0 ? (
                    <div className="py-40 text-center glass-effect rounded-[40px] border border-dashed border-white/10">
                        <BookOpen className="mx-auto text-white/10 mb-6" size={64} />
                        <p className="text-white/30 font-medium">해당 카테고리에 등록된 콘텐츠가 아직 없습니다.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredContents.map((content) => (
                            <div key={content.id} className="group glass-effect p-10 rounded-[40px] hover:border-primary/50 transition-all flex flex-col h-full border border-white/5">
                                <div className="flex justify-between items-center mb-8">
                                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                                        {content.category}
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
                                    <span className="text-xs font-black tracking-widest uppercase text-white/30">Watch Seminar</span>
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:border-primary transition-all">
                                        <ChevronRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SeminarArchive

import { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, User, LogOut } from 'lucide-react'
import AuthModal from './AuthModal'
import { authApi } from '../services/api'
import { useLanguage } from '../context/LanguageContext'

const Navigation = () => {
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const { language, setLanguage, t } = useLanguage()

    useEffect(() => {
        const savedUser = sessionStorage.getItem('user')
        if (savedUser) setUser(JSON.parse(savedUser))
    }, [])

    const handleLogout = () => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        setUser(null)
    }

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-[#0F172A] border-b border-white/5 py-4">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 premium-gradient rounded-full flex items-center justify-center font-bold">A</div>
                        <span className="font-bold text-lg tracking-tight">{t('신체 구조 움직임 연구소')}</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/70">
                        <Link to="/archive" className="hover:text-white transition-colors">{t('연구 자료실')}</Link>
                        <Link to="/reference-videos" className="hover:text-white transition-colors">{t('참고 영상')}</Link>
                        <Link to="/seminars" className="hover:text-white transition-colors">{t('세미나')}</Link>
                        <Link to="/about" className="hover:text-white transition-colors">{t('연구소 소개')}</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 p-1 glass-effect rounded-lg border border-white/5">
                            <button
                                onClick={() => setLanguage('kr')}
                                className={`px-2 py-1 text-[10px] font-bold rounded ${language === 'kr' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
                            >
                                KR
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-2 py-1 text-[10px] font-bold rounded ${language === 'en' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
                            >
                                EN
                            </button>
                        </div>

                        <button className="text-white/70 hover:text-white"><Search size={20} /></button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-[10px] font-black tracking-widest uppercase text-primary border border-primary/30 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors">
                                        ADMIN
                                    </Link>
                                )}
                                <span className="text-sm font-medium text-white/60">{user.name}{t('님')}</span>
                                <button onClick={handleLogout} className="text-white/40 hover:text-white"><LogOut size={18} /></button>
                            </div>
                        ) : (
                            <button onClick={() => setIsAuthOpen(true)} className="text-white/70 hover:text-white flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/5 transition-colors">
                                <User size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">{t('로그인')}</span>
                            </button>
                        )}

                        <Link to="/subscription" className="hidden sm:block px-5 py-2 premium-gradient rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                            {t('연구 멤버십')}
                        </Link>
                        <button className="md:hidden text-white"><Menu size={24} /></button>
                    </div>
                </div>
            </nav>
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => window.location.reload()} />
        </>
    )
}

export default Navigation

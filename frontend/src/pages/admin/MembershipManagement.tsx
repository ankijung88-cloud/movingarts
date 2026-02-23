import { useState, useEffect } from 'react'
import { adminApi } from '../../services/api'
import { CreditCard, Calendar, User, Zap } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const MembershipManagement = () => {
    const { t } = useLanguage()
    const [memberships, setMemberships] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                const { data } = await adminApi.getMemberships()
                setMemberships(data)
            } catch (err) {
                console.error('Failed to fetch memberships:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchMemberships()
    }, [])

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter mb-4">{t('구독 및 결제 관리')}</h2>
                    <p className="text-white/50 text-sm">{t('멤버십 회원들의 결제 상태와 유효 기간을 실시간으로 확인합니다.')}</p>
                </div>
            </div>

            <div className="glass-effect rounded-[32px] overflow-hidden border border-white/5">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 text-[10px] tracking-widest uppercase text-white/40">
                            <th className="py-6 px-8">{t('회원명')}</th>
                            <th className="py-6 px-8">{t('플랜 타입')}</th>
                            <th className="py-6 px-8">{t('상태')}</th>
                            <th className="py-6 px-8">{t('시작일')}</th>
                            <th className="py-6 px-8">{t('만료일')}</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-white/70">
                        {memberships.map((m) => (
                            <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-6 px-8">
                                    <div className="font-bold">{m.user_name}</div>
                                    <div className="text-[10px] text-white/30 uppercase">{m.user_email}</div>
                                </td>
                                <td className="py-6 px-8 uppercase font-bold text-xs tracking-wider">{m.type}</td>
                                <td className="py-6 px-8">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${m.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {m.status}
                                    </span>
                                </td>
                                <td className="py-6 px-8 text-white/40 font-mono text-xs">{new Date(m.start_date).toLocaleDateString()}</td>
                                <td className="py-6 px-8 text-white/40 font-mono text-xs">{new Date(m.end_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <div className="py-20 text-center text-white/30">{t('결제 데이터를 검증하는 중...')}</div>}
                {!loading && memberships.length === 0 && (
                    <div className="py-20 text-center text-white/30 italic">{t('현재 결제된 멤버십 정보가 없습니다.')}</div>
                )}
            </div>
        </div>
    )
}

export default MembershipManagement

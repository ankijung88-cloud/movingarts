import { useState, useEffect } from 'react'
import { adminApi } from '../../services/api'
import { CreditCard, Calendar, User, Zap, CheckCircle, Clock } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const MembershipManagement = () => {
    const { t } = useLanguage()
    const [memberships, setMemberships] = useState<any[]>([])
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [requestLoading, setRequestLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        setRequestLoading(true)
        try {
            const [mRes, rRes] = await Promise.all([
                adminApi.getMemberships(),
                adminApi.getMembershipRequests()
            ])
            setMemberships(mRes.data)
            setRequests(rRes.data)
        } catch (err) {
            console.error('Failed to fetch data:', err)
        } finally {
            setLoading(false)
            setRequestLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleApprove = async (id: number) => {
        if (!window.confirm(t('이 요청을 승인하시겠습니까?'))) return
        try {
            await adminApi.approveMembershipRequest(id, { adminComment: 'Approved via dashboard' })
            alert(t('승인이 완료되었습니다.'))
            fetchData()
        } catch (err) {
            alert(t('승인 처리 중 오류가 발생했습니다.'))
        }
    }

    const pendingRequests = requests.filter(r => r.status === 'pending')

    return (
        <div className="container mx-auto pb-20">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter mb-4">{t('구독 및 승인 관리')}</h2>
                    <p className="text-white/50 text-sm">{t('멤버십 결제 내역과 직접 승인 요청을 통합하여 관리합니다.')}</p>
                </div>
            </div>

            {/* Approval Requests Section */}
            <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Clock size={20} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{t('승인 대기 중인 요청')} <span className="text-primary ml-2">{pendingRequests.length}</span></h3>
                </div>

                <div className="glass-effect rounded-[32px] overflow-hidden border border-white/5">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] tracking-widest uppercase text-white/40">
                                <th className="py-6 px-8">{t('회원 정보')}</th>
                                <th className="py-6 px-8">{t('요청 상세')}</th>
                                <th className="py-6 px-8">{t('신청 일시')}</th>
                                <th className="py-6 px-8 text-right">{t('작업')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-white/70">
                            {pendingRequests.map((r) => (
                                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-6 px-8">
                                        <div className="font-bold">{r.user_name}</div>
                                        <div className="text-[10px] text-white/30 uppercase">{r.user_email}</div>
                                    </td>
                                    <td className="py-6 px-8 text-xs text-white/50">{r.request_details}</td>
                                    <td className="py-6 px-8 text-white/40 font-mono text-xs">{new Date(r.created_at).toLocaleString()}</td>
                                    <td className="py-6 px-8 text-right">
                                        <button
                                            onClick={() => handleApprove(r.id)}
                                            className="px-6 py-2 premium-gradient rounded-full text-[10px] font-black uppercase tracking-wider hover:scale-105 transition-all"
                                        >
                                            {t('승인 처리')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {requestLoading && <div className="py-12 text-center text-white/30">{t('요청 데이터를 불러오는 중...')}</div>}
                    {!requestLoading && pendingRequests.length === 0 && (
                        <div className="py-12 text-center text-white/30 italic">{t('현재 대기 중인 승인 요청이 없습니다.')}</div>
                    )}
                </div>
            </div>

            {/* Active Memberships Section */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                        <CheckCircle size={20} className="text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold">{t('활성 멤버십 목록')}</h3>
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
                    {loading && <div className="py-12 text-center text-white/30">{t('결제 데이터를 검증하는 중...')}</div>}
                    {!loading && memberships.length === 0 && (
                        <div className="py-12 text-center text-white/30 italic">{t('현재 결제된 멤버십 정보가 없습니다.')}</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MembershipManagement

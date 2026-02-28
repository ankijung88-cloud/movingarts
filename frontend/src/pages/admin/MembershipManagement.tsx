import { useState, useEffect } from 'react'
2: import { adminApi } from '../../services/api'
3: import { CreditCard, Calendar, User, Zap, CheckCircle, Clock } from 'lucide-react'
4: import { useLanguage } from '../../context/LanguageContext'
5:
6: const MembershipManagement = () => {
    7: const { t } = useLanguage()
    8: const [memberships, setMemberships] = useState<any[]>([])
    9: const [requests, setRequests] = useState<any[]>([])
    10: const [loading, setLoading] = useState(true)
    11: const [requestLoading, setRequestLoading] = useState(true)
    12:
    13: const fetchData = async () => {
        14: setLoading(true)
        15: setRequestLoading(true)
        16: try {
            17: const [mRes, rRes] = await Promise.all([
                18: adminApi.getMemberships(),
                19: adminApi.getMembershipRequests()
20: ])
            21: setMemberships(mRes.data)
            22: setRequests(rRes.data)
            23:
        } catch (err) {
            24: console.error('Failed to fetch data:', err)
            25:
        } finally {
            26: setLoading(false)
            27: setRequestLoading(false)
            28:
        }
        29:
    }
    30:
    31: useEffect(() => {
        32: fetchData()
        33:
    }, [])
    34:
    35: const handleApprove = async (id: number) => {
        36: if (!window.confirm(t('이 요청을 승인하시겠습니까?'))) return
        37: try {
            38: await adminApi.approveMembershipRequest(id, { adminComment: 'Approved via dashboard' })
            39: alert(t('승인이 완료되었습니다.'))
            40: fetchData()
            41:
        } catch (err) {
            42: alert(t('승인 처리 중 오류가 발생했습니다.'))
            43:
        }
        44:
    }
    45:
    46: const pendingRequests = requests.filter(r => r.status === 'pending')
    47:
    48: return (
        49: <div className="container mx-auto pb-20">
            50:             {/* Header */}
            51:             <div className="flex justify-between items-end mb-12">
                52:                 <div>
                    53:                     <h2 className="text-4xl font-black tracking-tighter mb-4">{t('구독 및 승인 관리')}</h2>
                    54:                     <p className="text-white/50 text-sm">{t('멤버십 결제 내역과 직접 승인 요청을 통합하여 관리합니다.')}</p>
                    55:                 </div>
                56:             </div>
            57:
            58:             {/* Approval Requests Section */}
            59:             <div className="mb-16">
                60:                 <div className="flex items-center gap-3 mb-6">
                    61:                     <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        62:                         <Clock size={20} className="text-primary" />
                        63:                     </div>
                    64:                     <h3 className="text-xl font-bold">{t('승인 대기 중인 요청')} <span className="text-primary ml-2">{pendingRequests.length}</span></h3>
                    65:                 </div>
                66:
                67:                 <div className="glass-effect rounded-[32px] overflow-hidden border border-white/5">
                    68:                     <table className="w-full text-left">
                        69:                         <thead>
                            70:                             <tr className="border-b border-white/5 text-[10px] tracking-widest uppercase text-white/40">
                                71:                                 <th className="py-6 px-8">{t('회원 정보')}</th>
                                72:                                 <th className="py-6 px-8">{t('요청 상세')}</th>
                                73:                                 <th className="py-6 px-8">{t('신청 일시')}</th>
                                74:                                 <th className="py-6 px-8 text-right">{t('작업')}</th>
                                75:                             </tr>
                            76:                         </thead>
                        77:                         <tbody className="text-sm text-white/70">
                            78:                             {pendingRequests.map((r) => (
                                79:                                 <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                80:                                     <td className="py-6 px-8">
                                    81:                                         <div className="font-bold">{r.user_name}</div>
                                    82:                                         <div className="text-[10px] text-white/30 uppercase">{r.user_email}</div>
                                    83:                                     </td>
                                84:                                     <td className="py-6 px-8 text-xs text-white/50">{r.request_details}</td>
                                85:                                     <td className="py-6 px-8 text-white/40 font-mono text-xs">{new Date(r.created_at).toLocaleString()}</td>
                                86:                                     <td className="py-6 px-8 text-right">
                                    87:                                         <button 
88:                                             onClick={() => handleApprove(r.id)}
                                    89:                                             className="px-6 py-2 premium-gradient rounded-full text-[10px] font-black uppercase tracking-wider hover:scale-105 transition-all"
90:                                         >
                                    91:                                             {t('승인 처리')}
                                    92:                                         </button>
                                93:                                     </td>
                            94:                                 </tr>
95:                             ))}
                        96:                         </tbody>
                    97:                     </table>
                98:                     {requestLoading && <div className="py-12 text-center text-white/30">{t('요청 데이터를 불러오는 중...')}</div>}
                99:                     {!requestLoading && pendingRequests.length === 0 && (
                    100:                         <div className="py-12 text-center text-white/30 italic">{t('현재 대기 중인 승인 요청이 없습니다.')}</div>
101:                     )}
                102:                 </div>
            103:             </div>
    104:
    105: {/* Active Memberships Section */ }
    106: <div>
        107:                 <div className="flex items-center gap-3 mb-6">
            108:                     <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                109:                         <CheckCircle size={20} className="text-emerald-400" />
                110:                     </div>
            111:                     <h3 className="text-xl font-bold">{t('활성 멤버십 목록')}</h3>
            112:                 </div>
        113:
        114:                 <div className="glass-effect rounded-[32px] overflow-hidden border border-white/5">
            115:                     <table className="w-full text-left">
                116:                         <thead>
                    117:                             <tr className="border-b border-white/5 text-[10px] tracking-widest uppercase text-white/40">
                        118:                                 <th className="py-6 px-8">{t('회원명')}</th>
                        119:                                 <th className="py-6 px-8">{t('플랜 타입')}</th>
                        120:                                 <th className="py-6 px-8">{t('상태')}</th>
                        121:                                 <th className="py-6 px-8">{t('시작일')}</th>
                        122:                                 <th className="py-6 px-8">{t('만료일')}</th>
                        123:                             </tr>
                    124:                         </thead>
                125:                         <tbody className="text-sm text-white/70">
                    126:                             {memberships.map((m) => (
                        127:                                 <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        128:                                     <td className="py-6 px-8">
                            129:                                         <div className="font-bold">{m.user_name}</div>
                            130:                                         <div className="text-[10px] text-white/30 uppercase">{m.user_email}</div>
                            131:                                     </td>
                        132:                                     <td className="py-6 px-8 uppercase font-bold text-xs tracking-wider">{m.type}</td>
                        133:                                     <td className="py-6 px-8">
                            134:                                         <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${m.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                135:                                             {m.status}
                                136:                                         </span>
                            137:                                     </td>
                        138:                                     <td className="py-6 px-8 text-white/40 font-mono text-xs">{new Date(m.start_date).toLocaleDateString()}</td>
                        139:                                     <td className="py-6 px-8 text-white/40 font-mono text-xs">{new Date(m.end_date).toLocaleDateString()}</td>
                        140:                                 </tr>
141:                             ))}
                    142:                         </tbody>
                143:                     </table>
            144:                     {loading && <div className="py-12 text-center text-white/30">{t('결제 데이터를 검증하는 중...')}</div>}
            145:                     {!loading && memberships.length === 0 && (
                146:                         <div className="py-12 text-center text-white/30 italic">{t('현재 결제된 멤버십 정보가 없습니다.')}</div>
147:                     )}
            148:                 </div>
        149:             </div>
    150:         </div >
        151:     )
    152:
}
153:
154: export default MembershipManagement

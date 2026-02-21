import { Check, Info, ShieldCheck, Zap, Users, Monitor } from 'lucide-react'
import { Link } from 'react-router-dom'

const Pricing = () => {
    return (
        <div className="pt-40 pb-32">
            <div className="container mx-auto px-6">
                <div className="text-center mb-24">
                    <div className="text-primary text-[10px] font-black tracking-widest uppercase mb-6">MEMBERSHIP PLANS</div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">이해의 깊이를 더하다: <br /><span className="text-primary italic">멤버십 혜택</span></h1>
                    <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
                        무술 상호작용 및 신체 구조 동작 이론에 대한 전문적인 학문적 접근을 제공합니다. <br />
                        깊이와 효율의 조화를 추구하는 연구원분들께 최선의 선택입니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-32">
                    {/* Monthly Plan */}
                    <div className="glass-effect p-12 rounded-[50px] relative overflow-hidden group hover:border-primary/50 transition-all border border-white/5">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">월간 연구 멤버십</h3>
                                <p className="text-white/40 text-sm">매월 자유로운 갱신 및 해지</p>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-black">₩55,000</div>
                                <div className="text-[10px] text-white/30 uppercase tracking-widest mt-1">per month</div>
                            </div>
                        </div>

                        <Link to="/checkout?plan=monthly" className="block w-full py-5 premium-gradient rounded-full text-center font-bold text-lg mb-12 hover:scale-[1.02] transition-transform">
                            멤버십 시작하기
                        </Link>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 glass-effect rounded-xl flex items-center justify-center shrink-0"><Zap size={18} className="text-primary" /></div>
                                <div>
                                    <h4 className="text-sm font-bold mb-1">전용 학술 분석</h4>
                                    <p className="text-xs text-white/40 leading-relaxed">구조 정렬과 신체 동역학에 매주 업데이트되는 100건 이상의 텍스트/영상 자료를 무제한 열람 가능</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 glass-effect rounded-xl flex items-center justify-center shrink-0"><Users size={18} className="text-primary" /></div>
                                <div>
                                    <h4 className="text-sm font-bold mb-1">연구진 Q&A 게시판</h4>
                                    <p className="text-xs text-white/40 leading-relaxed">질문 등록 시 분석팀 및 Q&A 전문 위원이 24시간 이내 직접적 피드백 제공</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Yearly Plan (Annual) - Highlighted */}
                    <div className="p-12 rounded-[50px] relative overflow-hidden border-2 border-primary group">
                        <div className="absolute top-0 right-0 py-2 px-8 premium-gradient text-[10px] font-black tracking-widest uppercase rounded-bl-3xl">BEST VALUE</div>
                        <div className="absolute inset-0 bg-primary/10 -z-10 bg-glass-gradient opacity-20"></div>

                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">연간 연구 멤버십</h3>
                                <p className="text-primary/70 text-sm font-bold tracking-tight">연간 결제 시 20% 특별 혜택 적용</p>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-black">₩490,000</div>
                                <div className="text-[10px] text-white/30 uppercase tracking-widest mt-1">per year</div>
                            </div>
                        </div>

                        <Link to="/checkout?plan=yearly" className="block w-full py-5 premium-gradient rounded-full text-center font-bold text-lg mb-12 hover:scale-[1.02] transition-transform shadow-xl shadow-primary/30">
                            연간 멤버십 시작하기
                        </Link>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0"><ShieldCheck size={18} className="text-primary" /></div>
                                <div>
                                    <h4 className="text-sm font-bold mb-1">프리미엄 레포트 발송</h4>
                                    <p className="text-xs text-white/40 leading-relaxed">매분기 발행되는 분과별 통합 연구 레포트 실물 책자 및 PDF 파일 우선 제공</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0"><Monitor size={18} className="text-primary" /></div>
                                <div>
                                    <h4 className="text-sm font-bold mb-1">오프라인 세미나 초대</h4>
                                    <p className="text-xs text-white/40 leading-relaxed">연간 회원을 위한 정규 오프라인 세미나 1회 무료 참가권 및 우선 대기 등록 권한</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="max-w-6xl mx-auto overflow-hidden rounded-[40px] glass-effect border border-white/5">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] tracking-widest uppercase text-white/40">
                                <th className="py-8 px-8 text-left">연구 혜택 및 기능</th>
                                <th className="py-8 px-8 text-center">일반 회원</th>
                                <th className="py-8 px-8 text-center text-primary font-bold">연구 멤버십</th>
                            </tr>
                        </thead>
                        <tbody className="text-white/70">
                            <tr className="border-b border-white/5">
                                <td className="py-6 px-8">기본 학술 정보 열람</td>
                                <td className="py-6 px-8 text-center"><Check size={16} className="mx-auto" /></td>
                                <td className="py-6 px-8 text-center text-primary"><Check size={16} className="mx-auto" /></td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-6 px-8">전문 동작분석 영상 및 아카이브</td>
                                <td className="py-6 px-8 text-center"><span className="text-white/20">보급형 한정</span></td>
                                <td className="py-6 px-8 text-center text-primary"><Check size={16} className="mx-auto" /></td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-6 px-8">첨단 물리 법칙 데이터 분석 툴</td>
                                <td className="py-6 px-8 text-center text-white/20">X</td>
                                <td className="py-6 px-8 text-center text-primary"><Check size={16} className="mx-auto" /></td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-6 px-8">실시간 Q&A 지원</td>
                                <td className="py-6 px-8 text-center text-white/20">X</td>
                                <td className="py-6 px-8 text-center text-primary"><Check size={16} className="mx-auto" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Pricing

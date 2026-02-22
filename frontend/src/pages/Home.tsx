import { ArrowRight, Play, BookOpen, Shield, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className="pt-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-40 pb-40 min-h-[90vh] flex items-center">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 blur-[150px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] -z-10 rounded-full -translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-effect text-[10px] font-bold tracking-widest uppercase text-primary mb-10 border border-primary/20">
                        신체 구조 및 움직임 연구소 | Vol. 01 발행
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black mb-10 leading-[1.1] tracking-tighter">
                        단순한 <span className="text-primary italic">근육 기억</span>을 <br />
                        넘어서
                    </h1>

                    <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-16 font-medium">
                        우리는 움직임 하나가 인간 삶의 근원적인 감각임을 탐구하며, 골격 정렬 <br className="hidden md:block" />
                        속에 숨겨진 물리적 원리를 규명합니다.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Link to="/subscription" className="px-10 py-5 premium-gradient rounded-full font-bold text-lg shadow-2xl shadow-primary/40 hover:scale-105 transition-all flex items-center gap-3">
                            연구 자료실 접속하기 <ArrowRight size={20} />
                        </Link>
                        <a href="#philosophy" className="px-10 py-5 glass-effect rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-3">
                            연구 방법론 보기
                        </a>
                    </div>


                </div>
            </section>

            {/* Philosophy Section */}
            <section id="philosophy" className="py-40 bg-[#020510]/30 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div>
                            <div className="text-primary text-[10px] font-black tracking-widest uppercase mb-4">학문 중심 기조</div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">동력 과학의 근간</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group glass-effect p-10 rounded-[40px] hover:border-primary/50 transition-all">
                            <div className="w-14 h-14 premium-gradient rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                <FlaskConical size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-6">운동 사슬 (Kinetic Chains)</h3>
                            <p className="text-white/50 leading-relaxed mb-10">척추 분절의 유기적 조절과 신체적 움직임을 통해 각 관절의 상호 협조성을 극대화합니다.</p>
                            <Link to="/subscription" className="text-xs font-black tracking-widest uppercase flex items-center gap-2 group-hover:text-primary transition-colors">데이터 탐독 <ArrowRight size={14} /></Link>
                        </div>

                        <div className="group glass-effect p-10 rounded-[40px] hover:border-primary/50 transition-all">
                            <div className="w-14 h-14 premium-gradient rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                <Play size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-6">무게 중심 (Center of Gravity)</h3>
                            <p className="text-white/50 leading-relaxed mb-10">중력 균형의 유지 관점에서 신체적 상호작용 및 고유 감각을 최상의 상태로 정렬합니다.</p>
                            <Link to="/subscription" className="text-xs font-black tracking-widest uppercase flex items-center gap-2 group-hover:text-primary transition-colors">데이터 탐독 <ArrowRight size={14} /></Link>
                        </div>

                        <div className="group glass-effect p-10 rounded-[40px] hover:border-primary/50 transition-all">
                            <div className="w-14 h-14 premium-gradient rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-6">구조적 통합 (Structural Integrity)</h3>
                            <p className="text-white/50 leading-relaxed mb-10">습관적 정렬의 불균형을 해결하여 개개인이 가진 본연의 신체적 잠재력을 끌어올립니다.</p>
                            <Link to="/subscription" className="text-xs font-black tracking-widest uppercase flex items-center gap-2 group-hover:text-primary transition-colors">데이터 탐독 <ArrowRight size={14} /></Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Membership CTA Section */}
            <section className="py-40">
                <div className="container mx-auto px-6">
                    <div className="relative overflow-hidden p-16 md:p-24 rounded-[60px] glass-effect text-center">
                        <div className="absolute top-0 left-0 w-full h-full premium-gradient opacity-10 -z-10"></div>
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/20 text-primary text-xs font-black tracking-widest mb-10">
                            PREMIUM ACCESS
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter">연구회원 가입하기</h2>
                        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
                            분과 전문가 활동가, 생체학적 연구자들과 함께 하십시오. 실전 경험, 영상 자료, <br className="hidden md:block" />
                            그리고 전문 트레이닝 가이드를 모두 제공합니다.
                        </p>
                        <Link to="/subscription" className="px-16 py-6 premium-gradient rounded-full text-xl font-bold hover:scale-105 transition-all flex items-center gap-4 mx-auto shadow-2xl shadow-primary/50">
                            지금 가입하기 - 월 49,000원 <ArrowRight size={24} />
                        </Link>
                        <p className="text-white/30 text-xs mt-10 tracking-widest">언제든 해지 가능 | 7일 이내 환불 보장</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home

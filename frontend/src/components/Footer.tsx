import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-[#020510] border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold mb-6">신체 구조 움직임 연구소</h3>
                        <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                            최상의 신체 퍼포먼스를 위한 전술적 신체 교정과 연구를 통해 구조적 결함에 대한 과학적 해법을 제시합니다.
                        </p>
                        <div className="flex gap-4 mt-8">
                            <a href="#" className="p-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors"><Instagram size={18} /></a>
                            <a href="#" className="p-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors"><Facebook size={18} /></a>
                            <a href="#" className="p-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors"><Youtube size={18} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">메뉴</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><a href="#" className="hover:text-white">연구 아카이브</a></li>
                            <li><a href="#" className="hover:text-white">콘텐츠 정보</a></li>
                            <li><a href="#" className="hover:text-white">영상 세미나</a></li>
                            <li><a href="#" className="hover:text-white">자유 교육</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">법적 고지</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><a href="#" className="hover:text-white">이용 약관</a></li>
                            <li><a href="#" className="hover:text-white">개인정보 처리방침</a></li>
                            <li><a href="#" className="hover:text-white">법적 책임 한계</a></li>
                            <li><a href="#" className="hover:text-white">고객 지원</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6 text-[10px] text-white/30 tracking-widest uppercase">
                    <p>© 2024 Physical Structure & Movement Research Institute. All rights reserved.</p>
                    <div className="flex gap-8">
                        <span>Designed with Antigravity</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

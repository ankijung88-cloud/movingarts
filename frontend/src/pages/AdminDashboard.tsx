import { useState, useEffect } from 'react'
import { Link, useNavigate, Routes, Route } from 'react-router-dom'
import { Users, FileText, CreditCard, LayoutDashboard, ChevronRight } from 'lucide-react'
import UserManagement from './admin/UserManagement'
import MembershipManagement from './admin/MembershipManagement'
import ContentManagement from './admin/ContentManagement'
import AdminOverview from './admin/AdminOverview'

const AdminDashboard = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (!savedUser || JSON.parse(savedUser).role !== 'admin') {
            alert('관리자 권한이 필요합니다.')
            navigate('/')
        } else {
            setUser(JSON.parse(savedUser))
        }
    }, [navigate])

    if (!user) return null

    return (
        <div className="pt-20 min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 glass-effect border-r border-white/5 p-8 flex flex-col gap-8">
                <div>
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-white/40 mb-6 uppercase">Control Center</h2>
                    <div className="flex flex-col gap-2">
                        <Link to="/admin" className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <LayoutDashboard size={20} className="text-primary" />
                                <span className="text-sm font-bold">오버뷰</span>
                            </div>
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link to="/admin/users" className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <Users size={20} className="text-primary" />
                                <span className="text-sm font-bold">회원 관리</span>
                            </div>
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link to="/admin/memberships" className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <CreditCard size={20} className="text-primary" />
                                <span className="text-sm font-bold">구독 관리</span>
                            </div>
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link to="/admin/contents" className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <FileText size={20} className="text-primary" />
                                <span className="text-sm font-bold">콘텐츠 관리</span>
                            </div>
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-12 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<AdminOverview />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/memberships" element={<MembershipManagement />} />
                    <Route path="/contents" element={<ContentManagement />} />
                </Routes>
            </main>
        </div>
    )
}

export default AdminDashboard

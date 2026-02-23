import { useState, useEffect } from 'react'
import { adminApi } from '../../services/api'
import { Users, FileText, CreditCard, ArrowRight, UserPlus, Clock, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const AdminOverview = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeMemberships: 0,
        totalContents: 0
    })
    const [recentUsers, setRecentUsers] = useState<any[]>([])
    const [recentContents, setRecentContents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersRes, membershipsRes, contentsRes] = await Promise.all([
                    adminApi.getUsers(),
                    adminApi.getMemberships(),
                    adminApi.getContents()
                ])

                const users = usersRes.data
                const memberships = membershipsRes.data
                const contents = contentsRes.data

                setStats({
                    totalUsers: users.length,
                    activeMemberships: memberships.filter((m: any) => m.status === 'active').length,
                    totalContents: contents.length
                })

                setRecentUsers(users.slice(0, 5))
                setRecentContents(contents.slice(0, 5))
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white/20 font-black animate-pulse tracking-widest uppercase">Initializing Dashboard...</div>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">대시보드 오버뷰</h1>
                    <p className="text-white/40 text-sm font-medium">실시간 서비스 현황 및 주요 지표를 확인하세요.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-effect p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                            <Users size={24} className="text-primary" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black tracking-widest uppercase text-white/30 mb-1">전체 회원</div>
                            <div className="text-3xl font-black">{stats.totalUsers.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div className="glass-effect p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                            <CreditCard size={24} className="text-emerald-500" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black tracking-widest uppercase text-white/30 mb-1">활성 구독자</div>
                            <div className="text-3xl font-black">{stats.activeMemberships.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div className="glass-effect p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                            <FileText size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black tracking-widest uppercase text-white/30 mb-1">총 콘텐츠</div>
                            <div className="text-3xl font-black">{stats.totalContents.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="glass-effect p-10 rounded-[40px] border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold flex items-center gap-3">
                            <UserPlus size={18} className="text-primary" />
                            최근 가입 회원
                        </h3>
                        <Link to="/admin/users" className="text-[10px] font-black tracking-widest uppercase text-white/20 hover:text-primary transition-colors flex items-center gap-2 group">
                            Full List <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentUsers.map((u: any) => (
                            <div key={u.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xs font-black text-white/40 uppercase">
                                        {u.username?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">{u.username}</div>
                                        <div className="text-[10px] text-white/30 font-medium">{u.email}</div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Content */}
                <div className="glass-effect p-10 rounded-[40px] border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold flex items-center gap-3">
                            <Clock size={18} className="text-primary" />
                            최근 등록 콘텐츠
                        </h3>
                        <Link to="/admin/contents" className="text-[10px] font-black tracking-widest uppercase text-white/20 hover:text-primary transition-colors flex items-center gap-2 group">
                            Management <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentContents.map((c: any) => (
                            <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors">
                                <div className="flex flex-col gap-1 min-w-0">
                                    <div className="text-sm font-bold truncate pr-4">{c.title}</div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">{c.category}</span>
                                        <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">
                                            {new Date(c.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-white/20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminOverview

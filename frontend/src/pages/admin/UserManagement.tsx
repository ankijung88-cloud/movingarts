import { useState, useEffect } from 'react'
import { adminApi } from '../../services/api'
import { User, Shield, Search } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const UserManagement = () => {
    const { t } = useLanguage()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await adminApi.getUsers()
                setUsers(data)
            } catch (err) {
                console.error('Failed to fetch users:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter mb-4">{t('회원 관리')}</h2>
                    <p className="text-white/50 text-sm">{t('전체 등록된 사용자 목록과 권한을 확인합니다.')}</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                        type="text" placeholder={t('사용자 검색...')}
                        className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 outline-none focus:border-primary text-sm min-w-[300px]"
                    />
                </div>
            </div>

            <div className="glass-effect rounded-[32px] overflow-hidden border border-white/5">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 text-[10px] tracking-widest uppercase text-white/40">
                            <th className="py-6 px-8">{t('이름')}</th>
                            <th className="py-6 px-8">{t('이메일')}</th>
                            <th className="py-6 px-8">{t('전화번호')}</th>
                            <th className="py-6 px-8">{t('권한')}</th>
                            <th className="py-6 px-8">{t('가입일')}</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-white/70">
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-6 px-8 font-bold">{user.name}</td>
                                <td className="py-6 px-8 text-white/50">{user.email}</td>
                                <td className="py-6 px-8 text-white/50">{user.phone || '-'}</td>
                                <td className="py-6 px-8">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/60'}`}>
                                        {user.role === 'admin' && <Shield size={10} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-6 px-8 text-white/30 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && (
                    <div className="py-20 text-center text-white/30">{t('강력한 신체 정보를 불러오는 중...')}</div>
                )}
            </div>
        </div>
    )
}

export default UserManagement

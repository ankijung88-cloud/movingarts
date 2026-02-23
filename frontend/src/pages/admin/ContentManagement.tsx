import { useState, useEffect } from 'react'
import { adminApi } from '../../services/api'
import { Plus, Edit2, Trash2, FileText, Globe } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const ContentManagement = () => {
    const { t } = useLanguage()
    const [contents, setContents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [currentId, setCurrentId] = useState<number | null>(null)
    const [formData, setFormData] = useState({ title: '', content: '', category: '연구정보' })

    const fetchContents = async () => {
        try {
            const { data } = await adminApi.getContents()
            setContents(data)
        } catch (err) {
            console.error('Failed to fetch contents:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContents()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editMode && currentId) {
                await adminApi.updateContent(currentId, formData)
            } else {
                await adminApi.createContent(formData)
            }
            setIsFormOpen(false)
            setFormData({ title: '', content: '', category: '연구정보' })
            fetchContents()
        } catch (err) {
            alert(t('저장에 실패했습니다.'))
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm(t('정말 삭제하시겠습니까?'))) {
            try {
                await adminApi.deleteContent(id)
                fetchContents()
            } catch (err) {
                alert(t('삭제에 실패했습니다.'))
            }
        }
    }

    const startEdit = (content: any) => {
        setEditMode(true)
        setCurrentId(content.id)
        setFormData({ title: content.title, content: content.content, category: content.category })
        setIsFormOpen(true)
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter mb-4">{t('콘텐츠 관리')}</h2>
                    <p className="text-white/50 text-sm">{t('학술 자료 및 연구 정보를 직접 등록하고 관리합니다.')}</p>
                </div>
                <button
                    onClick={() => { setEditMode(false); setIsFormOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 premium-gradient rounded-full font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={18} /> {t('새 콘텐츠 작성')}
                </button>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#050A1A]/90 backdrop-blur-xl">
                    <div className="glass-effect w-full max-w-2xl p-12 rounded-[40px] relative">
                        <h3 className="text-2xl font-black mb-10 tracking-tighter">{editMode ? t('콘텐츠 수정') : t('새 콘텐츠 등록')}</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest uppercase text-white/40">{t('카테고리')}</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary appearance-none"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="연구정보">{t('연구정보')}</option>
                                    <option value="참고 영상">{t('참고 영상')}</option>
                                    <option value="세미나">{t('세미나')}</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest uppercase text-white/40">{t('제목')}</label>
                                <input
                                    type="text" placeholder={t('연구 주제를 입력하세요...')} required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest uppercase text-white/40">{t('내용')}</label>
                                <textarea
                                    placeholder={t('상세 내용을 입력하세요...')} required rows={6}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary resize-none"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="submit" className="flex-grow py-5 premium-gradient rounded-full font-bold text-lg">{t('저장하기')}</button>
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-10 py-5 glass-effect rounded-full font-bold text-lg">{t('취소')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contents.map((content) => (
                    <div key={content.id} className="glass-effect p-8 rounded-[32px] group hover:border-primary/50 transition-all border border-white/5">
                        <div className="flex justify-between items-start mb-6">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-lg">
                                {t(content.category)}
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(content)} className="p-2 hover:text-primary transition-colors"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(content.id)} className="p-2 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <h4 className="text-xl font-bold mb-4 line-clamp-2">{t(content.title)}</h4>
                        <p className="text-white/40 text-sm mb-6 line-clamp-3 leading-relaxed">{t(content.content)}</p>
                        <div className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
                            {new Date(content.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
            {loading && <div className="py-20 text-center text-white/30">{t('학술 데이터를 동기화하는 중...')}</div>}
            {!loading && contents.length === 0 && !isFormOpen && (
                <div className="py-40 text-center glass-effect rounded-[40px] border border-dashed border-white/10">
                    <FileText className="mx-auto text-white/10 mb-6" size={64} />
                    <p className="text-white/30 font-medium">{t('등록된 연구 콘텐츠가 없습니다.')}</p>
                </div>
            )}
        </div>
    )
}

export default ContentManagement

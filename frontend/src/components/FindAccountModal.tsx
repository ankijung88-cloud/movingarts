import { useState } from 'react';
import { authApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const FindAccountModal = ({ isOpen, onClose, type }: { isOpen: boolean; onClose: () => void; type: 'email' | 'password' }) => {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleFindEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await authApi.findEmail({ name: formData.name, phone: formData.phone });
            setResult(data.email);
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || t('사용자를 찾을 수 없습니다.'));
        } finally {
            setLoading(false);
        }
    };

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await authApi.resetPasswordRequest({ email: formData.email, name: formData.name });
            setResult(data.message);
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || t('정보가 일치하지 않습니다.'));
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setStep(1);
        setFormData({ name: '', phone: '', email: '' });
        setResult('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 w-screen h-screen z-[100000] flex items-center justify-center p-6 bg-[#050A1A]/90 backdrop-blur-3xl">
            <div className="glass-effect w-full max-w-md p-10 rounded-[40px] relative shadow-[0_0_100px_rgba(0,102,255,0.3)]">
                <button onClick={resetAndClose} className="absolute top-8 right-8 text-white/40 hover:text-white">&times;</button>
                <h2 className="text-2xl font-black mb-8 tracking-tighter">
                    {type === 'email' ? t('이메일 찾기') : t('비밀번호 찾기')}
                </h2>

                {step === 1 ? (
                    <form onSubmit={type === 'email' ? handleFindEmail : handleResetRequest} className="space-y-6">
                        {type === 'email' ? (
                            <>
                                <input
                                    type="text" placeholder={t('이름')} required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <input
                                    type="text" placeholder={t('연락처 (- 제외)')} required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </>
                        ) : (
                            <>
                                <input
                                    type="text" placeholder={t('이름')} required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <input
                                    type="email" placeholder={t('이메일')} required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </>
                        )}

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 premium-gradient rounded-full font-bold text-lg shadow-xl shadow-primary/20 disabled:opacity-50"
                        >
                            {loading ? t('조회 중...') : t('확인')}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-8">
                        <div className="bg-primary/10 rounded-3xl p-8 mb-8 border border-primary/20">
                            {type === 'email' ? (
                                <p className="text-white/60 leading-relaxed">
                                    {t('가입하신 이메일은')} <br />
                                    <span className="text-2xl font-black text-white block mt-2">{result}</span>
                                    {t('입니다.')}
                                </p>
                            ) : (
                                <p className="text-white/60 leading-relaxed">
                                    {t(result)}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={resetAndClose}
                            className="w-full py-5 glass-effect border-white/10 rounded-full font-bold text-lg hover:bg-white/5 transition-all"
                        >
                            {t('로그인하러 가기')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindAccountModal;

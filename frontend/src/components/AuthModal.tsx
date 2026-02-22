import { useState } from 'react';
import { authApi } from '../services/api';
import FindAccountModal from './FindAccountModal';

const AuthModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });
    const [error, setError] = useState('');
    const [recoveryType, setRecoveryType] = useState<'email' | 'password' | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const { data } = await authApi.login({ email: formData.email, password: formData.password });
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            } else {
                await authApi.register(formData);
                setIsLogin(true);
                setFormData({ email: '', password: '', name: '', phone: '' });
                return;
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || '오류가 발생했습니다.');
        }
    };

    return (
        <>
            <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center p-6 bg-[#050A1A]/85 backdrop-blur-2xl">
                <div className="glass-effect w-full max-w-md p-10 rounded-[40px] relative shadow-[0_0_100px_rgba(0,102,255,0.4)] animate-in fade-in zoom-in duration-300">
                    <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white">&times;</button>
                    <h2 className="text-3xl font-black mb-8 tracking-tighter">{isLogin ? '로그인' : '회원가입'}</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <>
                                <input
                                    type="text" placeholder="이름" required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <input
                                    type="text" placeholder="연락처"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </>
                        )}
                        <input
                            type="email" placeholder="이메일" required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            type="password" placeholder="비밀번호" required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button type="submit" className="w-full py-5 premium-gradient rounded-full font-bold text-lg shadow-xl shadow-primary/20">
                            {isLogin ? '로그인하기' : '가입하기'}
                        </button>
                    </form>

                    {isLogin && (
                        <div className="flex justify-center gap-4 mt-8 text-xs text-white/30">
                            <button onClick={() => setRecoveryType('email')} className="hover:text-white transition-colors">이메일 찾기</button>
                            <span className="opacity-20">|</span>
                            <button onClick={() => setRecoveryType('password')} className="hover:text-white transition-colors">비밀번호 찾기</button>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="w-full mt-6 text-sm text-white/40 hover:text-white transition-colors"
                    >
                        {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
                    </button>
                </div>
            </div>

            <FindAccountModal
                isOpen={recoveryType !== null}
                onClose={() => setRecoveryType(null)}
                type={recoveryType || 'email'}
            />
        </>
    );
};

export default AuthModal;

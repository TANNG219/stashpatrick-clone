"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock } from 'lucide-react';

const LoginPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        captcha: '',
        rememberMe: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate login process
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#A5C663] to-[#8DB859] font-sans p-4">
            <div className="relative pt-[96px] w-full max-w-[368px]">
                
                {/* Mascot Image */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[271px] z-10">
                    <Image
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/6e6a75ef-6d16-4701-ad20-405c06e2befa-stashpatricks-ru/assets/images/logo-1.png"
                        alt="StashPatrick Mascot"
                        width={271}
                        height={192}
                        priority
                    />
                </div>

                {/* Login Card */}
                <div className="relative bg-card text-card-foreground rounded-[12px] shadow-[0_4px_8px_0_rgba(0,0,0,0.06),0_0_4px_0_rgba(0,0,0,0.14)] w-full">
                    <div className="p-6">
                        <form className="w-[320px] mx-auto" onSubmit={handleSubmit}>
                            {/* Title */}
                            <h1 className="text-center text-2xl font-semibold text-[#424344] pb-[30px]">
                                Login
                            </h1>

                            {/* Username Input */}
                            <div className="relative mb-[10px]">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-[22px] text-[#828996] z-10">
                                    <User size={17} />
                                </span>
                                <input
                                    type="text"
                                    name="login"
                                    value={formData.login}
                                    onChange={handleInputChange}
                                    placeholder="Login"
                                    className="w-full h-[45px] bg-[#f5f5f5] border border-input rounded-[5px] pl-[54px] pr-[30px] text-[15px] focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative mb-[10px]">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-[22px] text-[#828996] z-10">
                                    <Lock size={17} />
                                </span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password"
                                    className="w-full h-[45px] bg-[#f5f5f5] border border-input rounded-[5px] pl-[54px] pr-[30px] text-[15px] focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground"
                                />
                            </div>

                            {/* Captcha Input */}
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    name="captcha"
                                    value={formData.captcha}
                                    onChange={handleInputChange}
                                    placeholder="Captcha"
                                    className="w-full h-[45px] bg-[#f5f5f5] border border-input rounded-[7px] py-2 px-4 text-[18px] focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <Image
                                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/6e6a75ef-6d16-4701-ad20-405c06e2befa-stashpatricks-ru/assets/images/inverse-2.png"
                                        alt="Captcha"
                                        width={105}
                                        height={45}
                                        className="p-[1px]"
                                    />
                                </div>
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center mt-4 mb-[8px]">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="h-[13px] w-[13px] rounded-sm border-gray-300 text-primary focus:ring-primary accent-primary"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#495057] select-none">
                                    Remember Me
                                </label>
                            </div>

                            {/* Login Button */}
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-[45px] bg-primary text-primary-foreground text-base font-medium rounded-[6px] hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Logging in..." : "Login"}
                                </button>
                            </div>

                            {/* Create Account Link */}
                            <p className="pt-3 text-center text-sm text-[#333333]">
                                Not a member?{' '}
                                <Link href="/register" className="text-primary ml-1">
                                    Create an Account
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
import React from 'react';

export const HeartCard = ({ children, className = '', hover = true }: { children: React.ReactNode, className?: string, hover?: boolean }) => (
    <div className={`
        bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm
        ${hover ? 'hover:shadow-xl hover:scale-[1.01] transition-all duration-300' : ''}
        ${className}
    `}>
        {children}
    </div>
);

export const HeartButton = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'outline' }) => {
    const variants = {
        primary: 'bg-[#0B5E2E] text-white hover:bg-[#094a24] shadow-lg shadow-[#0B5E2E]/20',
        secondary: 'bg-green-50 text-[#0B5E2E] hover:bg-green-100',
        outline: 'border-2 border-[#0B5E2E] text-[#0B5E2E] hover:bg-green-50',
        ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    };

    return (
        <button
            className={`
                px-6 py-3 rounded-2xl font-bold transition-all duration-300 active:scale-95
                disabled:opacity-50 disabled:pointer-events-none
                ${variants[variant]}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
};

export const HeartInput = ({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & { label?: string, error?: string }) => {
    const isTextArea = props.type === 'textarea';
    const InputComponent = (isTextArea ? 'textarea' : 'input') as any;

    return (
        <div className="space-y-1.5 flex-1">
            {label && <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>}
            <InputComponent
                className={`
                    w-full px-5 py-3 rounded-2xl bg-gray-50 border-2 border-transparent
                    focus:bg-white focus:border-[#0B5E2E]/20 focus:ring-4 focus:ring-[#0B5E2E]/5
                    outline-none transition-all duration-300 placeholder:text-gray-400
                    ${error ? 'border-red-100 bg-red-50 focus:border-red-200 focus:ring-red-100' : ''}
                `}
                {...props}
            />
            {error && <p className="text-xs text-red-500 font-medium ml-1">{error}</p>}
        </div>
    );
};

export const HeartBadge = ({ children, color = 'green', className = '' }: { children: React.ReactNode, color?: 'green' | 'blue' | 'orange', className?: string }) => {
    const colors = {
        green: 'bg-green-100 text-[#0B5E2E]',
        blue: 'bg-blue-100 text-blue-700',
        orange: 'bg-orange-100 text-orange-700',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colors[color]} ${className}`}>
            {children}
        </span>
    );
};

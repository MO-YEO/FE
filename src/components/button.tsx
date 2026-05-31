import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg'; 
  fullWidth?: boolean; 
  isLoading?: boolean; 
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyles = "flex items-center justify-center font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#5C7CFF] text-white shadow-lg shadow-blue-100 hover:bg-blue-600",
    secondary: "bg-blue-50 text-[#5C7CFF] hover:bg-blue-100",
    outline: "border-2 border-[#5C7CFF] text-[#5C7CFF] bg-white hover:bg-blue-50",
  };


  const sizes = {
    sm: "py-2 px-4 text-sm rounded-[12px]",
    md: "py-4 px-6 text-base rounded-[18px]",
    lg: "py-5 px-6 text-[18px] rounded-[20px]",
  };

  const widthStyle = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin mr-2">⏳</span> 
      ) : null}
      {children}
    </button>
  );
};

export default Button;
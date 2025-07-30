import { motion } from "framer-motion";

interface SignLanguageIconProps {
  type: "balance" | "statement" | "transfer" | "help" | "settings";
  className?: string;
}

const SignLanguageIcon = ({ type, className = "w-8 h-8" }: SignLanguageIconProps) => {
  const getSignPath = () => {
    switch (type) {
      case "balance":
        return (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Hand showing money gesture */}
            <path d="M10 2C8.9 2 8 2.9 8 4v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-8z" fill="currentColor" opacity="0.3"/>
            <circle cx="14" cy="8" r="3" fill="currentColor"/>
            <path d="M14 5v6M11 8h6" stroke="currentColor" strokeWidth="2" fill="none"/>
          </motion.g>
        );
      case "statement":
        return (
          <motion.g
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Hand pointing to list */}
            <rect x="6" y="4" width="12" height="16" rx="2" fill="currentColor" opacity="0.3"/>
            <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2"/>
            <circle cx="4" cy="8" r="2" fill="currentColor"/>
          </motion.g>
        );
      case "transfer":
        return (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Two hands exchanging */}
            <path d="M3 12l4-4 4 4M7 8v8" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M21 12l-4 4-4-4M17 16V8" stroke="currentColor" strokeWidth="2" fill="none"/>
          </motion.g>
        );
      case "help":
        return (
          <motion.g
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Question mark hand gesture */}
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.3"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
          </motion.g>
        );
      case "settings":
        return (
          <motion.g
            initial={{ opacity: 0, rotate: 45 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Gear hand gesture */}
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" 
                  stroke="currentColor" strokeWidth="2"/>
          </motion.g>
        );
      default:
        return null;
    }
  };

  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {getSignPath()}
    </svg>
  );
};

export default SignLanguageIcon;
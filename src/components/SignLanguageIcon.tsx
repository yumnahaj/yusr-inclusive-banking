import { motion } from "framer-motion";

interface SignLanguageIconProps {
  type: "balance" | "statement" | "transfer" | "help" | "settings";
  className?: string;
}

const SignLanguageIcon = ({ type, className = "w-8 h-8" }: SignLanguageIconProps) => {
  const getHandEmoji = () => {
    switch (type) {
      case "balance":
        return "✋"; // Open hand
      case "statement":
        return "👊"; // Closed fist 
      case "transfer":
        return "👉"; // Pointing right
      case "help":
        return "🤚"; // Raised hand
      case "settings":
        return "👌"; // OK gesture
      default:
        return "🤟";
    }
  };

  return (
    <div className={`flex items-center justify-center ${className} text-4xl`}>
      {getHandEmoji()}
    </div>
  );
};

export default SignLanguageIcon;
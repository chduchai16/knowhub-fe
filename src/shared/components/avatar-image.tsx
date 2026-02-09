import { useState } from "react";

const DEFAULT_AVATAR = "/assets/default-avatar.jpg";

interface AvatarImageProps {
    src?: string | null;
    alt?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function AvatarImage({ src, alt = "", size = "md", className = "" }: AvatarImageProps) {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-10 h-10",
    };

    const avatarUrl = src && !imageError ? src : DEFAULT_AVATAR;

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden relative ${className}`}>
            {imageLoading && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse" />
            )}
            <img
                src={avatarUrl}
                alt={alt}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                }}
            />
        </div>
    );
}

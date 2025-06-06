import React from 'react';
import styles from './LoadingComponent.module.css';

interface LoadingComponentProps {
  size?: number;
  speed?: number;
  showText?: boolean;
  loadingText?: string;
  animationType?: 'outline' | 'rotating' | 'pulsing';
  strokeWidth?: number;
  strokeColor?: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  size = 60,
  speed = 3000,
  showText = true,
  loadingText = "Đang tải...",
  animationType = "outline",
  strokeWidth = 2,
}) => {
  const getAnimationClass = () => {
    switch (animationType) {
      case "rotating":
        return styles.rotating;
      case "pulsing":
        return styles.pulsing;
      case "outline":
        return styles.outline;
      default:
        return "";
    }
  };

  const animationDuration = `${speed}ms`;

  const svgStyle: React.CSSProperties = {
    width: size,
    height: (size * 64) / 60,
    animationDuration: animationDuration,
  };

  if (animationType === "outline") {
    return (
      <div className={styles.container}>
        <svg
          width={size}
          height={(size * 64) / 60}
          viewBox="0 0 60 64"
          className={getAnimationClass()}
          style={svgStyle}
        >
          <defs>
            <linearGradient id="stroke_gradient_1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF33B" />
              <stop offset="0.67" stopColor="#F3903F" />
              <stop offset="0.89" stopColor="#ED683C" />
              <stop offset="1" stopColor="#FF7345" />
            </linearGradient>
            <linearGradient id="stroke_gradient_2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF33B" />
              <stop offset="0.67" stopColor="#F3903F" />
              <stop offset="0.89" stopColor="#ED683C" />
              <stop offset="1" stopColor="#FF7345" />
            </linearGradient>
            <linearGradient id="stroke_gradient_3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF33B" />
              <stop offset="0.67" stopColor="#F3903F" />
              <stop offset="0.89" stopColor="#ED683C" />
              <stop offset="1" stopColor="#FF7345" />
            </linearGradient>
            <linearGradient id="stroke_gradient_4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF33B" />
              <stop offset="0.67" stopColor="#F3903F" />
              <stop offset="0.89" stopColor="#ED683C" />
              <stop offset="1" stopColor="#FF7345" />
            </linearGradient>
            <clipPath id="clip0_181_33905">
              <path d="M0 0H60V64H0V0Z" fill="white"/>
            </clipPath>
          </defs>
          
          <g clipPath="url(#clip0_181_33905)">
            <path 
              d="M59.5 5.76333V20.5653H26.8037L19.5519 40.51L34.2732 0H53.7604C56.9281 0 59.5 2.58 59.5 5.76333Z" 
              fill="none"
              stroke="url(#stroke_gradient_1)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.path1}
              style={{ animationDuration }}
            />
            <path 
              d="M51.1369 64.0004H16.9914C16.6706 64.0004 16.3441 63.9889 16.0291 63.9659L30.5499 50.6464L30.5614 50.6579L41.5652 40.5391L51.1369 64.0004Z" 
              fill="none"
              stroke="url(#stroke_gradient_2)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.path2}
              style={{ animationDuration }}
            />
            <path 
              d="M59.4999 27.9434V58.2368C59.4999 61.4201 56.928 64.0001 53.7603 64.0001H51.1368L41.5651 40.5388H41.5766L36.9998 27.9434H59.4999Z" 
              fill="none"
              stroke="url(#stroke_gradient_3)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.path3}
              style={{ animationDuration }}
            />
            <path 
              d="M30.5499 50.6465L16.029 63.9659C7.36806 63.4718 0.5 56.2719 0.5 47.4574V22.9561L19.5518 40.5104L19.5404 40.5334L30.5499 50.6465Z" 
              fill="none"
              stroke="url(#stroke_gradient_4)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.path4}
              style={{ animationDuration }}
            />
            <path 
              d="M34.2732 0L19.5518 40.51L0.5 22.9556V16.543C0.5 7.40672 7.88359 0 16.9914 0H34.2732Z" 
              fill="none"
              stroke="url(#stroke_gradient_4)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.path5}
              style={{ animationDuration }}
            />
          </g>
        </svg>
        
        {showText && (
          <p className={styles.loadingText}>{loadingText}</p>
        )}
      </div>
    );
  }

  // For non-outline animations, keep the filled version
  return (
    <div className={styles.container}>
      <svg
        width={size}
        height={(size * 64) / 60}
        viewBox="0 0 60 64"
        className={getAnimationClass()}
        style={svgStyle}
      >
        <defs>
          <linearGradient id="paint0_linear_181_33905" x1="42.9268" y1="0" x2="42.9268" y2="40.51" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6B6B" />
            <stop offset="1" stopColor="#FF8E8E" />
          </linearGradient>
          <linearGradient id="paint1_linear_181_33905" x1="28.2957" y1="40.5391" x2="28.2957" y2="64.0004" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4ECDC4" />
            <stop offset="1" stopColor="#44B5A8" />
          </linearGradient>
          <linearGradient id="paint2_linear_181_33905" x1="50.5382" y1="27.9434" x2="50.5382" y2="64.0001" gradientUnits="userSpaceOnUse">
            <stop stopColor="#45B7D1" />
            <stop offset="1" stopColor="#2196F3" />
          </linearGradient>
          <linearGradient id="paint3_linear_181_33905" x1="15.5249" y1="22.9561" x2="15.5249" y2="63.9659" gradientUnits="userSpaceOnUse">
            <stop stopColor="#96CEB4" />
            <stop offset="1" stopColor="#5CB85C" />
          </linearGradient>
          <clipPath id="clip0_181_33905">
            <path d="M0 0H60V64H0V0Z" fill="white"/>
          </clipPath>
        </defs>
        
        <g clipPath="url(#clip0_181_33905)">
          <path d="M59.5 5.76333V20.5653H26.8037L19.5519 40.51L34.2732 0H53.7604C56.9281 0 59.5 2.58 59.5 5.76333Z" fill="url(#paint0_linear_181_33905)"/>
          <path d="M51.1369 64.0004H16.9914C16.6706 64.0004 16.3441 63.9889 16.0291 63.9659L30.5499 50.6464L30.5614 50.6579L41.5652 40.5391L51.1369 64.0004Z" fill="url(#paint1_linear_181_33905)"/>
          <path d="M59.4999 27.9434V58.2368C59.4999 61.4201 56.928 64.0001 53.7603 64.0001H51.1368L41.5651 40.5388H41.5766L36.9998 27.9434H59.4999Z" fill="url(#paint2_linear_181_33905)"/>
          <path d="M30.5499 50.6465L16.029 63.9659C7.36806 63.4718 0.5 56.2719 0.5 47.4574V22.9561L19.5518 40.5104L19.5404 40.5334L30.5499 50.6465Z" fill="url(#paint3_linear_181_33905)"/>
          <path d="M34.2732 0L19.5518 40.51L0.5 22.9556V16.543C0.5 7.40672 7.88359 0 16.9914 0H34.2732Z" fill="url(#paint3_linear_181_33905)"/>
        </g>
      </svg>
      
      {showText && (
        <p className={styles.loadingText}>{loadingText}</p>
      )}
    </div>
  );
};

export default LoadingComponent;
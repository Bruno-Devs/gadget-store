import logoPrimary from "../../asset/gadget-store-logo/logo-1-primary.png"
import logoSquare from "../../asset/gadget-store-logo/logo-2-square.png"
import logoIcon from "../../asset/gadget-store-logo/logo-icon.png"
import logoFavicon from "../../asset/gadget-store-logo/logo-favicon.png"
import logoDarkTransparent from "../../asset/gadget-store-logo/logo-dark-transparent.png"
import logoLightTransparent from "../../asset/gadget-store-logo/logo-light-transparent.png"
import logoIconDarkTransparent from "../../asset/gadget-store-logo/logo-icon-dark-transparent.png"
import logoIconLightTransparent from "../../asset/gadget-store-logo/logo-icon-light-transparent.png"

type LogoVariant = 
  | "primary" 
  | "square" 
  | "icon" 
  | "favicon"
  | "dark-transparent" 
  | "light-transparent"
  | "icon-dark-transparent"
  | "icon-light-transparent"

interface LogoProps {
  variant?: LogoVariant
  className?: string
  width?: number
  height?: number
  alt?: string
}

const LOGO_PATHS: Record<LogoVariant, string> = {
  primary: logoPrimary,
  square: logoSquare,
  icon: logoIcon,
  favicon: logoFavicon,
  "dark-transparent": logoDarkTransparent,
  "light-transparent": logoLightTransparent,
  "icon-dark-transparent": logoIconDarkTransparent,
  "icon-light-transparent": logoIconLightTransparent,
}

export function Logo({ 
  variant = "primary", 
  className = "", 
  width,
  height,
  alt = "Gadget Store"
}: LogoProps) {
  const logoSrc = LOGO_PATHS[variant]

  return (
    <img
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  )
}

// Export individual logo components for convenience
export const PrimaryLogo = (props: Omit<LogoProps, 'variant'>) => <Logo variant="primary" {...props} />
export const SquareLogo = (props: Omit<LogoProps, 'variant'>) => <Logo variant="square" {...props} />
export const IconLogo = (props: Omit<LogoProps, 'variant'>) => <Logo variant="icon" {...props} />
export const FaviconLogo = (props: Omit<LogoProps, 'variant'>) => <Logo variant="favicon" {...props} />
export const DarkTransparentLogo = (props: Omit<LogoProps, 'variant'>) => <Logo variant="dark-transparent" {...props} />
export const LightTransparentLogo = (props: Omit<LogoProps, 'variant'>) => <Logo variant="light-transparent" {...props} />
export const IconDarkTransparentLogo = (props: Omit<LogoProps, 'variant'>) => <Logo variant="icon-dark-transparent" {...props} />
export const IconLightTransparentLogo = (props: Omit<LogoProps, 'variant'>) => <Logo variant="icon-light-transparent" {...props} /> 
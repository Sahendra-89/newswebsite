import { useEffect } from 'react';

interface AdSenseProps {
    client?: string;
    slot: string;
    format?: string;
    responsive?: string;
    layoutKey?: string;
    style?: React.CSSProperties;
    className?: string;
}

const AdSense: React.FC<AdSenseProps> = ({
    client = "ca-pub-YOUR_PUBLISHER_ID", // Default placeholder
    slot,
    format = "auto",
    responsive = "true",
    layoutKey,
    style,
    className
}) => {
    useEffect(() => {
        try {
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle.push({});
        } catch (e) {
            console.error("AdSense error", e);
        }
    }, []);

    return (
        <div className={`adsense-container ${className || ''}`} style={{ overflow: 'hidden', ...style }}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
                {...(layoutKey && { 'data-ad-layout-key': layoutKey })}
            />
        </div>
    );
};

export default AdSense;

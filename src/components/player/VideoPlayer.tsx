interface EmbedPlayerProps {
  embedUrl: string;
  title?: string;
  className?: string;
}

export function EmbedPlayer({
  embedUrl,
  title,
  className = "",
}: EmbedPlayerProps) {
  return (
    <div
      className={`relative w-full aspect-video bg-black shadow-2xl shadow-black/50 ${className}`}
      style={{ isolation: "isolate" }}
    >
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-3 bg-black text-cinema-text">
        <div className="h-9 w-9 rounded-full border-2 border-cinema-accent border-t-transparent animate-spin" />
        <p className="text-sm font-body font-semibold tracking-wide">
          Starting server...
        </p>
      </div>
      <iframe
        src={embedUrl}
        title={title ?? "Video Player"}
        allowFullScreen
        // lowercase variant for older browsers / Safari
        {...({ allowfullscreen: "true" } as Record<string, string>)}
        allow="autoplay; encrypted-media; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 z-10 h-full w-full"
        style={{ border: "none" }}
      />
    </div>
  );
}

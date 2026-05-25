interface EmbedPlayerProps {
  embedUrl: string;
  title?: string;
}

export function EmbedPlayer({ embedUrl, title }: EmbedPlayerProps) {
  return (
    <div
      className="relative w-full aspect-video bg-black shadow-2xl shadow-black/50"
      style={{ isolation: "isolate" }}
    >
      <iframe
        src={embedUrl}
        title={title ?? "Video Player"}
        allowFullScreen
        // lowercase variant for older browsers / Safari
        {...({ allowfullscreen: "true" } as Record<string, string>)}
        allow="autoplay; encrypted-media; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full"
        style={{ border: "none" }}
      />
    </div>
  );
}

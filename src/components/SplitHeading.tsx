type SplitHeadingProps = {
  text: string;
  muted?: string[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  mutedOpacity?: number;
  boldClassName?: string;
};

const strip = (word: string) => word.replace(/[.,!?«»:;"'’—–-]/g, "").toLowerCase();

export default function SplitHeading({
  text,
  muted = [],
  as: Tag = "h2",
  className = "",
  mutedOpacity = 0.3,
  boldClassName = "text-espresso-900",
}: SplitHeadingProps) {
  const mutedSet = new Set(muted.map((w) => w.toLowerCase()));
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, i) => {
        const isMuted = mutedSet.has(strip(word));
        return (
          <span
            key={i}
            className={boldClassName}
            style={isMuted ? { opacity: mutedOpacity } : undefined}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </Tag>
  );
}

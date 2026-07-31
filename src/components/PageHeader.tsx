import SplitHeading from "./SplitHeading";
import FadeIn from "./FadeIn";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  muted?: string[];
  subtitle?: string;
};

export default function PageHeader({ eyebrow, title, muted = [], subtitle }: PageHeaderProps) {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-12 pt-10 text-center sm:pt-24">
      <FadeIn>
        {eyebrow && (
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-accent">{eyebrow}</p>
        )}
        <SplitHeading
          as="h1"
          text={title}
          muted={muted}
          className=""
        />
        {subtitle && <p className="mx-auto mt-6 max-w-2xl text-lg text-espresso-500">{subtitle}</p>}
      </FadeIn>
    </section>
  );
}

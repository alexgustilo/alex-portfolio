type SectionHeadingProps = {
  label: string;
  title: string;
  description: string;
};

export default function SectionHeading({
  label,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div>
      <p className="section-label">{label}</p>
      <h2 className="section-title">{title}</h2>
      <p className="section-description">{description}</p>
    </div>
  );
}

import { Crumbs } from "./ui";

export default function TextPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Crumbs items={[{ name: "Home", href: "/" }, { name: title }]} />
      <div className="wrap prose">
        <h1 style={{ marginTop: 16 }}>{title}</h1>
        {children}
      </div>
    </>
  );
}

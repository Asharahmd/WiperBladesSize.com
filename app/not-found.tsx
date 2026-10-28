import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap prose">
      <h1>Page not found</h1>
      <p>
        We don&apos;t have that page. Try the <Link href="/">vehicle finder</Link> or browse <Link href="/makes/">all makes</Link>.
      </p>
    </div>
  );
}

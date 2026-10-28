import Link from "next/link";
import { makes } from "@/lib/data";
import { SITE } from "@/lib/site";
import { IconWiper } from "./ui";

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="logo">
          <IconWiper />
          {SITE.name}
        </Link>
        <nav className="nav" aria-label="Main">
          <Link href="/makes/">All makes</Link>
          <Link href="/wiper-blade-size-chart/">Size chart</Link>
          <Link href="/connectors/">Connector types</Link>
          <Link href="/guides/">Guides</Link>
          <Link href="/methodology/">How we check sizes</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-cols">
          <div>
            <Link href="/" className="logo">
              <IconWiper />
              {SITE.name}
            </Link>
            <p>Driver, passenger and rear wiper blade sizes for US cars, trucks and SUVs, 2010 to 2026.</p>
          </div>
          <div>
            <h3>Makes</h3>
            <ul>
              {makes().slice(0, 6).map((m) => (
                <li key={m.makeSlug}>
                  <Link href={`/${m.makeSlug}/`}>{m.make}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Tools</h3>
            <ul>
              <li><Link href="/wiper-blade-size-chart/">Size chart</Link></li>
              <li><Link href="/sizes/">Cars by blade size</Link></li>
              <li><Link href="/connectors/">Connector types</Link></li>
              <li><Link href="/guides/">Guides</Link></li>
            </ul>
          </div>
          <div>
            <h3>Site</h3>
            <ul>
              <li><Link href="/about/">About</Link></li>
              <li><Link href="/methodology/">How we check sizes</Link></li>
              <li><Link href="/affiliate-disclosure/">Affiliate disclosure</Link></li>
              <li><Link href="/privacy/">Privacy</Link></li>
              <li><Link href="/contact/">Contact</Link></li>
            </ul>
          </div>
        </div>
        <p className="fine">
          As an Amazon Associate we earn from qualifying purchases. Sizes are a guide: check the blade on your car before you buy.
        </p>
      </div>
    </footer>
  );
}

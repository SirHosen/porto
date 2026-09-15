import Link from "next/link";

export default function StudyIndex() {
  return (
    <main className="study-index min-h-svh flex flex-col justify-center">
      <p className="study-kicker">Midnight Panel / Phase 1</p>
      <h1>Camera<br />study.</h1>
      <p>A path through five frames. Placeholder geometry only.</p>
      <Link className="study-link" href="/prototype/">Enter the prototype <span aria-hidden="true">↗</span></Link>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Luna Art Studio",
  description: "Terms and Conditions for Luna Art Studio, including SMS messaging terms.",
};

export default function TermsPage() {
  return (
    <article className="bg-white px-6 pb-24 pt-36 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent-warm">
          Legal
        </p>
        <h1 className="mt-5 font-display text-5xl font-light text-gray-darkest md:text-6xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-4 font-body text-sm font-light text-gray-dark">
          Effective October 14, 2026
        </p>

        <div className="mt-12 space-y-10 font-body text-base font-light leading-8 text-gray-dark">
          <section>
            <h2 className="font-display text-3xl text-gray-darkest">General terms</h2>
            <p className="mt-3">
              By using lunaart.studio, contacting Luna Art Studio, or registering for studio
              services, you agree to these Terms &amp; Conditions. Class schedules, availability,
              instructors, and policies may change. Additional registration, payment, cancellation,
              or studio rules presented at enrollment also apply.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-gray-darkest">SMS Terms</h2>
            <p className="mt-3">
              By checking the SMS consent box on our website or otherwise giving documented consent,
              you agree to receive customer-care text messages from Luna Art Studio at the mobile
              number you provide. Messages may include inquiry responses, appointment or class
              reminders, registration confirmations, schedule changes, and service updates.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Message frequency varies based on your interactions with the studio.</li>
              <li>Message and data rates may apply.</li>
              <li>Consent is not a condition of purchase.</li>
              <li>Reply STOP to unsubscribe at any time.</li>
              <li>Reply HELP for help or email Ninglu1088@gmail.com.</li>
              <li>Carriers are not liable for delayed or undelivered messages.</li>
            </ul>
            <p className="mt-4">
              After you text STOP, we may send one final confirmation message. You may opt in again
              through the same consent process. For information about how we handle personal and SMS
              data, review our <Link className="text-accent-warm underline" href="/privacy">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-gray-darkest">Acceptable use</h2>
            <p className="mt-3">
              You may not misuse the website, interfere with its operation, submit unlawful or
              harmful content, impersonate another person, or attempt unauthorized access to our
              systems or records.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-gray-darkest">Limitation and changes</h2>
            <p className="mt-3">
              The website is provided on an as-available basis. To the extent permitted by law,
              Luna Art Studio is not liable for indirect or consequential losses arising from use of
              the website or messaging program. We may update these terms by posting a revised
              effective date on this page.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-gray-darkest">Contact</h2>
            <p className="mt-3">
              Questions about these terms may be sent to Ninglu1088@gmail.com or Luna Art Studio,
              258 King George Rd, 2nd Floor, Warren, NJ 07059.
            </p>
          </section>
        </div>

        <Link className="mt-14 inline-block font-mono text-xs uppercase tracking-widest text-accent-warm" href="/">
          Back to Luna Art Studio →
        </Link>
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Luna Art Studio",
  description: "Privacy Policy for Luna Art Studio, including SMS messaging privacy practices.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="bg-white px-6 pb-24 pt-36 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent-warm">
          Legal
        </p>
        <h1 className="mt-5 font-display text-5xl font-light text-gray-darkest md:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-4 font-body text-sm font-light text-gray-dark">
          Effective October 14, 2026
        </p>

        <div className="mt-12 space-y-10 font-body text-base font-light leading-8 text-gray-dark">
          <section>
            <h2 className="font-display text-3xl text-gray-darkest">Overview</h2>
            <p className="mt-3">
              Luna Art Studio respects your privacy. This policy explains how we collect, use,
              disclose, and protect information when you visit lunaart.studio, register for a
              class, contact the studio, or choose to receive text messages from us.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-gray-darkest">Information we collect</h2>
            <p className="mt-3">
              We may collect your name, email address, phone number, class interests, registration
              information, messages you send us, transaction details, and basic website usage data.
              For children&apos;s classes, a parent or guardian should provide the registration and
              contact information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-gray-darkest">How we use information</h2>
            <p className="mt-3">
              We use information to answer inquiries, manage registrations, provide classes and
              studio services, process payments, send requested service updates and reminders,
              maintain safety and records, improve our website, and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-gray-darkest">SMS privacy</h2>
            <p className="mt-3">
              If you separately opt in to SMS, Luna Art Studio may send customer-care messages such
              as inquiry responses, appointment or class reminders, registration confirmations,
              schedule changes, and service updates. Consent to receive SMS is not a condition of
              purchase. Message frequency varies. Message and data rates may apply. Reply STOP to
              opt out or HELP for help.
            </p>
            <p className="mt-3 font-medium text-gray-darkest">
              We do not sell or share your SMS opt-in data, consent, or personal information with
              third parties for marketing or promotional purposes.
            </p>
            <p className="mt-3">
              We may share information with service providers that help us deliver messages and
              operate our business, solely as needed to provide those services and subject to
              appropriate confidentiality and data-protection obligations.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-gray-darkest">Data choices and security</h2>
            <p className="mt-3">
              You may ask us to access, correct, or delete your personal information, subject to
              legal recordkeeping requirements. We use reasonable administrative and technical
              safeguards, but no method of online transmission or storage is completely secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-gray-darkest">Contact us</h2>
            <p className="mt-3">
              Luna Art Studio<br />
              258 King George Rd, 2nd Floor<br />
              Warren, NJ 07059<br />
              Email: <a className="text-accent-warm underline" href="mailto:Ninglu1088@gmail.com">Ninglu1088@gmail.com</a><br />
              Phone: <a className="text-accent-warm underline" href="tel:+17327180639">+1 732-718-0639</a>
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

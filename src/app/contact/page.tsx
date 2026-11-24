export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-emerald-950">Contact Us</h1>
      <p className="mt-4 max-w-2xl text-stone-600">
        Questions about coaching, plans or products? Get in touch and we will
        reply as soon as we can.
      </p>

      <dl className="mt-8 space-y-4">
        <div>
          <dt className="font-semibold text-emerald-950">Email</dt>
          <dd className="text-stone-600">
            {/* TODO: replace with the real email address */}
            hello@example.com
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-emerald-950">Phone</dt>
          <dd className="text-stone-600">
            {/* TODO: replace with the real phone number */}
            +000 000 000 0000
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-emerald-950">Address</dt>
          <dd className="text-stone-600">
            {/* TODO: replace with the real address */}
            Street, City, Country
          </dd>
        </div>
      </dl>
    </main>
  )
}
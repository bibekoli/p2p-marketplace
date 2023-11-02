export default function FAQ() {
  return (
    <div className="max-w-screen-xl mx-auto mt-[80px] p-4">
      <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
      <main className="leading-8 mt-8">
        <div className="mt-2 space-y-8">
          <div className="border-b pb-2">
            <h3 className="text-xl font-semibold">What is BechnuParyo?</h3>
            <p className="text-gray-700">BechnuParyo is a peer-to-peer marketplace where individuals can buy and sell items directly with each other, without the involvement of a third party.</p>
          </div>
          <div className="border-b pb-2">
            <h3 className="text-xl font-semibold">How can I get started?</h3>
            <p className="text-gray-700">To get started, create an account, list your items for sale, or start browsing to make a purchase. It&apos;s that simple!</p>
          </div>
          <div className="border-b pb-2">
            <h3 className="text-xl font-semibold">Is BechnuParyo free to use?</h3>
            <p className="text-gray-700">Yes, BechnuParyo is free to use. We do not charge any listing fees or commissions.</p>
          </div>
        </div>  
      </main>
    </div>
  );
}
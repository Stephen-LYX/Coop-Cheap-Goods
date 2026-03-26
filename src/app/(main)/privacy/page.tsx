import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex justify-center px-6 py-12">
      <div className="max-w-3xl bg-white rounded-2xl shadow-lg p-8 prose prose-gray">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: March 25, 2026</p>

        <h2>1. About Coop</h2>
        <p>
          Coop is a community marketplace platform that allows users to list, browse, and
          purchase second-hand goods within local communities. This project is a student
          capstone project and is not a commercial product.
        </p>

        <h2>2. Information We Collect</h2>
        <p>When you create an account and use Coop, we may collect the following:</p>
        <ul>
          <li><strong>Account information:</strong> your email address and username</li>
          <li><strong>Profile information:</strong> display name, bio, location, and profile photo (optional)</li>
          <li><strong>Listing content:</strong> item titles, descriptions, prices, and uploaded images</li>
          <li><strong>Messages:</strong> conversations between buyers and sellers (encrypted in transit)</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information collected to:</p>
        <ul>
          <li>Provide and operate the Coop platform</li>
          <li>Display your listings and profile to other users</li>
          <li>Enable messaging between buyers and sellers</li>
          <li>Maintain and improve the platform</li>
        </ul>

        <h2>4. Data Storage</h2>
        <p>
          User data, including account information, listings, and uploaded images, is stored
          securely using <strong>Supabase</strong>, a third-party backend platform. Data is
          stored on Supabase-managed servers. For more information on Supabase's data
          practices, visit{" "}
          <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
            supabase.com/privacy
          </a>
          .
        </p>

        <h2>5. Data Sharing</h2>
        <p>
          We do not sell or share your personal information with third parties for marketing
          purposes. Your public profile and listings are visible to other logged-in users of
          the platform.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          You may request to have your account and associated data deleted at any time by
          contacting us at the email below. You can also edit or remove your listings and
          profile information at any time from within the app.
        </p>

        <h2>7. Contact</h2>
        <p>
          If you have any questions or concerns about this privacy policy, please contact us
          at:{" "}
          <a href="mailto:coopcheapgoods@gmail.com">coopcheapgoods@gmail.com</a>
        </p>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

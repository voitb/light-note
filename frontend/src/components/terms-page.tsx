export function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using LightNote, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
          <p className="text-muted-foreground">
            LightNote is a lightweight Progressive Web Application (PWA) for Markdown-based note-taking with integrated local AI assistance. The service may include free and paid subscription tiers with different feature sets.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">3. User Data and Privacy</h2>
          <p className="text-muted-foreground">
            We prioritize your privacy. Your notes and data created with LightNote are stored securely and are not accessed, analyzed, or shared with third parties. The AI features run locally in your browser, meaning your content never leaves your device for AI processing unless you explicitly choose to use cloud-based features.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">4. User Accounts</h2>
          <p className="text-muted-foreground">
            Some features of LightNote may require you to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">5. Subscription Terms</h2>
          <p className="text-muted-foreground">
            Paid subscriptions are billed according to the plan you select. You can cancel your subscription at any time. Refunds are handled according to our refund policy, which can be requested by contacting our support team.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">6. Limitations of Liability</h2>
          <p className="text-muted-foreground">
            LightNote is provided "as is" without any warranties. We do not guarantee that the service will be uninterrupted or error-free. We are not responsible for any loss of data or any indirect, consequential, or incidental damages.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We may update these terms from time to time. We will notify users of significant changes to our terms by posting a notice on our website or by sending an email.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms of Service, please contact us at support@lightnote.app
          </p>
        </section>
      </div>
    </div>
  )
} 
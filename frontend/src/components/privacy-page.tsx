export function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-muted-foreground">
            At LightNote, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our application.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">2. Local-First Architecture</h2>
          <p className="text-muted-foreground">
            LightNote is built on a local-first architecture. This means that your notes and data are primarily stored on your device. We do not have access to the content of your notes unless you explicitly choose to sync them to our servers.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">3. Data Collection</h2>
          <p className="text-muted-foreground">
            We collect minimal data necessary for the operation of the service:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1 text-muted-foreground">
            <li>Account information (email, hashed password) for users who create accounts</li>
            <li>Usage analytics to improve our service (anonymous and aggregated)</li>
            <li>Technical information such as browser type and device information</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            We do not collect or analyze the content of your notes.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">4. AI Features</h2>
          <p className="text-muted-foreground">
            LightNote includes AI assistance features that run completely in your browser using WebLLM technology. This means that when you use these AI features, your content is processed locally on your device and is not sent to our servers or any third-party servers.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
          <p className="text-muted-foreground">
            For users who choose to sync their data across devices, we implement end-to-end encryption to ensure that only you can access your notes. Your encryption keys are never stored on our servers in an unencrypted format.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">6. Data Sharing</h2>
          <p className="text-muted-foreground">
            We do not sell, rent, or share your personal information with third parties except as necessary to provide the service or as required by law.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">7. Cookies and Local Storage</h2>
          <p className="text-muted-foreground">
            We use cookies and local storage to improve your experience, remember your preferences, and provide the services you request. You can control or delete these through your browser settings.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">8. Your Rights</h2>
          <p className="text-muted-foreground">
            You have the right to access, correct, or delete your personal information. You can export your data at any time and delete your account if desired.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">9. Changes to Privacy Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify users of significant changes by posting a notice on our website or by sending an email.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at privacy@lightnote.app
          </p>
        </section>
      </div>
    </div>
  )
} 
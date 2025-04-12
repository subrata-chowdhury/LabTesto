import React from 'react'

function page() {
    return (
        <div className="p-6 px-8 md:px-12 bg-gray-50 dark:bg-[#0A192F] text-gray-800 scroll-smooth dark:text-gray-300">
            <PrivacyPolicy />
            <CookiePolicy />
            <RefundAndCancellationPolicy />
        </div>
    )
}

export default page;

function PrivacyPolicy() {
    return (
        <section id='privacy_policy'>
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
            <p className="mb-4">
                This Privacy Policy outlines how we collect, use, disclose, store, and safeguard your personal information when you visit or use our Platform. By accessing or using our services, you agree to the terms outlined herein.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. Information We Collect</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">2.1. Personal Information</h3>
            <p className="mb-4">
                We may collect personal information directly from you when you create an account, place an order, or submit details through forms. This includes but is not limited to:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>Full name</li>
                <li>Contact number</li>
                <li>Email address</li>
                <li>Address(es)</li>
                <li>Patient details (name, age, gender, relationship)</li>
                <li>Date of birth</li>
                <li>Health-related information (only relevant to diagnostics)</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">2.2. Non-Personal Information</h3>
            <p className="mb-4">
                We also collect non - identifiable information such as browser type, device information, location(if enabled), IP address, access times, and browsing patterns.
            </p >

            <h3 className="text-lg font-medium mt-4 mb-2">2.3. Cookies & Tracking</h3>
            <p className="mb-4">
                As explained in our <a href="#cookie_policy" className="text-blue-500"> Cookie Policy</a>, we use cookies and similar technologies to enhance user experience, improve performance, and conduct analytics.
            </p >

            <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information for the following purposes:</p>
            <ul className="list-disc list-inside mb-4">
                <li>To provide and manage diagnostic services</li>
                <li>To process bookings, payments, and refunds</li>
                <li>To facilitate sample collection and communicate test-related details</li>
                <li>To store patient and order history for your convenience</li>
                <li>To ensure data security and account protection</li>
                <li>To offer customer support</li>
                <li>To send transactional emails and, where permitted, marketing messages</li>
                <li>To comply with legal obligations</li>
            </ul >

            <h2 className="text-xl font-semibold mt-6 mb-2">4. Sharing of Information</h2>
            <p className="mb-4">We may share your data under the following conditions:</p>
            <ul className="list-disc list-inside mb-4">
                <li>With NABL-certified labs and certified collectors for test fulfillment</li>
                <li>With payment processors for transaction validation</li>
                <li>With IT service providers to maintain platform functionality</li>
                <li>With government or legal authorities if required by law</li>
                <li>With your explicit consent for specific third-party services</li>
            </ul >
            <p className="mb-4">We do not sell, rent, or trade your personal information to any entity for commercial use.</p>

            <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Storage and Security</h2>
            <ul className="list-disc list-inside mb-4">
                <li>All personal data is stored on secure servers with appropriate access controls and encryption mechanisms.</li>
                <li>User data is isolated per account to ensure strict separation.</li>
                <li>We implement technical and organizational measures to prevent unauthorized access, loss, or misuse of your data.</li>
                <li>Passwords are stored in encrypted form and cannot be retrieved in plain text.</li>
            </ul >

            <h2 className="text-xl font-semibold mt-6 mb-2">6. User Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside mb-4">
                <li>Access your personal information</li>
                <li>Update or correct inaccuracies in your profile</li>
                <li>Delete your account (subject to legal and transactional retention requirements)</li>
                <li>Opt out of marketing communications</li>
                <li>Withdraw consent for non-essential data processing</li>
                <li>File a complaint with a relevant authority if you feel your data is mishandled</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">7. Retention Policy</h2>
            <p className="mb-4">
                We retain user data only for as long as it is necessary to fulfill the purposes outlined in this policy and to comply with legal, regulatory, or tax requirements.Data related to completed orders may be retained for compliance and support purposes.
            </p >

            <h2 className="text-xl font-semibold mt-6 mb-2">8. Data Transfers</h2>
            <p className="mb-4">
                If we store or process your data outside your country of residence, we ensure that appropriate data protection measures are in place in accordance with applicable law.
            </p >

            <h2 className="text-xl font-semibold mt-6 mb-2">9. Changes to This Privacy Policy</h2>
            <p className="mb-4">
                We reserve the right to update this policy at any time.Significant changes will be communicated via email or through prominent notices on the Platform.Continued use of the Platform following any updates constitutes acceptance of the revised policy.
            </p >

            <h2 className="text-xl font-semibold mt-6 mb-2">10. Contact Information</h2>
            <p className="mb-4">
                If you have questions or concerns regarding this Privacy Policy or your data, please contact our Data Protection Officer or use the contact form on our platform.
            </p >
        </section>
    )
}

function CookiePolicy() {
    return (
        <section id='cookie_policy'>
            <h1 className="text-3xl font-bold mt-12 mb-4">Cookie Policy</h1>
            <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
            <p className="mb-4">
                This Cookie Policy explains how our platform uses cookies and similar technologies to recognize you when you visit our website or mobile application.It outlines what these technologies are, why we use them, and your rights to control their usage.
            </p >

            <h2 className="text-xl font-semibold mt-6 mb-2">2. What Are Cookies?</h2>
            <p className="mb-4">
                Cookies are small data files stored on your device(computer, tablet, smartphone, etc.) when you visit a website.They help websites function more efficiently, enhance user experience, and provide information to the website operators.
            </p >

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Types of Cookies Used</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">3.1. Strictly Necessary Cookies</h3>
            <p className="mb-4">
                These cookies are essential for the website to function properly. They enable basic features like page navigation, secure login, and form submissions.
            </p >

            <h3 className="text-lg font-medium mt-4 mb-2">3.2. Performance Cookies</h3>
            <p className="mb-4">
                These cookies collect anonymous data on how users interact with the platform—such as pages visited and error messages—so we can improve the site's performance.
            </p >

            <h3 className="text-lg font-medium mt-4 mb-2">3.3. Functionality Cookies</h3>
            <p className="mb-4">
                These cookies remember choices you make(such as preferred language, location, or patient details) to offer personalized features and a smoother experience.
            </p >

            <h3 className="text-lg font-medium mt-4 mb-2">3.4. Targeting/Advertising Cookies</h3>
            <p className="mb-4">
                These cookies may be set through our site by third - party partners to build a profile of your interests and show you relevant ads on other websites.
            </p >

            <h2 className="text-xl font-semibold mt-6 mb-2">4. Why We Use Cookies</h2>
            <p className="mb-4">We use cookies to:</p>
            <ul className="list-disc list-inside mb-4">
                <li>Ensure smooth navigation and functionality</li>
                <li>Analyze user behavior to improve services</li>
                <li>Store user preferences for quicker access</li>
                <li>Secure user sessions and prevent unauthorized access</li>
                <li>Enable remarketing and advertising efforts (where applicable)</li>
            </ul >

            <h2 className="text-xl font-semibold mt-6 mb-2">5. Managing Cookies</h2>
            <p className="mb-4">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>View and delete stored cookies</li>
                <li>Block third-party cookies</li>
                <li>Set preferences for specific websites</li>
            </ul>
            <p className="mb-4">
                Disabling cookies may limit your ability to use certain features of the platform.
            </p >

            <h2 className="text-xl font-semibold mt-6 mb-2">6. Third-Party Cookies</h2>
            <p className="mb-4">
                We may allow selected third parties to place cookies on your device to provide analytics or ads. These cookies are subject to the respective third party’s privacy policies and not governed by this Cookie Policy.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">7. Updates to This Policy</h2>
            <p className="mb-4">
                This Cookie Policy may be updated occasionally to reflect changes in technology, law, or our services. Users are advised to revisit this page periodically to stay informed.
            </p>
        </section>
    )
}

function RefundAndCancellationPolicy() {
    return (
        <section id='refund_policy'>
            <h1 className="text-3xl font-bold mt-12 mb-4">Refund & Cancellation Policy</h1>
            <h2 className="text-xl font-semibold mt-6 mb-2">1. Cancellations</h2>
            <ul className="list-disc list-inside mb-4">
                <li>Users may cancel a booked test at any time before the sample collection is initiated.</li>
                <li>Cancellations must be submitted through the user dashboard or customer support channel.</li>
                <li>Once the assigned collector has been dispatched or arrived for collection, the order will be considered “in progress” and cancellation may not be accepted.</li>
                <li>The Company reserves the right to cancel an order due to operational constraints, non-availability of the lab or collector, or in case of any violation of Terms.</li>
            </ul >

            <h2 className="text-xl font-semibold mt-6 mb-2">2. Refunds</h2>
            <ul className="list-disc list-inside mb-4">
                <li>For valid cancellations made before sample collection, a full refund will be processed using the original mode of payment.</li>
                <li>If the order was paid via Cash on Delivery, no charges will be levied if canceled before collection.</li>
                <li>Refunds for prepaid tests canceled after collection (due to lab rejection, technical issues, or force majeure) will be initiated within 5-7 business days.</li>
                <li>Partial refunds may be considered in cases where one or more tests in a combined order cannot be fulfilled.</li>
                <li>No refunds shall be issued for user-initiated cancellations made after sample collection or for missed appointments caused by unavailability of the patient at the scheduled time.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Refund Method</h2>
            <ul className="list-disc list-inside mb-4">
                <li>Refunds will be processed through the original payment gateway to the account or card used during the transaction.</li>
                <li>In the event of payment failure or technical error, the refund may be re-issued manually after validation.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">4. Dispute Resolution</h2>
            <ul className="list-disc list-inside mb-4">
                <li>Users may raise disputes related to payments or refunds via the contact form or support email.</li>
                <li>All disputes must be submitted within 7 calendar days of the issue, accompanied by the booking ID and relevant details.</li>
            </ul>
        </section>
    )
}
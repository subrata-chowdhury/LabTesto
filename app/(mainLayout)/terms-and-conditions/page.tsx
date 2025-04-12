import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div className="p-6 px-8 md:px-12 bg-gray-50 dark:bg-[#0A192F] text-gray-800 scroll-smooth dark:text-gray-300">
            <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Last Updated: <span className="font-medium">12/4/2025 at 10:00am</span></p>

            <p className="mb-4">
                Welcome to our platform (<span className="italic">&quot;Platform&quot;, &quot;Service&quot;, &quot;Website&quot;</span>). Please read these Terms and Conditions (<span className="italic">&quot;Terms&quot;, &quot;Agreement&quot;</span>) carefully before accessing, using, or registering on the website. By using this Platform, you (<span className="italic">&quot;User&quot;, &quot;You&quot;, &quot;Your&quot;</span>) agree to be legally bound by these Terms, which govern your access and use of all features, functionalities, services, and tools provided on the Platform.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
            <ul className="list-disc list-inside mb-4">
                <li>By visiting, browsing, or using this Platform in any way, you agree to these Terms in full. If you disagree with any part of the Terms, you must not use the Platform.</li>
                <li>These Terms apply to all users, including but not limited to visitors, registered users, customers, labs, healthcare professionals, and any other individuals or entities who access or use the Service.</li>
                <li>The Company reserves the right to modify, change, or update these Terms at its sole discretion without prior notice. Continued use of the Platform after changes constitutes acceptance of those changes.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. Eligibility</h2>
            <ul className="list-disc list-inside mb-4">
                <li>You must be at least 18 years of age to register or use the Platform. By agreeing to these Terms, you warrant and represent that you are at least 18 years old.</li>
                <li>If you are accessing the Platform on behalf of another individual or entity, you confirm that you are authorized to bind them to these Terms.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Platform Overview</h2>
            <ul className="list-disc list-inside mb-4">
                <li>Search and explore various medical diagnostic tests without requiring an account.</li>
                <li>Access information about available labs, including pricing, locations, and test availability.</li>
                <li>Register for an account to book medical tests, manage patient information, schedule sample collections, and view reports.</li>
                <li>Choose a preferred diagnostic laboratory based on availability, budget, or location.</li>
                <li>Store multiple addresses and patient profiles for repeated or future use.</li>
                <li>Reset passwords and update account-related information.</li>
                <li>Contact support through an embedded contact form.</li>
            </ul>
            <p className="mb-4">
                The Platform is not a substitute for professional medical advice. Users are advised to consult licensed healthcare providers for medical interpretation and follow-up treatment.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">4. Account Registration and Responsibilities</h2>
            <ul className="list-disc list-inside mb-4">
                <li>To access certain features of the Platform, you may be required to create an account by providing your name, contact information, password, and other required details.</li>
                <li>You agree to provide accurate, current, and complete information during registration and to keep this information up-to-date at all times.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials and are fully responsible for all activities that occur under your account.</li>
                <li>You agree to immediately notify the Company of any unauthorized use or suspected breach of your account.</li>
                <li>The Company shall not be liable for any loss or damage arising from your failure to comply with these obligations.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">5. Test Booking, Order Placement, and Cancellations</h2>
            <ul className="list-disc list-inside mb-4">
                <li>Registered users may place orders for diagnostic tests offered by certified labs available on the Platform.</li>
                <li>By placing an order, you authorize the Platform to share necessary personal and medical data with the selected lab for the purpose of fulfilling the order.</li>
                <li>Orders can be canceled by the user only if the sample collection has not been initiated. Once the phlebotomist is en route or collection has begun, cancellation may not be permitted.</li>
                <li>Refunds for canceled orders, if applicable, will be processed as per the Refund and Cancellation Policy outlined separately.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">6. Payment Terms and Transactions</h2>
            <ul className="list-disc list-inside mb-4">
                <li>The Platform supports multiple payment methods including, but not limited to, digital payments, UPI, debit/credit cards, and Cash on Delivery (COD), subject to availability in your location.</li>
                <li>When choosing COD, payment must be made in full to the authorized phlebotomist at the time of sample collection.</li>
                <li>The Company reserves the right to revise prices at any time without prior notice. However, once a test is booked and confirmed, the price applicable at the time of booking shall remain unchanged for that order.</li>
                <li>Any disputes regarding charges or transactions must be reported within 48 hours of the transaction date. The Company reserves the right to refuse claims made after this period.</li>
                <li>Taxes, if applicable, will be added to the final bill amount as per statutory requirements and are the responsibility of the user.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">7. Data Privacy and Confidentiality</h2>
            <ul className="list-disc list-inside mb-4">
                <li>The Platform takes data security and user privacy seriously. All personal data, including health records, patient details, contact information, and test results, are securely stored and transmitted using industry-standard encryption technologies.</li>
                <li>User data will never be sold, leased, or distributed to third parties for marketing purposes. Data may be shared with partner labs solely for the fulfillment of services and in compliance with applicable laws.</li>
                <li>Each user’s data is uniquely encrypted and isolated. No user shall have access to another user’s data under any circumstance.</li>
                <li>By using the Platform, you consent to the collection, processing, and storage of your information in accordance with our <Link href={'/privacy-policy#privacy_policys'} className="text-blue-500">[Privacy Policy]</Link>.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">8. Cookie Usage and Tracking Technologies</h2>
            <ul className="list-disc list-inside mb-4">
                <li>This Platform uses cookies and similar technologies to enhance your browsing experience, analyze traffic patterns, personalize content, and remember your preferences.</li>
                <li>Cookies may include strictly necessary cookies, performance cookies, functionality cookies, and targeting cookies.</li>
                <li>By continuing to use this Platform, you acknowledge and consent to our use of cookies as described in our <Link href={'/privacy-policy#cookie_policy'} className="text-blue-500">[Cookie Policy]</Link>. You may choose to disable cookies via your browser settings, but this may impact the functionality of the Platform.</li>
                <li>Third-party analytics services may also be used to understand user behavior. These services may collect anonymous data and use cookies to track aggregated usage information.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">9. User Reviews and Feedback</h2>
            <ul className="list-disc list-inside mb-4">
                <li>After the full completion of an order—including sample collection, processing, and report delivery—users are permitted to leave a review regarding the services received.</li>
                <li>Reviews must be honest, respectful, and must not contain offensive, abusive, defamatory, or misleading content.</li>
                <li>The Company reserves the right to moderate, remove, or refuse to publish any review that violates these guidelines or applicable laws.</li>
                <li>By submitting a review, you grant the Company a perpetual, irrevocable, royalty-free license to publish, display, and use the review on the Platform or for marketing purposes.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">10. User Conduct and Responsibilities</h2>
            <ul className="list-disc list-inside mb-4">
                <li>Users agree to use the Platform for lawful purposes only and shall not engage in any activity that interferes with or disrupts the Platform&apos;s functionality.</li>
                <li>You may not misuse the Platform by knowingly introducing viruses, Trojans, worms, or other malicious software.</li>
                <li>Any form of attempted unauthorized access to other user accounts, lab data, or backend systems will be considered a criminal offense and may lead to legal action.</li>
                <li>Any attempt to copy, reproduce, distribute, or exploit Platform content for commercial purposes without written consent from the Company is strictly prohibited.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">11. Intellectual Property Rights</h2>
            <ul className="list-disc list-inside mb-4">
                <li>All content on the Platform, including but not limited to text, graphics, user interfaces, visual interfaces, photographs, logos, trademarks, sounds, music, artwork, computer code, and design, is the exclusive property of the Company or its licensors.</li>
                <li>The structure, design, compilation, and arrangement of such content are protected by intellectual property laws and may not be copied, imitated, modified, or used without express written permission.</li>
                <li>You are granted a limited, non-exclusive, non-transferable license to access and use the Platform solely for personal, non-commercial purposes in accordance with these Terms.</li>
                <li>Any unauthorized use, reproduction, or distribution of Platform content may result in civil or criminal penalties and immediate termination of your access.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">12. Limitation of Liability</h2>
            <ul className="list-disc list-inside mb-4">
                <li>To the fullest extent permitted by applicable law, the Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from:</li>
                <ul className="list-disc list-inside ml-6">
                    <li>Your use of or inability to use the Platform</li>
                    <li>Delays or disruptions in service</li>
                    <li>Errors, inaccuracies, or omissions in content</li>
                    <li>Unauthorized access to or use of our servers and/or personal information</li>
                    <li>Any malware, viruses, or harmful code transmitted through the Platform</li>
                </ul>
                <li>The Company provides all services on an &quot;as-is&quot; and &quot;as-available&quot; basis. No warranties, either express or implied, are made regarding the reliability, availability, accuracy, or completeness of the Platform or services.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">13. Termination of Access</h2>
            <ul className="list-disc list-inside mb-4">
                <li>The Company reserves the right to suspend or terminate your access to the Platform, without notice or liability, for any reason including, but not limited to:</li>
                <ul className="list-disc list-inside ml-6">
                    <li>Breach of these Terms</li>
                    <li>Providing false or misleading information</li>
                    <li>Engaging in fraudulent or unlawful activity</li>
                    <li>Misuse of Platform features or data</li>
                </ul>
                <li>Upon termination, your right to use the Platform will immediately cease. Any provisions of these Terms that by their nature should survive termination shall remain in full force and effect.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">14. Governing Law and Jurisdiction</h2>
            <ul className="list-disc list-inside mb-4">
                <li>These Terms shall be governed and construed in accordance with the laws of <span className="font-medium">[The Republic of India]</span>, without regard to its conflict of law provisions.</li>
                <li>You agree to submit to the exclusive jurisdiction of the courts located in <span className="font-medium">[Mumbai, Maharashtra]</span> for the resolution of any disputes arising out of or relating to these Terms or your use of the Platform.</li>
                <li>Any claim or cause of action arising from or related to the use of the Platform must be filed within one (1) year after such claim or cause of action arose or be forever barred.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">15. Force Majeure</h2>
            <ul className="list-disc list-inside mb-4">
                <li>The Company shall not be held liable for any delay or failure in performance resulting from causes beyond its reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, civil unrest, government actions, labor shortages, power failures, internet outages, or pandemics.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">16. Miscellaneous Provisions</h2>
            <ul className="list-disc list-inside mb-4">
                <li>If any provision of these Terms is held to be invalid or unenforceable under applicable law, the remaining provisions shall continue in full force and effect.</li>
                <li>The failure of the Company to enforce any right or provision under these Terms shall not constitute a waiver of such right or provision.</li>
                <li>These Terms constitute the entire agreement between you and the Company regarding your use of the Platform, superseding any prior agreements, communications, or understandings.</li>
                <li>Any headings used in this document are for convenience only and shall not affect the meaning or interpretation of any section.</li>
            </ul>
        </div>
    )
}

export default page
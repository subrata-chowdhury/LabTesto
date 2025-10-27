import Minus from '@/assets/reactIcon/Minus';
import Plus from '@/assets/reactIcon/Plus';
import React from 'react'

const page = () => {
    return (
        <div className='px-5 py-6 flex flex-col gap-4 bg-gray-50 dark:bg-[#0A192F]'>
            <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-center mx-auto mt-4">Frequently Asked Questions</h1>
                <div className="w-20 h-1 rounded-full mx-auto bg-black/20 dark:bg-white/30 my-3"></div>
            </div>

            <DetailCardToggler
                title='1. What types of diagnostic tests can I book on the platform?'
                description='We offer a wide range of diagnostic tests, from basic tests like Complete Blood Count (CBC) to more advanced tests such as genetic testing, imaging, and specialized blood tests. You can search for tests directly on our platform and view available options.' />
            <DetailCardToggler
                title='2. Do I need to create an account to book a test?'
                description='No, you can search and view test details without logging in. However, to place an order, manage multiple patient profiles, or track your test results, you will need to sign up for an account.' />
            <DetailCardToggler
                title='3. How do I choose the lab for my test?'
                description='Once you select a test, you will be presented with a list of available labs for that particular test. You can choose any lab based on your preferences for location, pricing, or any other factors.' />
            <DetailCardToggler
                title='4. Is the sample collection service available at my location?'
                description='We offer home sample collection services in various locations. To check if we operate in your area, enter your address during the booking process, and the platform will show available options for home collection.' />
            <DetailCardToggler
                title='5. Can I change my lab or test selection after booking?'
                description='Once you place an order, the lab selection cannot be changed. However, if the order has not yet been processed or the sample collected, you can cancel your order and place a new one with your preferred lab or test.' />
            <DetailCardToggler
                title='6. Can I cancel my test after placing an order?'
                description='You can cancel your order at any time before the sample collection is initiated. If the collector has already been dispatched or arrived at your location, cancellations may not be possible.' />
            <DetailCardToggler
                title='7. How do I pay for my tests?'
                description='We offer multiple payment methods, including Cash on Delivery (COD), debit/credit cards, and online payment methods. You can choose your preferred payment method when confirming your order.' />
            <DetailCardToggler
                title='8. Can I pay using Cash on Delivery (COD)?'
                description='Yes, we offer the Cash on Delivery option. You can pay for your selected tests in cash when the sample collector arrives at your location for sample collection.' />
            <DetailCardToggler
                title='9. How will I receive my test results?'
                description='Test results are delivered securely through our platform. Once your tests are completed and verified by the lab, you will receive a notification, and you can view the results in your account dashboard.' />
            <DetailCardToggler
                title='10. Is my personal and health information secure on this platform?'
                description='Yes, we take data privacy and security seriously. We use encryption and other security measures to protect your personal and health-related information. Your data will never be shared with third parties without your consent, except as required for service fulfillment or by law.' />
            <DetailCardToggler
                title='11. Can I leave a review for the lab or service?'
                description='Yes, once your test procedure is complete, you can leave a review for the service, sample collection experience, or the lab. Your feedback helps us improve our services.' />
            <DetailCardToggler
                title='12. How do I contact customer support?'
                description='If you have any questions or need assistance, you can contact our customer support team through the contact form on the platform or via the provided support email.' />
            <DetailCardToggler
                title='13. Can I store multiple patient profiles?'
                description='Yes, you can store multiple patient details in your account to easily manage orders for family members or others. This makes it convenient to order tests for different individuals without re-entering details each time.' />
            <DetailCardToggler
                title='14. How can I reset my password if I forget it?'
                description='If you forget your password, simply click on the “Forgot Password” link on the login page. You will be asked to provide your registered email address, and we will send you instructions to reset your password.' />
            <DetailCardToggler
                title='15. How do I track my test order status?'
                description='You can view the status of your test order directly from your account dashboard. It will show updates such as sample collection, processing status, and when the results will be available.' />
            <DetailCardToggler
                title='16. Can I provide patient details at the time of sample collection?'
                description='Yes, during the sample collection, you can choose to provide the patient’s details directly to the collector. Alternatively, you can pre-fill this information when making the booking.' />
        </div>
    )
}

export default page;

function DetailCardToggler({ title = '', description = '', className = '' }: { title?: string, description?: string, className?: string }) {
    return (
        <div className={"border-2 border-gray-300/70 bg-white dark:bg-[#172A46] dark:border-gray-500 px-4 py-2.5 rounded-md w-full animate-fadeInUpScroll " + className}>
            <input type="checkbox" id={title.toLowerCase().replace(/\s+/g, '')} className="peer hidden" />

            <label
                htmlFor={title.toLowerCase().replace(/\s+/g, '')}
                className="flex justify-between cursor-pointer font-semibold text-lg"
            >
                {title}
                <span className="plus-icon my-auto"><Plus /></span>
                <span className="minus-icon my-auto"><Minus /></span>
            </label>

            <div className="hidden peer-checked:block pt-3 mt-2.5 border-t-2 border-gray-300/70 dark:border-gray-500 text-gray-600 dark:text-gray-400">
                {description}
            </div>
        </div>
    )
}
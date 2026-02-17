import { getCourseContent } from '@/app/actions/admin';
import ContentEditor from '@/components/admin/ContentEditor';

export const revalidate = 0;

export default async function CourseCMSPage() {
    const content = await getCourseContent();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Course Guide Content</h2>
                <p className="text-gray-500">Edit the content of your CAC Registration Guide.</p>
            </div>

            <ContentEditor
                title="Course Introduction"
                section="course_intro"
                saveAction="saveCourseContent"
                initialData={content['course_intro']?.content || {
                    title: "CAC Registration Guide (SMEDAN Method)",
                    badge: "Member Access"
                }}
                fields={[
                    { key: 'title', label: 'Guide Title', type: 'text' },
                    { key: 'badge', label: 'Badge Text', type: 'text' },
                ]}
            />

            <ContentEditor
                title="Step 1: Understand the Opportunity"
                section="step1"
                saveAction="saveCourseContent"
                initialData={content['step1']?.content || {
                    title: "Step 1: Understand the SMEDAN Opportunity",
                    text: "The Small and Medium Enterprises Development Agency of Nigeria (SMEDAN) has partnered with the Corporate Affairs Commission (CAC) to offer free business registration for eligible entrepreneurs.",
                    notesTitle: "Important Notes:",
                    notes: [
                        "This program covers the full CAC registration fee (normally ₦10,000+)",
                        "Limited to one business per individual",
                        "Must be a Nigerian citizen or legal resident"
                    ],
                    eligibilityTitle: "Eligibility Reminders:",
                    eligibility: [
                        "Business must be micro, small, or medium enterprise",
                        "Annual turnover not exceeding ₦100 million",
                        "Must not have previously registered with CAC"
                    ]
                }}
                fields={[
                    { key: 'title', label: 'Step Title', type: 'text' },
                    { key: 'text', label: 'Intro Text', type: 'textarea' },
                    { key: 'notesTitle', label: 'Notes Header', type: 'text' },
                    { key: 'notes', label: 'Important Notes', type: 'list', subFields: [{ key: 'item', label: 'Note', type: 'text' }] },
                    { key: 'eligibilityTitle', label: 'Eligibility Header', type: 'text' },
                    { key: 'eligibility', label: 'Eligibility Items', type: 'list', subFields: [{ key: 'item', label: 'Item', type: 'text' }] },
                ]}
            />

            <ContentEditor
                title="Step 2: Prepare Information"
                section="step2"
                saveAction="saveCourseContent"
                initialData={content['step2']?.content || {
                    title: "Step 2: Prepare Required Information",
                    detailsTitle: "Personal Details Needed:",
                    details: [
                        "Valid National ID Card (NIN, Voter's Card, or International Passport)",
                        "Active Email Address and Phone Number",
                        "Residential Address (with proof)",
                        "Business Description and Activities"
                    ]
                }}
                fields={[
                    { key: 'title', label: 'Step Title', type: 'text' },
                    { key: 'detailsTitle', label: 'Details Header', type: 'text' },
                    { key: 'details', label: 'Required Details', type: 'list', subFields: [{ key: 'item', label: 'Detail', type: 'text' }] },
                ]}
            />

            <ContentEditor
                title="Step 3: Create SMEDAN Account"
                section="step3"
                saveAction="saveCourseContent"
                initialData={content['step3']?.content || {
                    title: "Step 3: Create SMEDAN Account",
                    instructions: [
                        "Visit the official SMEDAN portal: smedan.gov.ng",
                        "Click on 'Register' or 'Create Account' button",
                        "Fill in your personal details accurately",
                        "Verify your email address through the link sent to your inbox",
                        "Complete your profile by uploading required documents"
                    ]
                }}
                fields={[
                    { key: 'title', label: 'Step Title', type: 'text' },
                    { key: 'instructions', label: 'List of Instructions', type: 'list', subFields: [{ key: 'item', label: 'Step', type: 'text' }] },
                ]}
            />

            <ContentEditor
                title="Step 4: Submit CAC Registration"
                section="step4"
                saveAction="saveCourseContent"
                initialData={content['step4']?.content || {
                    title: "Step 4: Submit CAC Registration Through SMEDAN",
                    instructions: [
                        "Log in to your SMEDAN account",
                        "Navigate to 'Services' > 'CAC Registration'",
                        "Select 'Business Name Registration' option",
                        "Enter your preferred business names from Step 2",
                        "Fill in all required business details",
                        "Review all information carefully before submission",
                        "Submit and note your application reference number"
                    ],
                    warningsTitle: "Important Warnings:",
                    warnings: [
                        "Double-check all information before submission - errors may require reapplication",
                        "Do not pay anyone for this free service",
                        "Save your application reference number safely"
                    ],
                    mistakesTitle: "Common Mistakes to Avoid:",
                    mistakes: [
                        "Using restricted words in business name without approval",
                        "Providing incorrect personal details",
                        "Not checking business name availability first",
                        "Uploading unclear or invalid documents"
                    ]
                }}
                fields={[
                    { key: 'title', label: 'Step Title', type: 'text' },
                    { key: 'instructions', label: 'Submission Steps', type: 'list', subFields: [{ key: 'item', label: 'Step', type: 'text' }] },
                    { key: 'warningsTitle', label: 'Warnings Header', type: 'text' },
                    { key: 'warnings', label: 'Warnings List', type: 'list', subFields: [{ key: 'item', label: 'Warning', type: 'text' }] },
                    { key: 'mistakesTitle', label: 'Mistakes Header', type: 'text' },
                    { key: 'mistakes', label: 'Mistakes List', type: 'list', subFields: [{ key: 'item', label: 'Mistake', type: 'text' }] },
                ]}
            />

            <ContentEditor
                title="Step 5: Track & Download"
                section="step5"
                saveAction="saveCourseContent"
                initialData={content['step5']?.content || {
                    title: "Step 5: Track Approval & Download Certificate",
                    trackTitle: "How to Check Status:",
                    trackSteps: [
                        "Log in to your SMEDAN account dashboard",
                        "Go to 'My Applications' section",
                        "Find your CAC registration application",
                        "Check the status (Pending, Approved, or Rejected)"
                    ],
                    approvedTitle: "If Approved:",
                    approvedSteps: [
                        "Download your CAC registration certificate",
                        "Save multiple copies (digital and print)",
                        "Proceed with business operations"
                    ],
                    delayedTitle: "If Delayed Beyond 2 Weeks:",
                    delayedSteps: [
                        "Contact SMEDAN support through their portal",
                        "Visit nearest SMEDAN office with reference number",
                        "Reach out to our WhatsApp support for assistance"
                    ]
                }}
                fields={[
                    { key: 'title', label: 'Step Title', type: 'text' },
                    { key: 'trackTitle', label: 'Track Header', type: 'text' },
                    { key: 'trackSteps', label: 'Track Steps', type: 'list', subFields: [{ key: 'item', label: 'Step', type: 'text' }] },
                    { key: 'approvedTitle', label: 'Approved Header', type: 'text' },
                    { key: 'approvedSteps', label: 'Approved Steps', type: 'list', subFields: [{ key: 'item', label: 'Step', type: 'text' }] },
                    { key: 'delayedTitle', label: 'Delayed Header', type: 'text' },
                    { key: 'delayedSteps', label: 'Delayed Steps', type: 'list', subFields: [{ key: 'item', label: 'Step', type: 'text' }] },
                ]}
            />

            <ContentEditor
                title="Support FAQ (Course)"
                section="course_faq"
                saveAction="saveCourseContent"
                initialData={content['course_faq']?.content || {
                    questions: [
                        { q: "How long does the CAC registration process take?", a: "Typically, the CAC registration through SMEDAN takes 1-2 weeks for approval." },
                        { q: "Can I register multiple businesses for free?", a: "No, the SMEDAN free registration program is limited to one business per individual." },
                        { q: "What if my application is rejected?", a: "If your application is rejected, you'll receive a reason. You can correct the issues and reapply." }
                    ]
                }}
                fields={[
                    {
                        key: 'questions',
                        label: 'FAQ List',
                        type: 'list',
                        subFields: [
                            { key: 'q', label: 'Question', type: 'text' },
                            { key: 'a', label: 'Answer', type: 'textarea' },
                        ]
                    },
                ]}
            />

            <ContentEditor
                title="Completion Section"
                section="completion"
                saveAction="saveCourseContent"
                initialData={content['completion']?.content || {
                    title: "Congratulations!",
                    message: "You've completed all the steps to register your business with CAC for free through SMEDAN.",
                    promoTitle: "Need Professional Assistance?",
                    promoText: "If you prefer to focus on your business while experts handle the registration, our Done-For-You service includes everything from document preparation to certificate delivery.",
                    promoButton: "Let Us Handle It For You"
                }}
                fields={[
                    { key: 'title', label: 'Success Title', type: 'text' },
                    { key: 'message', label: 'Success Message', type: 'textarea' },
                    { key: 'promoTitle', label: 'Promo Title', type: 'text' },
                    { key: 'promoText', label: 'Promo Text', type: 'textarea' },
                    { key: 'promoButton', label: 'Promo Button', type: 'text' },
                ]}
            />
        </div>
    );
}

import { getGuideStructure, getSiteSections } from '@/app/actions/admin';
import ContentEditor from '@/components/admin/ContentEditor';
import ModuleManager from '@/components/admin/ModuleManager';

export const revalidate = 0;

export default async function CourseCMSPage() {
    const modules = await getGuideStructure();
    const sections = await getSiteSections('guide');

    return (
        <div className="space-y-12 pb-20">
            <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">Course Guide CMS</h2>
                <p className="text-gray-500 font-medium">Manage your guide content, structure, and upsells.</p>
            </div>

            {/* Structured Module/Lesson Editor */}
            <ModuleManager initialModules={modules} />

            <div className="pt-8 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 px-2">Page Settings</h3>

                {/* ───── INTRODUCTION ───── */}
                <ContentEditor
                    title="📘 Introduction Section"
                    section="course_intro"
                    page="guide"
                    saveAction="saveSiteSection"
                    initialData={sections['course_intro'] || {
                        title: "Welcome to CROWGLO HUB",
                        subtitle: "We are specialized in educational services and technology, helping small businesses thrive in Nigeria."
                    }}
                    fields={[
                        { key: 'title', label: 'Main Title', type: 'text' },
                        { key: 'subtitle', label: 'Sub Title', type: 'textarea' },
                    ]}
                />

                {/* ───── HEADER & SIDEBAR SETTINGS ───── */}
                <ContentEditor
                    title="Sidebar & Support Settings"
                    section="settings"
                    page="guide"
                    saveAction="saveSiteSection"
                    initialData={sections['settings'] || {
                        badge: "Member Access",
                        sidebar_title: "Registration Journey",
                        help_title: "Need Help?",
                        help_subtitle: "Our team is available for WhatsApp support.",
                        whatsapp: "2348000000000"
                    }}
                    fields={[
                        { key: 'badge', label: 'Top Badge Text', type: 'text' },
                        { key: 'sidebar_title', label: 'Sidebar Journey Title', type: 'text' },
                        { key: 'help_title', label: 'Help Card Title', type: 'text' },
                        { key: 'help_subtitle', label: 'Help Card Subtitle', type: 'text' },
                        { key: 'whatsapp', label: 'WhatsApp Number (e.g. 2348030000000)', type: 'text' },
                    ]}
                />

                {/* ───── UPSELL SECTION ───── */}
                <ContentEditor
                    title="🚀 Upsell Section"
                    section="upsell"
                    page="guide"
                    saveAction="saveSiteSection"
                    initialData={sections['upsell'] || {
                        title: "Maximize Your Success",
                        subtitle: "We want to guide you further until your business is fully established and ready for the world.",
                        items: []
                    }}
                    fields={[
                        { key: 'title', label: 'Upsell Heading', type: 'text' },
                        { key: 'subtitle', label: 'Upsell Subheading', type: 'textarea' },
                        {
                            key: 'items', label: 'Upsell Offers', type: 'list',
                            subFields: [
                                { key: 'type', label: 'Type (webinar/ebook/session)', type: 'text' },
                                { key: 'title', label: 'Title', type: 'text' },
                                { key: 'description', label: 'Description', type: 'textarea' },
                                { key: 'price', label: 'Price (display text)', type: 'text' },
                                { key: 'btnText', label: 'Button Text', type: 'text' },
                                { key: 'color', label: 'Color theme (blue/orange/dark)', type: 'text' },
                            ]
                        },
                    ]}
                />
            </div>
        </div>
    );
}

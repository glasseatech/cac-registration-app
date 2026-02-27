# Developer Guide: Extending the CMS

This document explains how to add new editable sections, fields, or copy strings to your application.

## 1. Adding a New UI Microcopy (Key/Value)
If you want to make a small piece of text (like a button label or heading) editable:

1.  **Seed the Database**: Add the new key to `supabase_seed.sql` (or add it directly via the "UI Copy" page in the Admin Dashboard).
    ```sql
    INSERT INTO public.copy_strings (key, value, category) 
    VALUES ('mynew.key', 'Default Value', 'global');
    ```
2.  **Use it in Code**: Use the `c()` helper in your component.
    ```tsx
    <span>{c('mynew.key', 'Fallback Label')}</span>
    ```

## 2. Adding a New Landing Page Section
To add a new block of structured content (e.g., a "Partners" section) to the homepage:

1.  **Define the Section in Admin**: Update `/app/admin/(protected)/content/landing/page.tsx` by adding a new `ContentEditor` instance.
    ```tsx
    <ContentEditor
        title="🤝 Partners"
        section="partners"
        page="landing"
        saveAction="saveSiteSection"
        initialData={getInitial('partners', { title: "Our Partners", logos: [] })}
        fields={[
            { key: 'title', label: 'Section Title', type: 'text' },
            { 
                key: 'logos', label: 'Partner Logos', type: 'list',
                subFields: [{ key: 'url', label: 'Logo URL', type: 'text' }]
            },
        ]}
    />
    ```
2.  **Display it on the Front-end**: Update `MainPage.tsx` to read the new section from `cmsContent`.
    ```tsx
    <section>
        <h2>{cmsContent.partners?.title || "Default Title"}</h2>
        {cmsContent.partners?.logos?.map(/* ... */)}
    </section>
    ```

## 3. Field Types Reference
The `ContentEditor` component supports these field types:
- `text`: Single-line input.
- `number`: Numeric input.
- `textarea`: Multi-line plain text.
- `richtext`: Textarea with HTML preview toggle.
- `boolean`: Toggle switch.
- `list`: Reorderable group of sub-fields (useful for features, FAQs, steps).

## 4. Revision History
Every time you save a section via the `ContentEditor`, a snapshot is saved to the `content_revisions` table. You can view these in the database to roll back changes manually if needed.

## 5. Audit Logging
All admin actions (saves, deletes, uploads) are automatically logged. You can view high-level logs at `/admin/audit`.

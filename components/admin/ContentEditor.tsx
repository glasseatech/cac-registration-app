'use client';

import { useState } from 'react';
import { saveLandingContent, saveCourseContent, saveSiteSection } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

interface ContentEditorProps {
    title: string;
    section: string;
    page?: string; // 'landing' or 'guide'
    initialData: any;
    fields: FieldDef[];
    saveAction?: 'saveLandingContent' | 'saveCourseContent' | 'saveSiteSection';
}

interface FieldDef {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'richtext' | 'number' | 'boolean' | 'image' | 'list';
    subFields?: FieldDef[];
    help?: string;
}

export default function ContentEditor({ title, section, page = 'landing', initialData, fields, saveAction = 'saveLandingContent' }: ContentEditorProps) {
    const router = useRouter();
    const [data, setData] = useState(initialData || {});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);

    const handleChange = (key: string, value: any) => {
        setData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleListChange = (key: string, index: number, subKey: string, value: any) => {
        setData((prev: any) => {
            const newList = [...(prev[key] || [])];
            newList[index] = { ...newList[index], [subKey]: value };
            return { ...prev, [key]: newList };
        });
    };

    const addListItem = (key: string, subFields: FieldDef[]) => {
        setData((prev: any) => {
            const newItem = subFields.reduce((acc, field) => ({ ...acc, [field.key]: field.type === 'number' ? 0 : (field.type === 'boolean' ? false : '') }), {});
            return { ...prev, [key]: [...(prev[key] || []), newItem] };
        });
    };

    const removeListItem = (key: string, index: number) => {
        setData((prev: any) => {
            const newList = [...(prev[key] || [])];
            newList.splice(index, 1);
            return { ...prev, [key]: newList };
        });
    };

    const moveListItem = (key: string, fromIndex: number, direction: 'up' | 'down') => {
        setData((prev: any) => {
            const newList = [...(prev[key] || [])];
            const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
            if (toIndex < 0 || toIndex >= newList.length) return prev;
            [newList[fromIndex], newList[toIndex]] = [newList[toIndex], newList[fromIndex]];
            return { ...prev, [key]: newList };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            if (saveAction === 'saveSiteSection') {
                // Extract title/subtitle from data if present, put rest in content_json
                const { title: sTitle, subtitle: sSub, ...rest } = data;
                await saveSiteSection(page, section, {
                    title: sTitle,
                    subtitle: sSub,
                    content_json: rest,
                });
            } else if (saveAction === 'saveLandingContent') {
                await saveLandingContent(section, data, true);
            } else if (saveAction === 'saveCourseContent') {
                await saveCourseContent(section, data, true);
            }
            setMessage({ type: 'success', text: 'Saved and published successfully!' });
            router.refresh();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save content.' });
        } finally {
            setSaving(false);
        }
    };

    const renderField = (field: FieldDef) => {
        if (field.type === 'list' && field.subFields) {
            return (
                <div className="space-y-3">
                    {(data[field.key] || []).map((item: any, idx: number) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                            {/* Reorder + Delete Controls */}
                            <div className="absolute -top-2 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => moveListItem(field.key, idx, 'up')}
                                    disabled={idx === 0}
                                    className="bg-gray-600 text-white p-1 rounded-full shadow disabled:opacity-30 hover:bg-gray-700"
                                    title="Move up"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => moveListItem(field.key, idx, 'down')}
                                    disabled={idx === (data[field.key]?.length || 0) - 1}
                                    className="bg-gray-600 text-white p-1 rounded-full shadow disabled:opacity-30 hover:bg-gray-700"
                                    title="Move down"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => removeListItem(field.key, idx)}
                                    className="bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                                    title="Remove"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="text-xs font-bold text-gray-400 mb-2">#{idx + 1}</div>
                            <div className="grid grid-cols-1 gap-3">
                                {field.subFields?.map((sub) => (
                                    <div key={sub.key}>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">{sub.label}</label>
                                        {sub.type === 'textarea' || sub.type === 'richtext' ? (
                                            <textarea
                                                value={item[sub.key] || ''}
                                                onChange={(e) => handleListChange(field.key, idx, sub.key, e.target.value)}
                                                rows={sub.type === 'richtext' ? 4 : 2}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B5E2E] outline-none font-mono"
                                            />
                                        ) : sub.type === 'number' ? (
                                            <input
                                                type="number"
                                                value={item[sub.key] || 0}
                                                onChange={(e) => handleListChange(field.key, idx, sub.key, Number(e.target.value))}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B5E2E] outline-none"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={item[sub.key] || ''}
                                                onChange={(e) => handleListChange(field.key, idx, sub.key, e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B5E2E] outline-none"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => addListItem(field.key, field.subFields!)}
                        className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-medium hover:border-[#0B5E2E] hover:text-[#0B5E2E] transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Item
                    </button>
                </div>
            );
        }

        if (field.type === 'richtext') {
            return (
                <div>
                    <div className="flex gap-2 mb-2">
                        <button
                            type="button"
                            onClick={() => setPreviewHtml(previewHtml === field.key ? null : field.key)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                        >
                            {previewHtml === field.key ? 'Edit' : 'Preview HTML'}
                        </button>
                    </div>
                    {previewHtml === field.key ? (
                        <div
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white min-h-[120px] prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: data[field.key] || '<p class="text-gray-400 italic">No content</p>' }}
                        />
                    ) : (
                        <textarea
                            value={data[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5E2E] focus:border-[#0B5E2E] outline-none transition-all font-mono text-sm"
                            placeholder="Supports HTML: <b>bold</b>, <ul><li>lists</li></ul>, <a href=''>links</a>"
                        />
                    )}
                </div>
            );
        }

        if (field.type === 'textarea') {
            return (
                <textarea
                    value={data[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5E2E] focus:border-[#0B5E2E] outline-none transition-all"
                />
            );
        }

        if (field.type === 'boolean') {
            return (
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={data[field.key] || false}
                        onChange={(e) => handleChange(field.key, e.target.checked)}
                        className="h-4 w-4 text-[#0B5E2E] focus:ring-[#0B5E2E] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-500">{field.help || 'Enable'}</span>
                </div>
            );
        }

        if (field.type === 'number') {
            return (
                <input
                    type="number"
                    value={data[field.key] || 0}
                    onChange={(e) => handleChange(field.key, Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5E2E] focus:border-[#0B5E2E] outline-none transition-all"
                />
            );
        }

        // Default: text
        return (
            <input
                type="text"
                value={data[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5E2E] focus:border-[#0B5E2E] outline-none transition-all"
            />
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#0B5E2E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#094a24] disabled:opacity-50 transition-colors"
                >
                    {saving ? 'Saving...' : 'Save & Publish'}
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-6">
                {fields.map((field) => (
                    <div key={field.key} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            {field.label}
                        </label>
                        {renderField(field)}
                        {field.help && field.type !== 'boolean' && field.type !== 'list' && (
                            <p className="text-xs text-gray-500 mt-1">{field.help}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

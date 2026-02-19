'use client';

import React, { useState, useMemo } from 'react';
import { saveCopyString, deleteCopyString } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

interface CopyString {
    key: string;
    value: string;
    category: string;
    description: string | null;
}

const CATEGORIES = ['all', 'navbar', 'homepage', 'footer', 'guide', 'global'];

export default function CopyStringsEditor({ initialStrings }: { initialStrings: CopyString[] }) {
    const router = useRouter();
    const [strings, setStrings] = useState<CopyString[]>(initialStrings);
    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [saving, setSaving] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // New string form
    const [showAdd, setShowAdd] = useState(false);
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [newCategory, setNewCategory] = useState('global');
    const [newDescription, setNewDescription] = useState('');

    const filtered = useMemo(() => {
        return strings.filter(s => {
            const matchCategory = activeCategory === 'all' || s.category === activeCategory;
            const matchSearch = !search || s.key.includes(search.toLowerCase()) || s.value.toLowerCase().includes(search.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [strings, activeCategory, search]);

    const flash = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleStartEdit = (s: CopyString) => {
        setEditingKey(s.key);
        setEditValue(s.value);
    };

    const handleSaveEdit = async (key: string, category: string) => {
        setSaving(key);
        try {
            await saveCopyString(key, editValue, category);
            setStrings(prev => prev.map(s => s.key === key ? { ...s, value: editValue } : s));
            setEditingKey(null);
            flash('success', `Updated "${key}"`);
            router.refresh();
        } catch {
            flash('error', 'Failed to save');
        } finally {
            setSaving(null);
        }
    };

    const handleDelete = async (key: string) => {
        if (!confirm(`Delete copy string "${key}"?`)) return;
        setSaving(key);
        try {
            await deleteCopyString(key);
            setStrings(prev => prev.filter(s => s.key !== key));
            flash('success', `Deleted "${key}"`);
            router.refresh();
        } catch {
            flash('error', 'Failed to delete');
        } finally {
            setSaving(null);
        }
    };

    const handleAdd = async () => {
        if (!newKey.trim()) return;
        setSaving('new');
        try {
            await saveCopyString(newKey, newValue, newCategory, newDescription);
            const cleanKey = newKey.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '_');
            setStrings(prev => [...prev, { key: cleanKey, value: newValue, category: newCategory, description: newDescription }]);
            setNewKey('');
            setNewValue('');
            setNewDescription('');
            setShowAdd(false);
            flash('success', `Added "${cleanKey}"`);
            router.refresh();
        } catch {
            flash('error', 'Failed to add');
        } finally {
            setSaving(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">UI Copy Strings</h2>
                    <p className="text-gray-500 font-medium">Manage all UI microcopy and labels ({strings.length} strings)</p>
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="bg-[#0B5E2E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#094a24] transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add String
                </button>
            </div>

            {message && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Add Form */}
            {showAdd && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Add New Copy String</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Key</label>
                            <input
                                type="text"
                                value={newKey}
                                onChange={e => setNewKey(e.target.value)}
                                placeholder="e.g. navbar.brand_name"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B5E2E] outline-none font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                            <select
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B5E2E] outline-none"
                            >
                                {CATEGORIES.filter(c => c !== 'all').map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Value</label>
                            <textarea
                                value={newValue}
                                onChange={e => setNewValue(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B5E2E] outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Description (optional)</label>
                            <input
                                type="text"
                                value={newDescription}
                                onChange={e => setNewDescription(e.target.value)}
                                placeholder="Context for this string"
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B5E2E] outline-none"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={handleAdd}
                            disabled={saving === 'new'}
                            className="bg-[#0B5E2E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#094a24] disabled:opacity-50"
                        >
                            {saving === 'new' ? 'Adding...' : 'Add'}
                        </button>
                        <button onClick={() => setShowAdd(false)} className="text-gray-500 px-4 py-2 text-sm">Cancel</button>
                    </div>
                </div>
            )}

            {/* Category Tabs + Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${activeCategory === cat
                                    ? 'bg-[#0B5E2E] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                                <span className="ml-1 opacity-60">
                                    ({cat === 'all' ? strings.length : strings.filter(s => s.category === cat).length})
                                </span>
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search keys or values..."
                        className="w-full sm:w-64 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0B5E2E] outline-none"
                    />
                </div>
            </div>

            {/* Strings Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase w-1/4">Key</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Value</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase w-20">Category</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(s => (
                                <tr key={s.key} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-mono">{s.key}</code>
                                        {s.description && <p className="text-[10px] text-gray-400 mt-1">{s.description}</p>}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingKey === s.key ? (
                                            <div className="flex gap-2">
                                                <textarea
                                                    value={editValue}
                                                    onChange={e => setEditValue(e.target.value)}
                                                    rows={2}
                                                    className="flex-1 px-2 py-1 text-sm border border-[#0B5E2E] rounded-lg focus:ring-1 focus:ring-[#0B5E2E] outline-none"
                                                    autoFocus
                                                />
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        onClick={() => handleSaveEdit(s.key, s.category)}
                                                        disabled={saving === s.key}
                                                        className="text-xs bg-[#0B5E2E] text-white px-2 py-1 rounded hover:bg-[#094a24] disabled:opacity-50"
                                                    >
                                                        {saving === s.key ? '...' : 'Save'}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingKey(null)}
                                                        className="text-xs text-gray-400 px-2 py-1"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-700 cursor-pointer hover:text-[#0B5E2E]" onClick={() => handleStartEdit(s)}>
                                                {s.value || <span className="text-gray-300 italic">empty</span>}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-bold uppercase">{s.category}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => handleStartEdit(s)}
                                                className="text-gray-400 hover:text-[#0B5E2E] p-1"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s.key)}
                                                className="text-gray-400 hover:text-red-500 p-1"
                                                title="Delete"
                                                disabled={saving === s.key}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            No copy strings found matching your filters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

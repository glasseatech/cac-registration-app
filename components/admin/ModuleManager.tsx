'use client';

import React, { useState } from 'react';
import {
    saveGuideModule,
    deleteGuideModule,
    saveGuideLesson,
    deleteGuideLesson,
    reorderGuideModules,
    reorderGuideLessons
} from '@/app/actions/admin';
import { HeartCard, HeartButton, HeartInput, HeartBadge } from '@/components/ui/DesignSystem';

export default function ModuleManager({ initialModules }: { initialModules: any[] }) {
    const [modules, setModules] = useState(initialModules);
    const [loading, setLoading] = useState<string | null>(null);
    const [editingModule, setEditingModule] = useState<any | null>(null);
    const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lesson: any } | null>(null);

    // ─── MODULE ACTIONS ─────────────────────────────────────────
    const handleAddModule = async () => {
        const title = prompt('Enter module title:');
        if (!title) return;
        setLoading('add-module');
        try {
            const newModule = await saveGuideModule({ title, order: modules.length });
            setModules([...modules, { ...newModule, lessons: [] }]);
        } finally {
            setLoading(null);
        }
    };

    const handleUpdateModule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingModule) return;
        setLoading(editingModule.id);
        try {
            const updated = await saveGuideModule(editingModule);
            setModules(modules.map(m => m.id === updated.id ? { ...m, ...updated } : m));
            setEditingModule(null);
        } finally {
            setLoading(null);
        }
    };

    const handleDeleteModule = async (id: string) => {
        if (!confirm('Are you sure you want to delete this module and all its lessons?')) return;
        setLoading(id);
        try {
            await deleteGuideModule(id);
            setModules(modules.filter(m => m.id !== id));
        } finally {
            setLoading(null);
        }
    };

    const handleReorderModule = async (index: number, direction: 'up' | 'down') => {
        const newModules = [...modules].sort((a, b) => a.order - b.order);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newModules.length) return;

        [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];

        // Optimistic UI
        const updatedModules = newModules.map((m, i) => ({ ...m, order: i }));
        setModules(updatedModules);

        try {
            await reorderGuideModules(updatedModules.map(m => m.id));
        } catch (err) {
            setModules(modules); // Rollback
        }
    };

    // ─── LESSON ACTIONS ─────────────────────────────────────────
    const handleAddLesson = async (moduleId: string) => {
        const title = prompt('Enter lesson title:');
        if (!title) return;
        setLoading(`add-lesson-${moduleId}`);
        try {
            const module = modules.find(m => m.id === moduleId);
            const newLesson = await saveGuideLesson({
                module_id: moduleId,
                title,
                order: module.lessons.length,
                type: 'text'
            });
            setModules(modules.map(m => {
                if (m.id === moduleId) {
                    return { ...m, lessons: [...m.lessons, newLesson] };
                }
                return m;
            }));
        } finally {
            setLoading(null);
        }
    };

    const handleUpdateLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLesson) return;
        const { moduleId, lesson } = editingLesson;
        setLoading(lesson.id);
        try {
            const updated = await saveGuideLesson(lesson);
            setModules(modules.map(m => {
                if (m.id === moduleId) {
                    return {
                        ...m,
                        lessons: m.lessons.map((l: any) => l.id === updated.id ? updated : l)
                    };
                }
                return m;
            }));
            setEditingLesson(null);
        } finally {
            setLoading(null);
        }
    };

    const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
        if (!confirm('Delete this lesson?')) return;
        setLoading(lessonId);
        try {
            await deleteGuideLesson(lessonId);
            setModules(modules.map(m => {
                if (m.id === moduleId) {
                    return { ...m, lessons: m.lessons.filter((l: any) => l.id !== lessonId) };
                }
                return m;
            }));
        } finally {
            setLoading(null);
        }
    };

    const handleReorderLesson = async (moduleId: string, index: number, direction: 'up' | 'down') => {
        const module = modules.find(m => m.id === moduleId);
        if (!module) return;

        const newLessons = [...module.lessons].sort((a, b) => a.order - b.order);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newLessons.length) return;

        [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]];

        // Optimistic UI
        const updatedLessons = newLessons.map((l, i) => ({ ...l, order: i }));
        setModules(modules.map(m => m.id === moduleId ? { ...m, lessons: updatedLessons } : m));

        try {
            await reorderGuideLessons(moduleId, updatedLessons.map(l => l.id));
        } catch (err) {
            setModules(modules); // Rollback
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Guide Structure</h3>
                    <p className="text-sm text-gray-500">Manage modules and lessons for the guide page.</p>
                </div>
                <HeartButton onClick={handleAddModule} disabled={loading === 'add-module'}>
                    {loading === 'add-module' ? 'Creating...' : '+ Add Module'}
                </HeartButton>
            </div>

            <div className="grid gap-6">
                {modules.sort((a, b) => a.order - b.order).map((module, mIdx) => (
                    <HeartCard key={module.id} className="relative group overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col gap-1 mr-2">
                                    <button
                                        onClick={() => handleReorderModule(mIdx, 'up')}
                                        disabled={mIdx === 0}
                                        className="text-gray-400 hover:text-[#0B5E2E] disabled:opacity-20"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => handleReorderModule(mIdx, 'down')}
                                        disabled={mIdx === modules.length - 1}
                                        className="text-gray-400 hover:text-[#0B5E2E] disabled:opacity-20"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </button>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-green-50 text-[#0B5E2E] flex items-center justify-center font-bold">
                                    {mIdx + 1}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800">{module.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{module.lessons?.length || 0} Lessons</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <HeartButton variant="secondary" className="py-2 px-4 text-xs" onClick={() => setEditingModule(module)}>
                                    Edit Title
                                </HeartButton>
                                <HeartButton variant="ghost" className="text-red-500 hover:bg-red-50 py-2 px-3 text-xs" onClick={() => handleDeleteModule(module.id)} disabled={loading === module.id}>
                                    Delete
                                </HeartButton>
                            </div>
                        </div>

                        {/* LESSONS LIST */}
                        <div className="pl-13 space-y-3">
                            {module.lessons?.sort((a: any, b: any) => a.order - b.order).map((lesson: any, lIdx: number) => (
                                <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all group/lesson">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleReorderLesson(module.id, lIdx, 'up')}
                                                disabled={lIdx === 0}
                                                className="text-gray-400 hover:text-[#0B5E2E] disabled:opacity-10"
                                            >
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleReorderLesson(module.id, lIdx, 'down')}
                                                disabled={lIdx === module.lessons.length - 1}
                                                className="text-gray-400 hover:text-[#0B5E2E] disabled:opacity-10"
                                            >
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                            </button>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-700">{lesson.title}</span>
                                                {lesson.url && <HeartBadge color="blue" className="text-[8px]">Resource</HeartBadge>}
                                            </div>
                                            <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{lesson.content?.replace(/<[^>]*>/g, '').substring(0, 50)}...</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setEditingLesson({ moduleId: module.id, lesson })}
                                            className="p-2 text-gray-400 hover:text-[#0B5E2E] hover:bg-green-50 rounded-lg transition-all"
                                            title="Edit Lesson Content"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            disabled={loading === lesson.id}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => handleAddLesson(module.id)}
                                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm font-bold hover:border-[#0B5E2E] hover:text-[#0B5E2E] transition-all flex items-center justify-center gap-2"
                                disabled={loading === `add-lesson-${module.id}`}
                            >
                                {loading === `add-lesson-${module.id}` ? 'Adding...' : '+ Add Lesson'}
                            </button>
                        </div>
                    </HeartCard>
                ))}
            </div>

            {/* ─── MODALS ────────────────────────────────────────── */}

            {/* MODULE EDIT MODAL */}
            {editingModule && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Edit Module</h3>
                            <button onClick={() => setEditingModule(null)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateModule} className="p-8 space-y-6">
                            <HeartInput
                                label="Module Title"
                                value={editingModule.title}
                                onChange={e => setEditingModule({ ...editingModule, title: e.target.value })}
                                required
                            />
                            <HeartButton type="submit" className="w-full" disabled={loading === editingModule.id}>
                                {loading === editingModule.id ? 'Saving...' : 'Save Changes'}
                            </HeartButton>
                        </form>
                    </div>
                </div>
            )}

            {/* LESSON EDIT MODAL */}
            {editingLesson && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 italic">Edit Lesson</h3>
                                <p className="text-xs text-green-700 font-medium">Update step-by-step instructions</p>
                            </div>
                            <button onClick={() => setEditingLesson(null)} className="text-gray-400 hover:text-gray-600 p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateLesson} className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                            <HeartInput
                                label="Lesson Title"
                                value={editingLesson.lesson.title}
                                onChange={e => setEditingLesson({
                                    ...editingLesson,
                                    lesson: { ...editingLesson.lesson, title: e.target.value }
                                })}
                                required
                            />

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Step Instructions (HTML)</label>
                                <textarea
                                    className="w-full px-5 py-4 rounded-3xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#0B5E2E]/20 focus:ring-4 focus:ring-[#0B5E2E]/5 outline-none transition-all duration-300 font-mono text-sm leading-relaxed"
                                    rows={10}
                                    value={editingLesson.lesson.content || ''}
                                    onChange={e => setEditingLesson({
                                        ...editingLesson,
                                        lesson: { ...editingLesson.lesson, content: e.target.value }
                                    })}
                                    placeholder="Enter HTML content: <p>...</p>, <ul><li>...</li></ul>"
                                />
                                <p className="text-[10px] text-gray-400 font-medium px-2 italic">* Supports basic HTML tags for bolding, lists, and links.</p>
                            </div>

                            <HeartInput
                                label="Resource URL (Optional)"
                                value={editingLesson.lesson.url || ''}
                                onChange={e => setEditingLesson({
                                    ...editingLesson,
                                    lesson: { ...editingLesson.lesson, url: e.target.value }
                                })}
                                placeholder="https://..."
                            />

                            <div className="pt-4 flex-shrink-0">
                                <HeartButton type="submit" className="w-full py-5 rounded-3xl text-lg shadow-green-900/10" disabled={loading === editingLesson.lesson.id}>
                                    {loading === editingLesson.lesson.id ? 'Saving Lesson...' : 'Save Instruction Point'}
                                </HeartButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

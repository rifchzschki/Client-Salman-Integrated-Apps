import dayjs from 'dayjs';
import React from 'react';
import { Discussion } from '@/types/types';

interface MainDiscussionProps {
    discussion: Discussion;
    onReplying: () => void;
}

export default function MainDiscussion({discussion, onReplying} : MainDiscussionProps) {
    const formattedCreated_at = discussion.created_at ? dayjs(discussion.created_at).format('D MMMM YYYY HH:mm') : null;
    const formattedUpdated_at = discussion.updated_at ? dayjs(discussion.updated_at).format('D MMMM YYYY HH:mm') : null;

    return (
        <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>{discussion.title}</h1>
            <div className='bg-white p-4 rounded-xl shadow'>
                <p className='text-gray-700 mb-4'>{discussion.content}</p>
                <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-500'>Posted by {discussion.author} on {formattedCreated_at} - Updated at {formattedUpdated_at}</span>
                    <button onClick={onReplying} className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800'>Reply</button>
                </div>
            </div>
        </div>
    )
}

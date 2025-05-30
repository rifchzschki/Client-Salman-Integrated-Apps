import { Discussion } from '@/types/types';
import DiscussionItem from './DiscussionItem';

interface DiscussionsProps {
  discussions: Discussion[];
  onDelete: (id: number) => void;
  onEdit: (id: number, newContent: string) => Promise<void>;
}

export default function DiscussionList({ discussions, onDelete, onEdit }: DiscussionsProps) {
  return (
    <div className="space-y-4">
      {discussions.map((discussion: Discussion) => (
        <DiscussionItem
          key={discussion.id}
          discussion={discussion}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
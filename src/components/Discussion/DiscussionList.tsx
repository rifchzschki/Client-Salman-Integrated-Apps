import DiscussionItem from './DiscussionItem';

export default function DiscussionList({ discussions, onDelete, onEdit }: any) {
  return (
    <div className="space-y-4">
      {discussions.map((discussion: any) => (
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
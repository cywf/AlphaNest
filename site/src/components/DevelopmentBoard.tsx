import { useState, useEffect } from 'react';

interface ProjectItem {
  title: string;
  status: string;
  labels: string[];
  assignees: string[];
  url: string;
}

export default function DevelopmentBoard() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/AlphaNest/data/projects.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load project data');
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-96 w-full"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error loading project board: {error}</span>
      </div>
    );
  }

  // Group items by status
  const todoItems = items.filter((item) => item.status === 'todo' || item.status === 'To Do');
  const doingItems = items.filter((item) => item.status === 'doing' || item.status === 'In Progress');
  const doneItems = items.filter((item) => item.status === 'done' || item.status === 'Done');

  const renderColumn = (title: string, items: ProjectItem[], color: string) => (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h3 className={`card-title text-xl mb-4 ${color}`}>
          {title}
          <span className="badge badge-lg">{items.length}</span>
        </h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-center opacity-50 py-8">No items</p>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
                <div className="card-body p-4">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold link link-hover text-sm"
                  >
                    {item.title}
                  </a>
                  {item.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.labels.map((label, i) => (
                        <span key={i} className="badge badge-xs badge-outline">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.assignees.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.assignees.map((assignee, i) => (
                        <div key={i} className="badge badge-ghost badge-xs">
                          @{assignee}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {renderColumn('📋 To Do', todoItems, 'text-info')}
      {renderColumn('🚧 In Progress', doingItems, 'text-warning')}
      {renderColumn('✅ Done', doneItems, 'text-success')}
    </div>
  );
}

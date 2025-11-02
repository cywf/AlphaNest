import { useState, useEffect } from 'react';

interface Discussion {
  title: string;
  author: string;
  url: string;
  createdAt: string;
  category: string;
}

export default function DiscussionsList() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/AlphaNest/data/discussions.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load discussions');
        return res.json();
      })
      .then((data) => {
        setDiscussions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredDiscussions = discussions.filter((d) =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-24 w-full"></div>
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
        <span>Error loading discussions: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="form-control">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search discussions..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm opacity-70">
        Showing {filteredDiscussions.length} of {discussions.length} discussions
      </div>

      {/* Discussions List */}
      {filteredDiscussions.length === 0 ? (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>No discussions found matching your search.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map((discussion, idx) => (
            <div key={idx} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="card-title">
                      <a
                        href={discussion.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-hover"
                      >
                        {discussion.title}
                      </a>
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="badge badge-primary">{discussion.category}</div>
                      <div className="badge badge-ghost">by {discussion.author}</div>
                      <div className="badge badge-ghost">
                        {new Date(discussion.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <a
                    href={discussion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-ghost"
                    aria-label="View discussion on GitHub"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

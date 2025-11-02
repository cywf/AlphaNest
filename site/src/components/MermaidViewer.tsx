import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface Diagram {
  name: string;
  id: string;
  content: string;
}

const diagrams: Diagram[] = [
  { name: 'Architecture', id: 'architecture', content: '' },
  { name: 'Flowchart', id: 'flowchart', content: '' },
  { name: 'BPMN-ish', id: 'bpmnish', content: '' },
  { name: 'Entity Relationship', id: 'er', content: '' },
  { name: 'CI Sequence', id: 'ci-sequence', content: '' },
];

export default function MermaidViewer() {
  const [selectedDiagram, setSelectedDiagram] = useState<string>('architecture');
  const [diagramData, setDiagramData] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Mermaid with dark theme
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#00ff9f',
        primaryTextColor: '#fff',
        primaryBorderColor: '#00d9ff',
        lineColor: '#00d9ff',
        secondaryColor: '#ff00ff',
        tertiaryColor: '#1a1a2e',
        background: '#0f0f1e',
        mainBkg: '#16162f',
        secondBkg: '#1d1d40',
        textColor: '#ffffff',
        border1: '#00d9ff',
        border2: '#00ff9f',
      },
      fontFamily: 'monospace',
    });

    // Load all diagrams
    const loadDiagrams = async () => {
      const loadedDiagrams = new Map<string, string>();
      
      for (const diagram of diagrams) {
        try {
          const response = await fetch(`/AlphaNest/diagrams/${diagram.id}.mmd`);
          if (response.ok) {
            const content = await response.text();
            loadedDiagrams.set(diagram.id, content);
          }
        } catch (err) {
          console.error(`Failed to load ${diagram.id}:`, err);
        }
      }
      
      setDiagramData(loadedDiagrams);
      setLoading(false);
    };

    loadDiagrams();
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !diagramData.has(selectedDiagram)) return;

      try {
        const content = diagramData.get(selectedDiagram);
        if (!content) return;

        // Clear previous diagram
        containerRef.current.innerHTML = '';

        // Create a unique ID for this render
        const id = `mermaid-${selectedDiagram}-${Date.now()}`;
        
        // Render the diagram
        const { svg } = await mermaid.render(id, content);
        containerRef.current.innerHTML = svg;
      } catch (err) {
        console.error('Error rendering diagram:', err);
        setError('Failed to render diagram');
      }
    };

    if (!loading) {
      renderDiagram();
    }
  }, [selectedDiagram, diagramData, loading]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-12 w-full"></div>
        <div className="skeleton h-96 w-full"></div>
      </div>
    );
  }

  if (diagramData.size === 0) {
    return (
      <div className="alert alert-warning">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>No diagrams found. Add .mmd files to the /mermaid/ directory.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Diagram Selector Tabs */}
      <div className="tabs tabs-boxed bg-base-200 p-2 overflow-x-auto">
        {diagrams
          .filter((d) => diagramData.has(d.id))
          .map((diagram) => (
            <button
              key={diagram.id}
              onClick={() => setSelectedDiagram(diagram.id)}
              className={`tab whitespace-nowrap ${
                selectedDiagram === diagram.id ? 'tab-active' : ''
              }`}
            >
              {diagram.name}
            </button>
          ))}
      </div>

      {/* Diagram Display */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">
              {diagrams.find((d) => d.id === selectedDiagram)?.name || selectedDiagram}
            </h2>
            <a
              href={`https://github.com/cywf/AlphaNest/blob/main/mermaid/${selectedDiagram}.mmd`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-ghost gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in GitHub
            </a>
          </div>
          
          {error ? (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          ) : (
            <div 
              ref={containerRef}
              className="overflow-x-auto p-4 bg-base-100 rounded-lg"
              style={{ minHeight: '400px' }}
            />
          )}
        </div>
      </div>

      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">About Diagrams</h3>
          <div className="text-sm">
            These diagrams are generated from Mermaid (.mmd) files in the repository.
            To add a new diagram, create a .mmd file in the <code>/mermaid/</code> directory.
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { generateSmartAgenda } from '../services/gemini';
import { Button } from './ui/Button';
import { Wand2, Sparkles } from 'lucide-react';

interface Props {
  topic: string;
  duration: number;
  onAgendaGenerated: (agenda: string) => void;
}

export const SmartAgendaGenerator: React.FC<Props> = ({ topic, duration, onAgendaGenerated }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    const result = await generateSmartAgenda(topic, duration);
    onAgendaGenerated(result);
    setLoading(false);
  };

  return (
    <div className="mt-2">
      <Button 
        type="button" 
        onClick={handleGenerate} 
        variant="secondary" 
        size="sm"
        disabled={!topic || loading}
        className="text-xs py-1 px-2 h-auto"
      >
        {loading ? <Sparkles className="w-3 h-3 mr-1 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1" />}
        {loading ? 'Generating...' : 'Generate Agenda with AI'}
      </Button>
    </div>
  );
};

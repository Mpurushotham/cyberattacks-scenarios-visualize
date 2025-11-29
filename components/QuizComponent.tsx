import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';
import { Brain, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface QuizComponentProps {
  topic: string;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ topic }) => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setQuestion(null);
    setSelectedOption(null);
    setShowResult(false);
    
    const q = await generateQuiz(topic);
    setQuestion(q);
    setLoading(false);
  };

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
  };

  return (
    <div className="mt-6 p-6 bg-slate-800 rounded-xl border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Brain className="text-indigo-400" />
          Knowledge Check
        </h3>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'New Question'}
        </button>
      </div>

      {!question && !loading && (
        <div className="text-slate-400 text-center py-8">
          Click "New Question" to test your knowledge on {topic} with AI.
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <Loader2 className="animate-spin w-8 h-8 text-indigo-500 mb-2" />
          <p>Generating challenge...</p>
        </div>
      )}

      {question && (
        <div className="animate-fadeIn">
          <p className="text-lg text-slate-200 mb-6">{question.question}</p>
          <div className="grid gap-3">
            {question.options.map((option, idx) => {
              let btnClass = "p-4 rounded-lg border text-left transition-all ";
              if (showResult) {
                if (idx === question.correctAnswer) btnClass += "bg-emerald-900/30 border-emerald-500 text-emerald-200";
                else if (idx === selectedOption) btnClass += "bg-red-900/30 border-red-500 text-red-200";
                else btnClass += "bg-slate-700/30 border-slate-700 text-slate-500";
              } else {
                btnClass += "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && idx === question.correctAnswer && <CheckCircle className="text-emerald-500 w-5 h-5" />}
                    {showResult && idx === selectedOption && idx !== question.correctAnswer && <XCircle className="text-red-500 w-5 h-5" />}
                  </div>
                </button>
              );
            })}
          </div>
          {showResult && (
            <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <p className="text-slate-300 text-sm">
                <span className="font-bold text-indigo-400">Explanation: </span>
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';
import { CheckCircle2, XCircle } from 'lucide-react';

const QuestionCard = ({ question, selectedAnswer, onSelect, showResult }) => {
  const { t } = useTranslation('learning');

  return (
    <Card className="p-6 md:p-8">
      <h3 className="text-xl font-bold text-slate-100 mb-6">
        {t(question.questionKey)}
      </h3>
      
      <div className="space-y-3">
        {question.optionKeys.map((optionKey, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = showResult && question.correctAnswer === index;
          const isWrongSelection = showResult && isSelected && question.correctAnswer !== index;

          let optionStyles = "flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ";
          
          if (showResult) {
            if (isCorrect) {
              optionStyles += "border-green-500 bg-green-500/10 text-green-400";
            } else if (isWrongSelection) {
              optionStyles += "border-red-500 bg-red-500/10 text-red-400";
            } else {
              optionStyles += "border-dark-700 opacity-50";
            }
          } else {
            if (isSelected) {
              optionStyles += "border-primary-500 bg-primary-500/10 text-primary-400";
            } else {
              optionStyles += "border-dark-700 hover:border-dark-500 hover:bg-dark-800/50 text-slate-300";
            }
          }

          return (
            <div 
              key={optionKey}
              className={optionStyles}
              onClick={() => !showResult && onSelect(index)}
            >
              <div className="flex-1">
                {t(optionKey)}
              </div>
              {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 ml-3" />}
              {showResult && isWrongSelection && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-3" />}
            </div>
          );
        })}
      </div>

      {showResult && question.explanationKey && (
        <div className="mt-6 p-4 rounded-xl bg-dark-800 border border-dark-700">
          <h4 className="text-sm font-bold text-slate-300 mb-2">Explanation</h4>
          <p className="text-slate-400 text-sm">
            {t(question.explanationKey)}
          </p>
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;

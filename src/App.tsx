import React, { useState } from 'react';
import { Shield, ArrowRight, BarChart, Lock } from 'lucide-react';
import { Question } from './components/Question';
import { ProgressBar } from './components/ProgressBar';
import { ScoreDisplay } from './components/ScoreDisplay';
import { FinancialProfileForm } from './components/FinancialProfileForm';
import { ContactForm } from './components/ContactForm';
import { questions } from './data/questions';
import { calculateScore } from './utils/calculateScore';
import type { Answer, Assessment, FinancialProfile, ContactInfo } from './types';

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [step, setStep] = useState<'profile' | 'assessment' | 'contact' | 'results'>('profile');

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, { questionId: questions[currentQuestion].id, value }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setAssessment(calculateScore(newAnswers));
      setStep('contact');
    }
  };

  const handleProfileSubmit = (profileData: FinancialProfile) => {
    setProfile(profileData);
    setStep('assessment');
  };

  const handleContactSubmit = (contactData: ContactInfo) => {
    setContactInfo(contactData);
    setStep('results');
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setAssessment(null);
    setProfile(null);
    setContactInfo(null);
    setStep('profile');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* KLVI Branding */}
        <div className="flex flex-col items-center justify-center mb-4">
          <img
            src="https://i.iheart.com/v3/re/assets.brands/56421c976594a5e45c5e2b947bf0e508?ops=gravity(%22center%22),maxcontain(96,60)"
            alt="News Talk 560 KLVI"
            className="h-16 object-contain mb-2"
          />
          <p className="text-navy-600 font-medium text-sm italic">
            As heard on AM News Talk 560 KLVI
          </p>
        </div>

        {/* Window Title Bar */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500
                      backdrop-blur-xl rounded-t-xl p-4 flex items-center justify-center">
          <h1 className="text-2xl text-white font-semibold tracking-wide">
            What is My Risk Number?
          </h1>
        </div>

        {/* Main Content */}
        <div className="magical-card rounded-b-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-4 text-sm font-medium bg-white/50 
                            backdrop-blur-sm rounded-lg p-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all
                              ${step === 'profile' ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg' : 'text-navy-400'}`}>
                  <Lock className={`w-4 h-4 ${step === 'profile' ? 'animate-float' : ''}`} />
                  Profile
                </div>
                <ArrowRight className="w-4 h-4 text-navy-300" />
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all
                              ${step === 'assessment' ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg' : 'text-navy-400'}`}>
                  <BarChart className={`w-4 h-4 ${step === 'assessment' ? 'animate-float' : ''}`} />
                  Assessment
                </div>
                <ArrowRight className="w-4 h-4 text-navy-300" />
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all
                              ${step === 'contact' || step === 'results' ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg' : 'text-navy-400'}`}>
                  <Shield className={`w-4 h-4 ${step === 'contact' || step === 'results' ? 'animate-float' : ''}`} />
                  Results
                </div>
              </div>
            </div>

            <div className="magical-card rounded-xl p-8">
              {step === 'profile' && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-semibold text-transparent bg-clip-text 
                               bg-gradient-to-r from-blue-700 to-blue-500 mb-6">
                    Your Financial Profile
                  </h2>
                  <FinancialProfileForm onSubmit={handleProfileSubmit} />
                </div>
              )}

              {step === 'assessment' && (
                <div className="animate-fadeIn">
                  <ProgressBar current={currentQuestion + 1} total={questions.length} />
                  <Question
                    question={questions[currentQuestion]}
                    onAnswer={handleAnswer}
                  />
                </div>
              )}

              {step === 'contact' && assessment && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-semibold text-transparent bg-clip-text 
                               bg-gradient-to-r from-blue-700 to-blue-500 mb-2 text-center">
                    Almost There!
                  </h2>
                  <p className="text-navy-600 text-center mb-8">
                    Please provide your contact information to view your personalized results.
                  </p>
                  <ContactForm onSubmit={handleContactSubmit} />
                </div>
              )}

              {step === 'results' && assessment && contactInfo && (
                <div className="animate-fadeIn">
                  <ScoreDisplay assessment={assessment} profile={profile} />
                  <div className="mt-8 text-center">
                    <button
                      onClick={restart}
                      className="magical-button"
                    >
                      Start New Assessment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
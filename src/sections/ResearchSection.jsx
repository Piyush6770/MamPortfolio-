import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { establishedLabsData } from '../data/talksAndEvents';
import { Cpu, Brain, Eye, Activity, Binary, Terminal, Building2, Handshake } from 'lucide-react';

const researchAreaCards = [
  { title: "AI & Soft Computing", icon: Brain, description: "Hybrid neuro-fuzzy models, rule extraction, fuzzy min-max neural networks, decision support frameworks.", topics: ["Fuzzy Min-Max NNs", "Rule Extraction", "Soft Computing", "Expert Systems"] },
  { title: "Machine Learning & Streaming Analytics", icon: Cpu, description: "Concept drift in streaming data, high-dimensional classification, sliding window frameworks.", topics: ["Concept Drift", "Ensemble Methods", "Big Data Analytics", "Sliding Window"] },
  { title: "Deep Learning & Computer Vision", icon: Eye, description: "CNNs, GANs, autoencoders, object detection for visual inspection and medical imaging.", topics: ["Image Segmentation", "Transfer Learning", "GANs", "Object Recognition"] },
  { title: "AI-Assisted Biomedical Diagnostics", icon: Activity, description: "Portable AI screening devices, Pap smear classification, non-invasive skin cancer detection.", topics: ["Cervical Cancer AI", "Dermoscopy", "ECG Processing", "Osteoarthritis"] },
  { title: "NLP & Speech Processing", icon: Binary, description: "Image captioning, summarization, text-to-speech deepfakes, multilingual NLP.", topics: ["LSTM Models", "Captioning", "Summarization", "Multilingual NLP"] },
  { title: "Robotics & Edge AI", icon: Terminal, description: "SLAM map building, autonomous navigation, underwater drones, IoT edge intelligence.", topics: ["ROS & SLAM", "Underwater Drones", "IoT Biofloc", "Edge AI"] },
];

const industryLiaisons = [
  { name: "C-DAC Mumbai", detail: "Collaboration on sponsored PG research in high performance computing and AI." },
  { name: "SVR Infotech, Pune", detail: "MoU for funded research on biomedical devices and robotics." },
  { name: "MIMER Hospital", detail: "MoU for medical dataset creation and clinical validation of cervical cancer screening." },
  { name: "Bennett University & NVIDIA", detail: "MHRD AI Initiative collaboration providing access to GPU supercomputing servers." },
  { name: "Persistent Systems Lab", detail: "Industry project on rule extraction from Fuzzy Min-Max networks." },
  { name: "Creospan Solutions Pvt. Ltd.", detail: "MoU for Big Data NoSQL migration and student internships." },
  { name: "IASST Guwahati", detail: "Research association with DST Scientist Dr. Lipi Mahanta for biomedical AI." },
  { name: "ICT Academy", detail: "MoU signed; organized Bridge Pune event with 1000+ delegates." },
];

export const ResearchSection = () => {
  const [activeTab, setActiveTab] = useState('areas');

  return (
    <section id="research" className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <SectionHeader
          badge="INNOVATION & DISCOVERY"
          title="Research & Innovation"
          subtitle="Specialized areas in Artificial Intelligence, Deep Learning, Soft Computing, and AI-driven Healthcare Diagnostics."
        />

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-700 mb-8 text-sm font-semibold">
          {[['areas', `Research Areas (${researchAreaCards.length})`], ['labs', `Laboratories (${establishedLabsData.length})`], ['liaison', `Industry Liaison (${industryLiaisons.length})`]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === id ? 'tab-active' : 'tab-inactive'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Research Areas */}
        {activeTab === 'areas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {researchAreaCards.map((card, i) => (
              <div key={i} className="glass-card rounded-xl p-6 hover-lift flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center mb-3">
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2" style={{fontFamily: "'Merriweather', serif"}}>{card.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{card.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-700">
                  {card.topics.map((t, ti) => (
                    <span key={ti} className="badge-accent text-[10px]">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Labs */}
        {activeTab === 'labs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {establishedLabsData.map((lab) => (
              <div key={lab.id} className="glass-card rounded-xl p-6 hover-lift">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{fontFamily: "'Merriweather', serif"}}>{lab.name}</h3>
                  <Building2 className="w-4 h-4 text-blue-500 shrink-0 ml-2" />
                </div>
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">Sponsor: {lab.sponsoringAgency}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{lab.objective}</p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                  <strong>Infrastructure:</strong> {lab.equipment}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Industry Liaison */}
        {activeTab === 'liaison' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {industryLiaisons.map((item, i) => (
              <div key={i} className="glass-card rounded-lg p-4 flex items-start gap-3">
                <Handshake className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

import { useProject } from './hooks/useProject';
import { useVersions } from './hooks/useVersions';
import StepBar from './components/layout/StepBar';
import Toolbar from './components/layout/Toolbar';
import Sidebar from './components/layout/Sidebar';
import Step1_StoryInput from './components/steps/Step1_StoryInput';
import Step2_Scenario from './components/steps/Step2_Scenario';
import Step3_StoryboardPreview from './components/steps/Step3_StoryboardPreview';
import Step4_Editor from './components/steps/Step4_Editor';
import Step5_PromptResult from './components/steps/Step5_PromptResult';

const isDemoMode = () => {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
  return !key || key === 'your_api_key_here' || key.trim() === '';
};

function DemoBanner() {
  return (
    <div style={{
      backgroundColor: '#FFF8E6',
      borderBottom: '1px solid #FFE9A3',
      padding: '9px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '13px',
      color: '#664D00',
    }}>
      <span style={{
        backgroundColor: '#F59E0B',
        color: 'white',
        fontWeight: '700',
        fontSize: '10px',
        padding: '2px 8px',
        borderRadius: '999px',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        flexShrink: 0,
      }}>DEMO</span>
      <span>
        API 키 없이 샘플 데이터로 실행 중입니다. 실제 AI 생성을 사용하려면{' '}
        <code style={{ backgroundColor: '#FFF0C0', padding: '1px 5px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>.env</code>
        {' '}파일에{' '}
        <code style={{ backgroundColor: '#FFF0C0', padding: '1px 5px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>VITE_ANTHROPIC_API_KEY</code>
        를 입력하세요.
      </span>
    </div>
  );
}

export default function App() {
  const { project, setProject, updateProject, updateFixedValues, goToStep, resetProject } = useProject();
  const { versions, saveVersion, loadVersion, deleteVersion, exportVersionsJSON, importVersionsJSON } = useVersions(project);

  const props = {
    project, setProject, updateProject, updateFixedValues, goToStep, resetProject,
    versions, saveVersion, loadVersion, deleteVersion, exportVersionsJSON, importVersionsJSON,
  };

  const showSidebar = project.step >= 4;

  return (
    <div style={{ backgroundColor: 'var(--page-bg)', minHeight: '100vh' }}>
      {isDemoMode() && <DemoBanner />}
      <Toolbar {...props} />
      <StepBar currentStep={project.step} goToStep={goToStep} />
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: showSidebar ? 'flex-start' : 'center',
        }}
      >
        {showSidebar && <Sidebar {...props} />}
        <main
          style={{
            flex: 1,
            padding: '32px 24px',
            maxWidth: showSidebar ? 'none' : '840px',
            width: '100%',
          }}
        >
          {project.step === 1 && <Step1_StoryInput {...props} />}
          {project.step === 2 && <Step2_Scenario {...props} />}
          {project.step === 3 && <Step3_StoryboardPreview {...props} />}
          {project.step === 4 && <Step4_Editor {...props} />}
          {project.step === 5 && <Step5_PromptResult {...props} />}
        </main>
      </div>
    </div>
  );
}

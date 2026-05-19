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

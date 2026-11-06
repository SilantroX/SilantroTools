// src/tools/qr-generator/QrTool.tsx
import { useState } from 'preact/hooks';
import type { QrOptionsState, QrStep } from './types';
import QrStepIndicator from './components/QrStepIndicator';
import Step1ContentType from './components/Step1ContentType';
import Step2ContentInput from './components/Step2ContentInput';
import Step3Customize from './components/Step3Customize';
import Step4Result from './components/Step4Result';

const DEFAULT_STATE: QrOptionsState = {
  contentType: 'url',
  rawText: 'https://silantrolabs.com',
  wifi: {
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  },
  vcard: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    organization: 'Silantro Labs',
    url: 'https://silantrolabs.com',
  },
  emailAddress: '',
  emailSubject: '',
  emailBody: '',

  dotsType: 'rounded',
  cornersSquareType: 'extra-rounded',
  cornersDotType: 'dot',

  dotsColor: '#09090b',
  bgColor: '#ffffff',
  cornersSquareColor: '#09090b',
  cornersDotColor: '#09090b',

  logoUrl: undefined,
  isBrandLogoActive: false,
  logoSize: 0.26,
  margin: 10,
  errorCorrectionLevel: 'Q',

  downloadSize: 1024,
  downloadFormat: 'png',
};

export default function QrTool() {
  const [currentStep, setCurrentStep] = useState<QrStep>(1);
  const [maxReachableStep, setMaxReachableStep] = useState<QrStep>(1);
  const [qrState, setQrState] = useState<QrOptionsState>(DEFAULT_STATE);

  const handleUpdate = (updates: Partial<QrOptionsState>) => {
    setQrState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const advanceTo = (step: QrStep) => {
    setCurrentStep(step);
    setMaxReachableStep((prev) => (step > prev ? step : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    if (confirm('¿Deseas reiniciar y volver a la configuración inicial?')) {
      setQrState(DEFAULT_STATE);
      setCurrentStep(1);
      setMaxReachableStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div class="w-full min-w-0 max-w-full">
      {/* Indicador Minimalista y Editorial de Progreso */}
      <QrStepIndicator
        currentStep={currentStep}
        onStepClick={(s) => advanceTo(s)}
        maxReachableStep={maxReachableStep}
        onReset={handleReset}
      />

      {/* Contenedor de la Etapa Activa */}
      <main class="w-full min-w-0 max-w-full">
        {currentStep === 1 && (
          <Step1ContentType
            selectedType={qrState.contentType}
            onSelect={(type) => handleUpdate({ contentType: type })}
            onContinue={() => advanceTo(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2ContentInput
            state={qrState}
            onChange={handleUpdate}
            onBack={() => advanceTo(1)}
            onContinue={() => advanceTo(3)}
            onDirectDownload={() => advanceTo(4)}
          />
        )}

        {currentStep === 3 && (
          <Step3Customize
            state={qrState}
            onChange={handleUpdate}
            onBack={() => advanceTo(2)}
            onContinue={() => advanceTo(4)}
          />
        )}

        {currentStep === 4 && (
          <Step4Result
            state={qrState}
            onChange={handleUpdate}
            onEditStyle={() => advanceTo(3)}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}

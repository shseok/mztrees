import React, { useState } from 'react';
import WriteIntroForm from '~/components/write/WriteIntroForm';
import WriteLinkForm from '~/components/write/WriteLinkForm';
import { useProtectedRoute } from '~/hooks/useProtectedRoute';

type Step = 'link' | 'intro';

const Write = () => {
  const [step, setStep] = useState<Step>('link');
  const hasPermission = useProtectedRoute();
  if (!hasPermission) {
    return null;
  }

  const stepRenderer = {
    link: () => <WriteLinkForm onProceed={() => setStep('intro')} />,
    intro: () => <WriteIntroForm />,
  };

  return stepRenderer[step]();
};

export default Write;

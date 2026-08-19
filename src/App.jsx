import { useEffect, useRef } from 'react';
import BottomCta from './components/BottomCta';
import Home from './components/Home';
import Landing from './components/Landing';
import TopBar from './components/TopBar';
import Withdraw from './components/Withdraw';
import Step1Size from './components/steps/Step1Size';
import Step2Valuables from './components/steps/Step2Valuables';
import Step3Space from './components/steps/Step3Space';
import Step4Duration from './components/steps/Step4Duration';
import Step5Policy from './components/steps/Step5Policy';
import Step5Customer from './components/steps/Step5Customer';
import Step6Photos from './components/steps/Step6Photos';
import Step7Review from './components/steps/Step7Review';
import Step8Complete from './components/steps/Step8Complete';
import { useBookingState } from './state/BookingContext';
import { useStorageState } from './state/StorageContext';

const STEP_COMPONENTS = {
  1: Step1Size,
  2: Step2Valuables,
  3: Step3Space,
  4: Step4Duration,
  5: Step5Policy,
  6: Step5Customer,
  7: Step6Photos,
  8: Step7Review,
  9: Step8Complete,
};

function StepScreen() {
  const { step } = useBookingState();
  const StepComponent = STEP_COMPONENTS[step] || Step1Size;
  return (
    <div className="screen active">
      <StepComponent />
    </div>
  );
}

export default function App() {
  const { step } = useBookingState();
  const { showHome, showWithdraw } = useStorageState();
  const screensRef = useRef(null);

  useEffect(() => {
    if (!screensRef.current) return;
    screensRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [step]);

  if (showWithdraw) {
    return <Withdraw />;
  }

  if (showHome) {
    return <Home />;
  }

  if (step === 0) {
    return (
      <div className="device landing-device">
        <Landing />
      </div>
    );
  }

  return (
    <div className="device">
      <div className="notch" />
      <div className="statusbar" />
      <TopBar />
      <div className="screens" ref={screensRef}>
        <StepScreen />
      </div>
      <BottomCta />
    </div>
  );
}

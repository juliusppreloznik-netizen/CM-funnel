import { Switch, Route } from "wouter";
import { Toaster } from "./components/ui/toaster";

// Funnel pages
import LandingPage from "./pages/LandingPage";
import StepOne from "./pages/StepOne";
import StepTwo from "./pages/StepTwo";
import StepThree from "./pages/StepThree";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Switch>
        {/* Funnel entry — landing / opt-in */}
        <Route path="/" component={LandingPage} />

        {/* Multi-step qualification flow */}
        <Route path="/step/1" component={StepOne} />
        <Route path="/step/2" component={StepTwo} />
        <Route path="/step/3" component={StepThree} />

        {/* Conversion confirmation */}
        <Route path="/thank-you" component={ThankYou} />

        {/* 404 fallback */}
        <Route component={NotFound} />
      </Switch>

      <Toaster />
    </>
  );
}

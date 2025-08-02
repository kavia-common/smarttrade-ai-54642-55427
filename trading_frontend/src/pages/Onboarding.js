import React, { useState } from "react";
import { useApi } from "../contexts/ApiContext";
import { useAuth } from "../contexts/AuthContext";
import { getApiErrorMessage } from "../api/apiError";
import { useNavigate } from "react-router-dom";

/** PUBLIC_INTERFACE
 * Onboarding page: Handles registration (step 1), KYC initiation (step 2), survey (step 3), and finalization (step 4).
 * Responsive and connected to API.
 */
export default function Onboarding() {
  const { AuthAPI, OnboardingAPI } = useApi();
  const { login } = useAuth();
  const navigate = useNavigate();
  // Steps: 0 = registration, 1 = verify, 2 = kyc_questions, 3 = finished
  const [step, setStep] = useState(0);

  // Registration state
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [kycQuestions, setKycQuestions] = useState([]);
  const [kycAnswers, setKycAnswers] = useState([]);
  const [userId, setUserId] = useState("");
  const [kycStatus, setKycStatus] = useState("");
  const [kycDetail, setKycDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Registration form submit
  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const signupRes = await AuthAPI.signup({ email, password, full_name: fullName });
      setUserId(signupRes.user?.user_id || "");
      // Log user in with JWT if returned, or prompt for login otherwise
      if (signupRes.accessToken) {
        login({ email: signupRes.user.email, user_id: signupRes.user.user_id }, signupRes.accessToken);
      }
      await OnboardingAPI.onboardingStart({ email, full_name: fullName, agreed_terms: terms });
      setStep(1);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
    setLoading(false);
  }

  // Start KYC
  async function handleStartKyc() {
    setLoading(true);
    setError("");
    try {
      const res = await OnboardingAPI.kycStart({ user_id: userId });
      setKycQuestions(res.questions || []);
      setKycAnswers(Array(res.questions?.length || 0).fill(""));
      setStep(2);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
    setLoading(false);
  }

  // Submit KYC answers
  async function handleKycSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await OnboardingAPI.kycSubmit({ user_id: userId, answers: kycAnswers });
      setKycStatus(res.status);
      setKycDetail(res.detail);
      setStep(3);
      // Optionally: Log in authenticated state
      login({ email, user_id: userId });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
    setLoading(false);
  }

  function handleAnswerChange(idx, val) {
    setKycAnswers(a => {
      const cp = [...a];
      cp[idx] = val;
      return cp;
    });
  }

  return (
    <div className="page-container" style={{maxWidth: 460}}>
      <h1>Onboarding</h1>
      {step === 0 && (
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <label>
            <span>Email</span><br />
            <input
              type="email"
              value={email}
              autoComplete="email"
              required
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
          <label>
            <span>Full Name</span><br />
            <input
              type="text"
              value={fullName}
              required
              onChange={e => setFullName(e.target.value)}
              disabled={loading}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
          <label>
            <span>Password</span><br />
            <input
              type="password"
              minLength={8}
              value={password}
              autoComplete="new-password"
              required
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.6em" }}>
            <input
              type="checkbox"
              checked={terms}
              required
              onChange={e => setTerms(e.target.checked)}
              disabled={loading}
            />
            I agree to Terms of Service
          </label>
          <button
            type="submit"
            className="btn btn-large"
            style={{marginTop: 8}}
            disabled={loading}
          >{loading ? "Processing..." : "Continue"}</button>
          {error && <span style={{ color: "crimson", fontWeight:"bold"}}>{error}</span>}
        </form>
      )}
      {step === 1 && (
        <div>
          <p>Registration completed! Start your KYC/risk questionnaire below.</p>
          <button
            className="btn btn-large"
            onClick={handleStartKyc}
            disabled={loading}
          >{loading ? "Loading..." : "Begin KYC"}</button>
          {error && <span style={{ color: "crimson", fontWeight:"bold"}}>{error}</span>}
        </div>
      )}
      {step === 2 && (
        <form onSubmit={handleKycSubmit} style={{display:"flex", flexDirection:"column", gap:12}}>
          <h3>Risk Profile Questionnaire</h3>
          {(kycQuestions ?? []).map((q, i) => (
            <label key={i} style={{ display: "flex", flexDirection: "column", fontWeight:400 }}>
              <span>{q}</span>
              <input
                type="text"
                value={kycAnswers[i] || ""}
                required
                onChange={e => handleAnswerChange(i, e.target.value)}
                disabled={loading}
                style={{ width: "100%", padding: 7, marginTop: 6, borderRadius: 4, border: "1px solid #ddd" }}
              />
            </label>
          ))}
          <button
            type="submit"
            className="btn btn-large"
            style={{marginTop:8}}
            disabled={loading || kycAnswers.some(a => !a)}
          >{loading ? "Submitting..." : "Submit KYC"}</button>
          {error && <span style={{ color: "crimson", fontWeight:"bold"}}>{error}</span>}
        </form>
      )}
      {step === 3 && (
        <div>
          <h3>KYC Status: <span style={{ color: kycStatus === "approved" ? "green" : "#d97306" }}>{kycStatus}</span></h3>
          <p>{kycDetail ? kycDetail : "Thank you. You will be redirected..."}</p>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiContext";
import { useAuth } from "../contexts/AuthContext";
import { getApiErrorMessage } from "../api/apiError";
import { useNavigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * KYC view if user lands directly, fetches questions and handles submission.
 */
export default function KYC() {
  const { OnboardingAPI } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [kycStatus, setKycStatus] = useState("");
  const [kycDetail, setKycDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load KYC questions on start (if user available)
  useEffect(() => {
    async function loadQuestions() {
      if (!user || !user.user_id) return;
      setLoading(true);
      try {
        const res = await OnboardingAPI.kycStart({ user_id: user.user_id });
        setQuestions(res.questions || []);
        setAnswers(Array(res.questions?.length || 0).fill(""));
        setError("");
      } catch (err) {
        setError(getApiErrorMessage(err));
      }
      setLoading(false);
    }
    if (user && user.user_id) {
      loadQuestions();
    }
  }, [user?.user_id, OnboardingAPI]);

  function handleAnswerChange(idx, val) {
    setAnswers(a => {
      const cp = [...a];
      cp[idx] = val;
      return cp;
    });
  }

  async function handleKycSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await OnboardingAPI.kycSubmit({ user_id: user.user_id, answers });
      setKycStatus(res.status);
      setKycDetail(res.detail);
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
    setLoading(false);
  }

  if (!user || !user.user_id)
    return (
      <div className="page-container">
        <h1>KYC Verification</h1>
        <p>You must complete onboarding and registration first.</p>
      </div>
    );
  return (
    <div className="page-container" style={{maxWidth: 460}}>
      <h1>KYC Verification</h1>
      {kycStatus ? (
        <div>
          <h3>Status: <span style={{ color: kycStatus === "approved" ? "green" : "#db8800" }}>{kycStatus}</span></h3>
          <div>{kycDetail || "Processing..."}</div>
        </div>
      ) : (
        <form onSubmit={handleKycSubmit} style={{display:"flex", flexDirection:"column", gap:12}}>
          <h3>Risk Profile Questionnaire</h3>
          {(questions || []).map((q, i) => (
            <label key={i} style={{ display:"flex", flexDirection:"column" }}>
              <span>{q}</span>
              <input
                type="text"
                value={answers[i] || ""}
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
            disabled={loading || answers.some(a => !a)}
          >{loading ? "Submitting..." : "Submit KYC"}</button>
          {error && <span style={{ color: "crimson", fontWeight:"bold"}}>{error}</span>}
        </form>
      )}
    </div>
  );
}

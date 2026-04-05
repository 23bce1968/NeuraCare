import DoctorModel from "../models/HCProvider.js";
import HealthRecord from "../models/HealthRecord.js";
import WorkerProfile from "../models/WorkerProfile.js";

import { model } from "../utils/Gemini.js";
/* 🔥 Get all pending doctors */
export const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({ isVerified: false });
    return res.json(doctors);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching doctors" });
  }
};
export const getApprovedDoctors = async(req,res) => {
  try {
    const doctors = await DoctorModel.find({isVerified:true})
    return res.json(doctors)
  } catch (error) {
    return res.status(500).json({ message: "Error fetching doctors" });
  }
}
/* 🔥 Approve doctor */
export const approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    await DoctorModel.findByIdAndUpdate(id, {
      isVerified: true,
    });

    res.json({ message: "Doctor approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error approving doctor" });
  }
};

/* 🔥 Reject doctor */
export const rejectDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    await DoctorModel.findByIdAndDelete(id);

    res.json({ message: "Doctor rejected" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting doctor" });
  }
};

export const getAiInsights = async (req, res) => {
  try {
    // ✅ Step 1: Get ONLY workers who gave consent
    const consentedProfiles = await WorkerProfile.find({
      "consent.shareWithAdmin": true,
    }).select("userId location age gender occupation");

    const consentedUserIds = consentedProfiles.map((p) => p.userId.toString());

    if (consentedUserIds.length === 0) {
      return res.json({
        message: "No workers have given consent to share data.",
        summary: "No data available — no workers have consented to share their health information with the admin.",
        totalCases: 0,
        alerts: [],
        highRiskAreas: [],
        locationData: [],
        trend: [],
        severityStats: [],
        ageGroupStats: [],
        topDiagnoses: [],
        recommendations: ["Encourage workers to enable data sharing from their dashboard for better public health insights."],
        consentStats: { total: await WorkerProfile.countDocuments(), consented: 0 },
      });
    }

    // ✅ Step 2: Fetch health records ONLY for consented workers
    const records = await HealthRecord.find({
      workerId: { $in: consentedUserIds },
    }).limit(200);

    if (!records.length) {
      return res.json({
        message: "No health records found for consented workers.",
        summary: "Workers have consented but no health records exist yet.",
        totalCases: 0, alerts: [], highRiskAreas: [], locationData: [],
        trend: [], severityStats: [], ageGroupStats: [], topDiagnoses: [],
        recommendations: [],
        consentStats: {
          total: await WorkerProfile.countDocuments(),
          consented: consentedUserIds.length,
        },
      });
    }

    // Step 3: Build profile map
    const profileMap = {};
    consentedProfiles.forEach((p) => {
      profileMap[p.userId.toString()] = {
        location: p.location,
        age: p.age,
        gender: p.gender,
        occupation: p.occupation,
      };
    });

    // Step 4: Enrich records with profile data
    const enrichedData = records.map((r) => {
      const profile = profileMap[r.workerId?.toString()] || {};
      return {
        symptoms: r.symptoms,
        diagnosis: r.diagnosis,
        severity: r.diagnosisSeverity,
        date: r.createdAt,
        location: profile.location || "Unknown",
        age: profile.age || null,
        gender: profile.gender || null,
        occupation: profile.occupation || null,
      };
    });

    const locationCounts = {};
    enrichedData.forEach((r) => {
      locationCounts[r.location] = (locationCounts[r.location] || 0) + 1;
    });

    // Step 5: AI prompt
    const prompt = `
You are a public health AI system for migrant worker healthcare.

Analyze the following health records (only from workers who consented to share data) and give comprehensive insights.

DATA:
${JSON.stringify(enrichedData)}

LOCATION CASE COUNTS:
${JSON.stringify(locationCounts)}

Return ONLY raw JSON (no markdown, no backticks, no explanation):

{
  "summary": "2-3 sentence overview of the health situation",
  "totalCases": <number>,
  "alerts": [
    { "title": "alert title", "description": "details", "severity": "high|medium|low" }
  ],
  "highRiskAreas": [
    { "location": "area name", "cases": <number>, "riskLevel": "high|medium|low", "topDiagnosis": "most common diagnosis" }
  ],
  "locationData": [
    { "location": "area name", "cases": <number> }
  ],
  "trend": [
    { "day": "Mon", "cases": <number> }
  ],
  "severityStats": [
    { "name": "mild", "value": <number> },
    { "name": "moderate", "value": <number> },
    { "name": "severe", "value": <number> },
    { "name": "critical", "value": <number> }
  ],
  "ageGroupStats": [
    { "group": "18-25", "cases": <number> },
    { "group": "26-35", "cases": <number> },
    { "group": "36-45", "cases": <number> },
    { "group": "46+", "cases": <number> }
  ],
  "topDiagnoses": [
    { "name": "diagnosis name", "count": <number> }
  ],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let aiData;
    try {
      aiData = JSON.parse(cleanText);
    } catch (err) {
      console.log("AI RAW:", text);
      return res.json({ message: "AI parsing failed", raw: text });
    }

    // ✅ Add consent stats to the response
    const totalWorkers = await WorkerProfile.countDocuments();
    aiData.consentStats = {
      total: totalWorkers,
      consented: consentedUserIds.length,
    };

    res.json(aiData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
import { CaseModel } from "../models/case.js";

// GET → Serve upload page
export const ShowAllCases = (req, res) => {
  res.redirect("/caseList.html");
};

export const fetchAllCases = async (req, res, isLoggedIn) => {
  try {
    const cases = await CaseModel.find().sort({ CaseId: 1 });

    res.json({
      success: true,
      cases
    });

  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch cases",
      details: err.message
    });
  }
}

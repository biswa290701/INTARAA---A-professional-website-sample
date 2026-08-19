import { CaseModel } from "../models/case.js";

// GET → Serve upload page
export const serveUploadPage = (req, res) => {
  res.redirect("/uploadpage.html");
};

// POST → Save case
const handleCaseUpload = async (req, res) => {
  try {
    const { CasePrompt, CaseVoiceId } = req.body;

    const newCase = new CaseModel({
      CasePrompt,
      CaseVoiceId: CaseVoiceId || undefined // default used automatically
    });

    const saved = await newCase.save();

    res.status(200).json({ message: "Case uploaded successfully. Case id is: "+ saved.CaseId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload case", details: err.message });
  }
};

export default handleCaseUpload;
